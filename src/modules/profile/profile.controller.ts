import { Controller, Get, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}


    @Get('/me/:id')
    async getProfile(@Param('id') id: string): Promise<any> {
        return this.profileService.getProfile(id);
    }
}