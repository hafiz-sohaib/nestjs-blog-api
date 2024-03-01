import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from 'src/models/comments.model';
import { PostSchema } from 'src/models/posts.model';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Posts', schema: PostSchema },
			{ name: 'Comments', schema: CommentSchema }
		]),
	],
	providers: [CommentsService],
	controllers: [CommentsController]
})

export class CommentsModule { }