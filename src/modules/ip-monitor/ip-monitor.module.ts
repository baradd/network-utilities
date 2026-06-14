import { Module } from '@nestjs/common';
import { IpMonitorController } from './ip-monitor.controller';
import { IpMonitorService } from './ip-monitor.service';

@Module({
  controllers: [IpMonitorController],
  providers: [IpMonitorService],
  exports: [IpMonitorService],
})
export class IpMonitorModule {}
