import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { createHash } from "crypto"
import { Model } from 'mongoose';
import { Users } from 'src/models/users.model';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel("Users") private readonly userModel: Model<Users>,
        private readonly jwtService: JwtService
    ) {}


    async verifyAuth(email: string): Promise<{verify_token: string, message: string}> {
        try {
            const data = { email, username: email?.split('@')[0].replace(/\./g,'') };
            let user: any = await this.userModel.findOne({ email });
            if (!user) user = await this.userModel.create(data);

            const verifyToken = await user.generateVerificationToken();
            await user.save();

            return { verify_token: verifyToken, message: "Please check your email to verify your account" }
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException("Please provide a valid email address");
        }
    }


    async verifyAccount(token: string): Promise<{access_token: string} | {error: string}> {
        try {
            const hashedToken = createHash("sha256").update(token).digest("hex");
            const user = await this.userModel.findOne({
                verificationToken: hashedToken,
                verificationTokenExpires: { $gt: Date.now() },
            });

            if (!user) return { error: "Token Expired. Please try again later"};
            const access_token: string = this.generateToken(user);

            user.isLoggedin = true;
            user.accessToken = access_token;
            user.verificationToken = undefined;
            user.verificationTokenExpires = undefined;

            await user.save();
            return { access_token }
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException("Something went wrong. Please try again later");
        }
    }


    private generateToken(payload: any) {
        return this.jwtService.sign({ payload });
    }
}