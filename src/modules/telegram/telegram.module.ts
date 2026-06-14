import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { IpMonitorModule } from '../ip-monitor/ip-monitor.module';

@Module({
  imports: [IpMonitorModule],
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class TelegramModule {}
