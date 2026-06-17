import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IpMonitorModule } from './modules/ip-monitor/ip-monitor.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';
import { SqliteModule } from './core/database/sqlite.module';
import { UsersModule } from './modules/users/users.module';
import { UptimeMonitorModule } from './modules/uptime-monitor/uptime-monitor.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    IpMonitorModule,
    TelegramModule,
    SqliteModule,
    UsersModule,
    UptimeMonitorModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true, // no need to import ConfigModule in every module
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
