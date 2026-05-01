import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { AppConfigService } from './app-config.service';

export const databaseConfig = {
    type: 'mysql' as const,
    host: '',
    port: 3306,
    username: '',
    password: '',
    database: '',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: false,
};

export const createDatabaseConfig = (configService: AppConfigService) => ({
    type: 'mysql' as const,
    host: configService.db.host,
    port: configService.db.port,
    username: configService.db.username,
    password: configService.db.password,
    database: configService.db.database,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: configService.db.synchronize,
    logging: configService.db.logging,
});
