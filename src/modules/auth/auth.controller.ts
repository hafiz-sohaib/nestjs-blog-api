import { Body, Controller, Get, Post, Param } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    async verifyAuth(@Body('email') email: string) {
        return await this.authService.verifyAuth(email);
    }


    @Get('/verify/:token')
    async verifyAccount(@Param("token") token: string): Promise<any> {
        return await this.authService.verifyAccount(token);
    }
}