import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { IpMonitorModule } from '../ip-monitor/ip-monitor.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [IpMonitorModule, UsersModule],
  controllers: [TelegramController],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
