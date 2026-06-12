import { Injectable } from '@nestjs/common';
import * as ping from 'ping';
import { readFileSync } from 'fs';
import path from 'path';
import * as net from 'net';
import * as dgram from 'dgram';
import { Resolver } from 'dns/promises';
import {
  PortRangeScanResult,
  PortScanResult,
} from './dtos/scan-range-port-response.dto';

@Injectable()
export class IpMonitorService {
  async test() {
    const file = readFileSync(path.join(process.cwd(), 'hosts.txt'), {
      encoding: 'utf-8',
    });
    const hosts = file.split('\n');
    const res = await Promise.all(hosts.map((host) => this.checkTCP(host)));
    console.log(res);
  }

  async checkAliveBulk(hosts?: string[]) {
    if (!hosts) {
      const file = readFileSync(path.join(process.cwd(), 'hosts.txt'), {
        encoding: 'utf-8',
      });
      hosts = file.split('\n');
    }

    const response = await Promise.all(
      hosts.map((host) => this.checkAlive(host)),
    );
    response.sort((a, b) => a['time'] - b['time']);
    return response;
  }

  checkAlive(host: string): Promise<boolean> {
    return ping.promise.probe(host);
  }

  checkTCP(host: string, port: number = 80, timeout: number = 3000) {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(timeout);
      socket
        .connect(port, host, () => {
          socket.destroy();
          resolve(true);
        })
        .on('timeout', () => {
          socket.destroy();
          resolve(false);
        })
        .on('error', () => resolve(false));
    });
  }

  checkUDP(host: string, port: number, timeout = 3000): Promise<boolean> {
    return new Promise((resolve) => {
      const client = dgram.createSocket('udp4');

      const message = Buffer.from('ping');
      let settled = false;

      const done = (result: boolean) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        client.close();
        resolve(result);
      };

      const timer = setTimeout(() => done(false), timeout);

      client.send(message, port, host, (err) => {
        if (err) return done(false);
        client.once('message', () => done(true));
        client.once('error', () => done(false));
      });
    });
  }

  async checkDNS(
    host: string,
    dnsServer?: string,
  ): Promise<{ alive: boolean; ips: string[] }> {
    const resolver = new Resolver();
    if (dnsServer) resolver.setServers([dnsServer]);

    try {
      const ips = await resolver.resolve4(host);
      return { alive: true, ips };
    } catch {
      return { alive: false, ips: [] };
    }
  }

  scanPortRange(
    host: string,
    startPort: number = 1,
    endPort: number = 1024,
    options: { timeout?: number; concurrency?: number },
  ): Promise<PortRangeScanResult> {
    const { concurrency = 50, timeout = 3000 } = options;
    const startTime = Date.now();

    const openPorts: PortScanResult[] = [];

    const ports = Array.from(
      { length: endPort - startPort + 1 },
      (_, i) => startPort + i,
    );
  }
}
