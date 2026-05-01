import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '../config/config.module';
import { createDatabaseConfig } from '../config/database.config';
import { AppConfigService } from '../config/app-config.service';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
            inject: [AppConfigService],
            useFactory: (configService: AppConfigService) => ({
                ...createDatabaseConfig(configService),
                entities: [User],
            }),
        }),
        UsersModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
