import { Body, Controller, Get, Post, Delete, Param, Patch, Query, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';


@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post()
    async addCategory(@Body() payload: any) {
        return await this.commentsService.create(payload);
    }


    @Get(':postID')
    async getCategories(@Param('postID') postID: string) {
        return await this.commentsService.findAll(postID);
    }


    @Delete(':id')
    async deleteCategory(@Request() request: any, @Param('id') id: string) {
        const userID = request.user._id;
        return await this.commentsService.delete(id, userID);
    }
}