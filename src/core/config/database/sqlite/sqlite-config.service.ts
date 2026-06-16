import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SqliteConfigService {
  constructor(private readonly configService: ConfigService) {}

  public get dbName(): string {
    return this.configService.get<string>('sqlite.dbName') || 'database.sqlite';
  }
}
