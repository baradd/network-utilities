import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IpMonitorModule } from './modules/ip-monitor/ip-monitor.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    IpMonitorModule,
    TelegramModule,
    ConfigModule.forRoot({
      isGlobal: true, // no need to import ConfigModule in every module
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
