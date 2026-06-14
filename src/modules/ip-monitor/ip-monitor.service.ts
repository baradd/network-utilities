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
import { TraceHop, TracerouteResponse } from './dtos/traceroute-response.dto';
import { spawn } from 'child_process';

@Injectable()
export class IpMonitorService {
  async test() {
    const file = readFileSync(path.join(process.cwd(), 'hosts.txt'), {
      encoding: 'utf-8',
    });
    const hosts = file.split('\n');
    const res = await Promise.all(
      hosts.map((host) => this.tranceroute(host, 6000)),
    );
    return res;
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

  checkTCP(
    host: string,
    port: number = 80,
    timeout: number = 3000,
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      let settled = false;

      const done = (result: boolean) => {
        if (settled) return;
        settled = true;
        socket.destroy();
        resolve(result);
      };

      socket.setTimeout(timeout);

      socket.connect(port, host);

      socket.on('connect', () => done(true));
      socket.on('timeout', () => done(false)); // idle timeout → close
      socket.on('error', () => done(false)); // ECONNREFUSED, EHOSTUNREACH etc
    });
  }

  checkUDP(
    host: string,
    port: number,
    timeout: number = 3000,
  ): Promise<boolean> {
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

  async scanPortRange(
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

    //scan many ports together to avoid opening many sockets
    for (let i = 0; i < ports.length; i += concurrency) {
      const chunk = ports.slice(i, i + concurrency);
      const result = await Promise.all(
        chunk.map(async (port) => ({
          port,
          open: await this.checkTCP(host, port, timeout),
        })),
      );
      openPorts.push(...result.filter((r) => r.open));
    }
    return {
      host,
      startPort,
      endPort,
      openPorts,
      totalScanned: ports.length,
      duration: Date.now() - startTime,
    };
  }

  async tranceroute(
    host: string,
    timeout: number = 3000,
  ): Promise<TracerouteResponse> {
    const startTime = Date.now();
    const command = 'traceroute';
    const args = ['-n', '-w', '3', host];
    //-n No DNS reverse - make it faster
    // -w = wait 3 seconds per probe
    return new Promise((resolve, reject) => {
      const hops: TraceHop[] = [];
      let settled = false;

      if (!this.validateIp(host)) {
        this.checkDNS(host).then((res) => (host = res.ips[0]));
      }

      const done = (result: TracerouteResponse) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(result);
      };

      const proc = spawn(command, args);
      let output = '';

      proc.stdout.on('data', (data: Buffer) => (output += data.toString()));
      proc.stderr.on('data', (data: Buffer) => (output += data.toString()));

      const timer = setTimeout(() => {
        proc.kill();
        done({ host, hops, duration: Date.now() - startTime, reached: false });
      }, timeout);

      proc.on('close', () => {
        const lines = output.split('\n');
        for (const line of lines) {
          const hop = this.parseTracerouteLine(line);
          if (hop) hops.push(hop);
        }
        const reached = hops.some((h) => h.ip === host || h.host === host);
        done({ host, hops, duration: Date.now() - startTime, reached });
      });

      proc.on('error', reject);
    });
  }

  parseTracerouteLine(line: string): TraceHop | null {
    const clean = line.trim();
    if (!clean || !/^\d+/.test(clean)) return null;

    const hopMatch = clean.match(/^(\d+)\s+/);
    if (!hopMatch) return null;
    const hop = parseInt(hopMatch[1]);

    // all timeouts
    if (/^\d+\s+\*\s+\*\s+\*/.test(clean)) {
      return { hop, host: null, ip: null, times: [null, null, null] };
    }

    const ipMatch = clean.match(/(\d+\.\d+\.\d+\.\d+)/);
    const ip = ipMatch ? ipMatch[1] : null;

    const timeMatches = [...clean.matchAll(/([\d.]+)\s+ms/g)];
    const times = timeMatches.map((m) => parseFloat(m[1]));

    return {
      hop,
      ip,
      host: ip, // with -n flag, no hostname resolution
      times: times.length ? times : [null, null, null],
    };
  }

  validateIp(str: string) {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$/;

    return str.match(ipv4Regex) || str.match(ipv6Regex);
  }
}
