import { environment } from './environment';

export const databaseConfig = {
  type: 'mysql' as const,
  host: environment.db.host,
  port: environment.db.port,
  username: environment.db.username,
  password: environment.db.password,
  database: environment.db.database,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: environment.db.synchronize,
  logging: false,
};
