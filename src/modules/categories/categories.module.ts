import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from 'src/models/categories.model';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Categories', schema: CategorySchema }]),
	],
	providers: [CategoriesService],
	controllers: [CategoriesController]
})

export class CategoriesModule { }