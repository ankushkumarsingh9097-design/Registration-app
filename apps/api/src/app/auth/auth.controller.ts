import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UnauthorizedException,
    UseGuards,
    Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    signup(@Body() createUserDto: CreateUserDto) {
        return this.authService.signup(createUserDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }
        return this.authService.login(user);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    logout(@Request() req: { user: { userId: string } }) {
        return this.authService.logout(req.user.userId);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refresh(@Body() body: { userId: string; refreshToken: string }) {
        return this.authService.refreshTokens(body.userId, body.refreshToken);
    }
}
