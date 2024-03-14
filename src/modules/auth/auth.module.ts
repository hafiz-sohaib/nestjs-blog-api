import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/models/users.model';
import { JwtModule } from '@nestjs/jwt';
import { globalConstants } from 'src/config/constants';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Users', schema: UserSchema }]),
		JwtModule.register({
			global: true,
			secret: globalConstants.jwtSecret,
			signOptions: { expiresIn: '1d' },
		}),
	],
	controllers: [AuthController],
	providers: [AuthService]
})

export class AuthModule { }