import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { IpMonitorService } from '../ip-monitor/ip-monitor.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Telegraf;
  private readonly logger = new Logger(TelegramService.name);

  constructor(private readonly ipMonitorService: IpMonitorService) {
    this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);
    console.log(process.env.TELEGRAM_BOT_TOKEN);
  }

  onModuleInit() {
    this.registerCommands();
    this.bot.launch();
    this.logger.log('Telegram bot started');
  }

  private registerCommands() {
    this.bot.start((ctx) =>
      ctx.reply(
        '👋 Welcome to Network Monitor Bot!\n\n' +
          'Available commands:\n' +
          '/ping <host> — ICMP check\n' +
          '/tcp <host> <port> — TCP port check\n' +
          '/udp <host> <port> — UDP port check\n' +
          '/dns <host> [dnsServer] — DNS lookup\n' +
          '/portscan <host> <startPort> <endPort> — Port range scan\n' +
          '/traceroute <host> — Traceroute\n',
      ),
    );
  }
}
