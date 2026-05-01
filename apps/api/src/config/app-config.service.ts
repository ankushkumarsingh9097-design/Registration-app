import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
    constructor(private configService: NestConfigService) {}

    get port(): number {
        return this.configService.get<number>('PORT') || 3000;
    }

    get nodeEnv(): string {
        return this.configService.get<string>('NODE_ENV') || 'development';
    }

    get isProduction(): boolean {
        return this.nodeEnv === 'production';
    }

    // Database
    get db() {
        return {
            type: this.configService.get<string>('DB_TYPE') || 'mysql',
            host: this.configService.get<string>('DB_HOST') || 'localhost',
            port: this.configService.get<number>('DB_PORT') || 3306,
            username: this.configService.get<string>('DB_USERNAME') || 'root',
            password: this.configService.get<string>('DB_PASSWORD') || 'root',
            database: this.configService.get<string>('DB_DATABASE') || 'registration',
            synchronize: !this.isProduction,
            logging: !this.isProduction,
        };
    }

    // JWT
    get jwt() {
        return {
            accessSecret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            refreshSecret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            accessExpiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
            refreshExpiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
        };
    }

    // CORS
    get cors() {
        return {
            origin: this.configService.get<string>('CORS_ORIGIN') || 'http://localhost:4200',
            credentials: this.configService.get<string>('CORS_CREDENTIALS') === 'true',
        };
    }
}
