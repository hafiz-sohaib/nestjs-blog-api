import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/models/users.model';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Users', schema: UserSchema }]),
	],
	providers: [ProfileService],
	controllers: [ProfileController]
})

export class ProfileModule { }