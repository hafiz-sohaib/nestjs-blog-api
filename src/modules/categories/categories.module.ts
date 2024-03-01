import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from 'src/models/categories.model';
import { PostSchema } from 'src/models/posts.model';
import { CommentSchema } from 'src/models/comments.model';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Categories', schema: CategorySchema },
			{ name: 'Posts', schema: PostSchema },
			{ name: 'Comments', schema: CommentSchema },
		]),
	],
	providers: [CategoriesService],
	controllers: [CategoriesController]
})

export class CategoriesModule { }