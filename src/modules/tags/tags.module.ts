import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TagSchema } from 'src/models/tags.model';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Tags', schema: TagSchema }]),
	],
	providers: [TagsService],
	controllers: [TagsController]
})

export class TagsModule { }