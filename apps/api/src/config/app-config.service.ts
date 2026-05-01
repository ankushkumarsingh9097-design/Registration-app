import { Injectable } from '@nestjs/common';
import { JwtSignOptions } from '@nestjs/jwt';

export interface DatabaseConfig {
    type: string;
    host: string;
    port: number;
    username: string;
    password?: string;
    database: string;
    synchronize: boolean;
    logging: boolean;
}

export interface JwtConfig {
    accessSecret: string;
    refreshSecret: string;
    accessExpiresIn: JwtSignOptions['expiresIn'];
    refreshExpiresIn: JwtSignOptions['expiresIn'];
}

export interface CorsConfig {
    origin: string;
    credentials: boolean;
}

@Injectable()
export class AppConfigService {
    get port(): number {
        return parseInt(process.env.PORT || '3000', 10);
    }

    get nodeEnv(): string {
        return process.env.NODE_ENV || 'development';
    }

    get isProduction(): boolean {
        return this.nodeEnv === 'production';
    }

    get db(): DatabaseConfig {
        return {
            type: process.env.DB_TYPE || 'mysql',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3306', 10),
            username: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE || 'registration',
            synchronize: !this.isProduction,
            logging: !this.isProduction,
        };
    }

    get jwt(): JwtConfig {
        return {
            accessSecret: process.env.JWT_ACCESS_SECRET || 'defaultAccessSecret',
            refreshSecret: process.env.JWT_REFRESH_SECRET || 'defaultRefreshSecret',
            accessExpiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as JwtSignOptions['expiresIn'],
            refreshExpiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as JwtSignOptions['expiresIn'],
        };
    }

    get cors(): CorsConfig {
        return {
            origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
            credentials: process.env.CORS_CREDENTIALS === 'true',
        };
    }
}
