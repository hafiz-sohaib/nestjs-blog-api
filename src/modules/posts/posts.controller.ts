import { Body, Controller, Get, Post, Delete, Param, Patch, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { fileUpload } from "../../utils/utils"
import { PostsService } from './posts.service';


@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}


    @Post()
    @UseInterceptors(fileUpload('featuredImage'))
    async addPost(@Body() payload: any, @UploadedFiles() featuredImage: any) {
        return await this.postsService.create(payload, featuredImage);
    }


    @Get()
    async getPosts(@Query() query: any) {
        return await this.postsService.findAll(query);
    }


    @Get(':id')
    async getSpecificPost(@Param('id') id: string) {
        return await this.postsService.findOne(id);
    }


    @Patch(':id')
    @UseInterceptors(fileUpload('featuredImage'))
    async updatePost(@Param('id') id: string, @Body() payload: any, @UploadedFiles() featuredImage: any) {
        return await this.postsService.update(id, payload, featuredImage);
    }


    @Delete(':id')
    async deletePost(@Param('id') id: string) {
        return await this.postsService.delete(id);
    }
}