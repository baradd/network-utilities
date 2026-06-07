import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IpMonitorModule } from './modules/ip-monitor/ip-monitor.module';

@Module({
  imports: [IpMonitorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
