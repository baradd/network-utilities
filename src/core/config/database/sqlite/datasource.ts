import { DataSource } from 'typeorm';

export const SqliteDataSource = new DataSource({
  type: 'better-sqlite3',
  database: process.env.SQLITE_DB_NAME || 'database.sqlite',
  entities: [__dirname + '/entities/*.entity{.ts,.js}'],
  synchronize: true,
  logging: false,
});
