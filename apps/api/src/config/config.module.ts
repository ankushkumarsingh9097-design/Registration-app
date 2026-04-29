import { Module, Global } from '@nestjs/common';
import { databaseConfig } from './database.config';

@Global()
@Module({
  providers: [
    {
      provide: 'DATABASE_CONFIG',
      useValue: databaseConfig,
    },
  ],
  exports: ['DATABASE_CONFIG'],
})
export class ConfigModule {}
