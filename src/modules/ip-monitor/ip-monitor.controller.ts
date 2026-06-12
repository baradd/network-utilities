import { Controller, Get } from '@nestjs/common';
import { IpMonitorService } from './ip-monitor.service';

@Controller('ip-monitor')
export class IpMonitorController {
  constructor(private readonly ipMonitorService: IpMonitorService) {}

  @Get()
  checkAliveBulk() {
    return this.ipMonitorService.test();
  }
}
