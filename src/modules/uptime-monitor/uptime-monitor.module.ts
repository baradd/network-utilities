import { Module } from '@nestjs/common';
import { UptimeMonitorService } from './uptime-monitor.service';
import { UptimeMonitorController } from './uptime-monitor.controller';
import { UptimeMonitorRepository } from './repositories/uptime-monitor.repository';
import { IpMonitorModule } from '../ip-monitor/ip-monitor.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UptimeMonitor } from './entities/uptime-monitor.entity';

@Module({
  imports: [IpMonitorModule, TypeOrmModule.forFeature([UptimeMonitor])],
  controllers: [UptimeMonitorController],
  providers: [UptimeMonitorService, UptimeMonitorRepository],
})
export class UptimeMonitorModule {}
