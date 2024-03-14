import { Body, Controller, Get, Post, Delete, Param, Patch, Query, UseInterceptors, UploadedFiles, UseGuards, Request } from '@nestjs/common';
import { fileUpload } from "../../helpers/mongooseError.helper"
import { PostsService } from './posts.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';


@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}


    // ========== Add New Post ==========
    @Post()
    @UseGuards(AuthGuard, new RoleGuard('user'))
    @UseInterceptors(fileUpload('featuredImage'))
    async addPost(@Request() request: any, @Body() payload: any, @UploadedFiles() featuredImage: any) {
        return await this.postsService.create({ ...payload, author: request?.user._id }, featuredImage);
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
    @UseGuards(AuthGuard, new RoleGuard('user'))
    @UseInterceptors(fileUpload('featuredImage'))
    async updatePost(@Param('id') id: string, @Request() request: any, @Body() payload: any, @UploadedFiles() featuredImage: any) {
        return await this.postsService.update(id, { ...payload, author: request?.user._id }, featuredImage);
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
    @UseGuards(AuthGuard, new RoleGuard('user'))
    async deletePost(@Param('id') id: string, @Request() request: any) {
        return await this.postsService.delete(id, request?.user._id);
    }
}