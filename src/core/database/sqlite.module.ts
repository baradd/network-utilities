import { Module } from '@nestjs/common';
import { SqliteConfigModule } from '../config/database/sqlite/sqlite-config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import sqliteConfig from '../config/database/sqlite/sqlite.config';
import { SqliteConfigService } from '../config/database/sqlite/sqlite-config.service';
import { SqliteDataSource } from '../config/database/sqlite/datasource';
import { DataSource, DataSourceOptions } from 'typeorm';

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
        autoLoadEntities: true,
      }),
      async dataSourceFactory(options?: DataSourceOptions) {
        if (!options) {
          throw new Error('DataSource options are undefined');
        }
        const datasource = new DataSource(options);
        const { database } = datasource.options as any;
        console.log(`✅ Connected to DB: ${database}}`);
        return datasource;
      },
    }),
  ],
})
export class SqliteModule {}
