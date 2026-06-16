import { Module } from '@nestjs/common';
import { SqliteConfigModule } from '../config/database/sqlite/sqlite-config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import sqliteConfig from '../config/database/sqlite/sqlite.config';
import { SqliteConfigService } from '../config/database/sqlite/sqlite-config.service';
import { SqliteDataSource } from '../config/database/sqlite/datasource';

@Module({
  imports: [
    SqliteConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [SqliteConfigModule],
      inject: [SqliteConfigService],
      useFactory: (config: SqliteConfigService) => ({
        type: 'better-sqlite3',
        database: config.dbName,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
  ],
})
export class SqliteModule {}
