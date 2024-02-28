import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from 'src/models/posts.model';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Posts', schema: PostSchema }]),
	],
	providers: [PostsService],
	controllers: [PostsController]
})

export class PostsModule { }