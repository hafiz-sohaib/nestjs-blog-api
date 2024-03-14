import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}


    @Get('/me')
    @UseGuards(AuthGuard, new RoleGuard('user'))
    async getProfile(@Request() { user }: any): Promise<any> {
        return { profile: user };
    }
}