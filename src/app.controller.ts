import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TelegramService } from './modules/telegram/telegram.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly telegramService: TelegramService,
  ) {}

  @Get()
  getHello(): any {
    this.telegramService.sendMessage('143671960', 'Hi');
  }
}
