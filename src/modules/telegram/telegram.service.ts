import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Context, Telegraf } from 'telegraf';
import { IpMonitorService } from '../ip-monitor/ip-monitor.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: Telegraf;
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    private readonly ipMonitorService: IpMonitorService,
    private readonly userService: UsersService,
  ) {
    this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);
  }

  onModuleInit() {
    this.registerCommands();
    this.registerEvents();
    this.bot.launch();
    this.logger.log('Telegram bot started');
  }

  private registerEvents() {
    this.bot.on('message', (ctx) => {
      console.log(ctx.from);
      console.log(ctx.chat);
    });
  }

  private registerCommands() {
    this.bot.start((ctx) => {
      ctx.reply(
        '👋 Welcome to Network Monitor Bot!\n\n' +
          'Available commands:\n' +
          '/ping <host> — ICMP check\n' +
          '/tcp <host> <port> — TCP port check\n' +
          '/udp <host> <port> — UDP port check\n' +
          '/dns <host> [dnsServer] — DNS lookup\n' +
          '/portscan <host> <startPort> <endPort> — Port range scan\n' +
          '/traceroute <host> — Traceroute\n',
      );

      this.userService
        .upsertNested(
          { telegram: { chatId: ctx.chat.id } },
          {
            firstName: ctx.from.first_name,
            lastName: ctx.from.last_name,
            telegram: {
              chatId: ctx.chat.id,
              firstName: ctx.from.first_name,
              lastName: ctx.from.last_name,
              username: ctx.from.username,
              isBot: ctx.from.is_bot,
              languageCode: ctx.from.language_code,
              chatType: ctx.chat.type,
            },
          },
          { telegram: true },
        )
        .catch((error) =>
          this.logger.error('Failed to save user and telegram profile', error),
        );
    });

    this.bot.command('ping', async (ctx) => {
      const args = this.parseArgs(ctx);

      if (!args[0]) return ctx.reply('Usage: /ping <host>');

      await ctx.reply(`🔍 Pinging ${args[0]}...`);

      const res = await this.ipMonitorService.checkAlive(args[0]);
      await ctx.reply(
        res['alive']
          ? `✅ ${args[0]} is alive\n⏱ Latency: ${res['time']} ms`
          : `❌ ${args[0]} is unreachable`,
      );
    });

    // /tcp 8.8.8.8 53
    this.bot.command('tcp', async (ctx) => {
      const args = this.parseArgs(ctx);
      if (!args[0] || !args[1]) return ctx.reply('Usage: /tcp <host> <port>');

      await ctx.reply(`🔍 Checking TCP ${args[0]}:${args[1]}...`);
      const open = await this.ipMonitorService.checkTCP(args[0], +args[1]);

      await ctx.reply(
        open
          ? `✅ ${args[0]}:${args[1]} is open`
          : `❌ ${args[0]}:${args[1]} is closed`,
      );
    });

    // /udp 8.8.8.8 53
    this.bot.command('udp', async (ctx) => {
      const args = this.parseArgs(ctx);
      if (!args[0] || !args[1]) return ctx.reply('Usage: /udp <host> <port>');

      await ctx.reply(`🔍 Checking UDP ${args[0]}:${args[1]}...`);
      const open = await this.ipMonitorService.checkUDP(args[0], +args[1]);

      await ctx.reply(
        open
          ? `✅ ${args[0]}:${args[1]} is reachable`
          : `❌ ${args[0]}:${args[1]} is unreachable or filtered`,
      );
    });

    // /dns google.com 8.8.8.8
    this.bot.command('dns', async (ctx) => {
      const args = this.parseArgs(ctx);
      if (!args[0]) return ctx.reply('Usage: /dns <host> [dnsServer]');

      await ctx.reply(`🔍 Resolving ${args[0]}...`);
      const res = await this.ipMonitorService.checkDNS(args[0], args[1]);

      await ctx.reply(
        res.alive
          ? `✅ ${args[0]} resolved to:\n${res.ips.join('\n')}`
          : `❌ Could not resolve ${args[0]}`,
      );
    });

    // /portscan 8.8.8.8 20 25
    this.bot.command('portscan', async (ctx) => {
      const args = this.parseArgs(ctx);
      if (!args[0] || !args[1] || !args[2])
        return ctx.reply('Usage: /portscan <host> <startPort> <endPort>');

      const [host, startPort, endPort] = [args[0], +args[1], +args[2]];

      if (endPort - startPort > 1000)
        return ctx.reply('❌ Max range is 1000 ports');

      await ctx.reply(`🔍 Scanning ${host} ports ${startPort}-${endPort}...`);
      const res = await this.ipMonitorService.scanPortRange(
        host,
        startPort,
        endPort,
        {
          concurrency: 50,
          timeout: 3000,
        },
      );

      const openList = res.openPorts.length
        ? res.openPorts.map((p) => `  • ${p.port}`).join('\n')
        : '  None found';

      await ctx.reply(
        `📊 Scan Results for ${host}\n` +
          `⏱ Duration: ${res.duration}ms\n` +
          `🔎 Scanned: ${res.totalScanned} ports\n` +
          `✅ Open ports:\n${openList}`,
      );
    });

    // /traceroute 8.8.8.8
    this.bot.command('traceroute', async (ctx) => {
      const args = this.parseArgs(ctx);
      if (!args[0]) return ctx.reply('Usage: /traceroute <host>');

      await ctx.reply(
        `🔍 Tracerouting to ${args[0]}... (this may take a while)`,
      );
      const res = await this.ipMonitorService.tranceroute(args[0], 30000);

      const hopLines = res.hops
        .map((h) => {
          const times = h.times
            .map((t) => (t !== null ? `${t}ms` : '*'))
            .join('  ');
          const ip = h.ip ?? '*';
          return `  ${String(h.hop).padStart(2, ' ')}  ${ip.padEnd(16, ' ')}  ${times}`;
        })
        .join('\n');

      await ctx.reply(
        `📡 Traceroute to ${args[0]}\n` +
          `${res.reached ? '✅ Reached' : '❌ Not reached'} — ${res.duration}ms\n\n` +
          `<pre>${hopLines}</pre>`,
        { parse_mode: 'HTML' },
      );
    });
  }

  private parseArgs(ctx: Context): string[] {
    const text = ctx.message?.['text'] ?? '';
    return text.split(' ').slice(1); // remove the command itself
  }

  sendMessage(chatId: string, text: string) {
    this.bot.telegram.sendMessage(chatId, text);
  }
}
