import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from 'src/models/posts.model';
import { CommentSchema } from 'src/models/comments.model';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Posts', schema: PostSchema },
			{ name: 'Comments', schema: CommentSchema },
		]),
	],
	providers: [PostsService],
	controllers: [PostsController]
})

export class PostsModule { }