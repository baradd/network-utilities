// modules/uptime/uptime.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BaseService } from 'src/common/crud/base.service';
import { IpMonitorService } from '../ip-monitor/ip-monitor.service';
import { UptimeMonitor } from './entities/uptime-monitor.entity';
import { UptimeMonitorRepository } from './repositories/uptime-monitor.repository';
import { UptimeStatus } from 'src/common/consts/uptime-status.enum';

export interface CheckResult {
  url: string;
  status: UptimeStatus;
  statusCode?: number;
  responseTime?: number;
  error?: string;
}

@Injectable()
export class UptimeMonitorService extends BaseService<UptimeMonitor> {
  private readonly logger = new Logger(UptimeMonitorService.name);
  private onDownCallbacks: ((
    monitor: UptimeMonitor,
    result: CheckResult,
  ) => void)[] = [];
  private onRecoverCallbacks: ((
    monitor: UptimeMonitor,
    result: CheckResult,
  ) => void)[] = [];

  constructor(
    private readonly uptimeRepo: UptimeMonitorRepository,
    private readonly ipMonitorService: IpMonitorService,
  ) {
    super(uptimeRepo);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async runScheduledChecks() {
    const monitors = await this.uptimeRepo.findAllActive();
    for (const monitor of monitors) {
      if (!this.isDue(monitor)) continue;
      const result = await this.checkUrl(monitor.url);
      await this.handleResult(monitor, result);
    }
  }

  async checkUrl(url: string): Promise<CheckResult> {
    const result = await this.ipMonitorService.checkHttp(url);
    return { url, ...result, status: result.status as UptimeStatus };
  }

  private async handleResult(monitor: UptimeMonitor, result: CheckResult) {
    const wasDown = monitor.lastStatus === UptimeStatus.DOWN;
    const isDown = result.status === UptimeStatus.DOWN;

    if (isDown && !wasDown) {
      this.onDownCallbacks.forEach((cb) => cb(monitor, result));
    }

    if (!isDown && wasDown) {
      this.onRecoverCallbacks.forEach((cb) => cb(monitor, result));
    }

    await this.uptimeRepo.update(monitor.id, {
      lastStatus: result.status,
      lastResponseTime: result.responseTime,
      lastStatusCode: result.statusCode,
      lastCheckedAt: new Date(),
      consecutiveFailures: isDown ? monitor.consecutiveFailures + 1 : 0,
    });
  }

  private isDue(monitor: UptimeMonitor): boolean {
    if (!monitor.lastCheckedAt) return true;
    const diff = Date.now() - new Date(monitor.lastCheckedAt).getTime();
    return diff >= monitor.intervalMinutes * 60 * 1000;
  }

  onDown(cb: (monitor: UptimeMonitor, result: CheckResult) => void) {
    this.onDownCallbacks.push(cb);
  }

  onRecover(cb: (monitor: UptimeMonitor, result: CheckResult) => void) {
    this.onRecoverCallbacks.push(cb);
  }
}
