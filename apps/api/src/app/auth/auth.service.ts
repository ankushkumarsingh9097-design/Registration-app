import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { AppConfigService } from '../../config/app-config.service';
import * as bcrypt from 'bcrypt';

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
    user: Partial<User>;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: AppConfigService
    ) {}

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.usersService.findByEmail(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }

        return null;
    }

    async signup(createUserDto: CreateUserDto): Promise<AuthResponse> {
        const user = await this.usersService.create(createUserDto);
        const tokens = await this.generateTokens(user);

        await this.usersService.setRefreshToken(user.id, tokens.refreshToken);

        return {
            user: this.sanitizeUser(user),
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    async login(user: User): Promise<AuthResponse> {
        const tokens = await this.generateTokens(user);

        await this.usersService.setRefreshToken(user.id, tokens.refreshToken);

        return {
            user: this.sanitizeUser(user),
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    async logout(userId: string): Promise<{ message: string }> {
        await this.usersService.removeRefreshToken(userId);
        return { message: 'Logged out successfully' };
    }

    async refreshTokens(userId: string, refreshToken: string): Promise<AuthResponse> {
        const storedToken = await this.usersService.getRefreshToken(userId);

        if (!storedToken || storedToken !== refreshToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const user = await this.usersService.findOne(userId);
        const tokens = await this.generateTokens(user);

        await this.usersService.setRefreshToken(userId, tokens.refreshToken);

        return {
            user: this.sanitizeUser(user),
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    private async generateTokens(user: User): Promise<AuthTokens> {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const jwtConfig = this.configService.jwt;

        return {
            accessToken: this.jwtService.sign(payload, {
                secret: jwtConfig.accessSecret,
                expiresIn: jwtConfig.accessExpiresIn,
            }),
            refreshToken: this.jwtService.sign(payload, {
                secret: jwtConfig.refreshSecret,
                expiresIn: jwtConfig.refreshExpiresIn,
            }),
        };
    }

    private sanitizeUser(user: User): Partial<User> {
        return {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            avatar: user.avatar,
        };
    }
}
