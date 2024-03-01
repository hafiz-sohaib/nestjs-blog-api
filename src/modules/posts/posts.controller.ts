import { Body, Controller, Get, Post, Delete, Param, Patch, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { fileUpload } from "../../utils/utils"
import { PostsService } from './posts.service';


@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    // ========== Add New Post ==========
    @Post()
    @UseInterceptors(fileUpload('featuredImage'))
    async addPost(@Body() payload: any, @UploadedFiles() featuredImage: any) {
        return await this.postsService.create(payload, featuredImage);
    }


    // ========== Get All Posts ==========
    @Get()
    async getPosts(@Query() query: any) {
        return await this.postsService.findAll(query);
    }


    // ========== Get Specific Post Via ID ==========
    @Get(':id')
    async getSpecificPost(@Param('id') id: string) {
        return await this.postsService.findOne(id);
    }


    // ========== Update Post Via ID ==========
    @Patch(':id')
    @UseInterceptors(fileUpload('featuredImage'))
    async updatePost(@Param('id') id: string, @Body() payload: any, @UploadedFiles() featuredImage: any) {
        return await this.postsService.update(id, payload, featuredImage);
    }


    // ========== Update Likes of Existing Post Through ID ==========
    @Patch('likes/:id')
    async updateLikes(@Param('id') id: string, @Body() payload: any) {
        return this.postsService.updateLikes(id, payload);
    }


    // =============== Update Likes of Existing Post Through ID ===============
    @Patch('dislikes/:id')
    async updateDislikes(@Param('id') id: string, @Body() data: any) {
        return this.postsService.updateDislikes(id, data);
    }


    // ========== Delete Post Via ID ==========
    @Delete(':id')
    async deletePost(@Param('id') id: string) {
        return await this.postsService.delete(id);
    }
}