import { Body, Controller, Get, Post, Delete, Param, Patch, Query, Request, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';


@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post()
    @UseGuards(AuthGuard, new RoleGuard('user'))
    async addCategory(@Request() request: any, @Body() payload: any) {
        return await this.commentsService.create({ ...payload, commentedBy: request?.user._id });
    }


    @Get(':postID')
    async getCategories(@Param('postID') postID: string) {
        return await this.commentsService.findAll(postID);
    }


    @Delete(':id')
    @UseGuards(AuthGuard, new RoleGuard('user'))
    async deleteCategory(@Request() request: any, @Param('id') id: string) {
        return await this.commentsService.delete(id, request?.user._id);
    }
}