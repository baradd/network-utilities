import { Injectable } from '@nestjs/common';
import * as ping from 'ping';
import { readFileSync, readFile } from 'fs';
import path from 'path';
@Injectable()
export class IpMonitorService {
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
}
