import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from 'src/models/users.model';

@Injectable()
export class ProfileService {
    constructor(
        @InjectModel("Users") private userModel: Model<Users>
    ) {}
}