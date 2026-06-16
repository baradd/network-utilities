import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { IpMonitorModule } from '../ip-monitor/ip-monitor.module';
import { UsersModule } from '../users/users.module';
import { TelegramProfile } from './entities/telegram-profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramRepository } from './repositories/telegram.repository';

@Module({
  imports: [
    IpMonitorModule,
    UsersModule,
    TypeOrmModule.forFeature([TelegramProfile]),
  ],
  controllers: [TelegramController],
  providers: [TelegramService, TelegramRepository],
  exports: [TelegramService],
})
export class TelegramModule {}
