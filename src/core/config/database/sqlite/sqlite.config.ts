import { registerAs } from '@nestjs/config';

export default registerAs('sqlite', () => ({
  dbName: process.env.SQLITE_DB_NAME || 'database.sqlite',
}));
