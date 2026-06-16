import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import sqlLiteConfig from './sqlite.config';
import { SqliteConfigService } from './sqlite-config.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [sqlLiteConfig],
      cache: true,
      isGlobal: true,
    }),
  ],
  providers: [SqliteConfigService],
  exports: [SqliteConfigService],
})
export class SqliteConfigModule {}
