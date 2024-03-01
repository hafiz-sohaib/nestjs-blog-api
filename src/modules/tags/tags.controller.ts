import { Body, Controller, Get, Post, Delete, Param, Patch, Query } from '@nestjs/common';
import { TagsService } from './tags.service';


@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}

    // ========== Add New Tag ==========
    @Post()
    async addTag(@Body() payload: any) {
        return await this.tagsService.create(payload);
    }


    // ========== Get All Tags ==========
    @Get()
    async getTags(@Query() query: any) {
        return await this.tagsService.findAll(query);
    }


    // ========== Get Specific Tag Via ID ==========
    @Get(':id')
    async getSpecificTag(@Param('id') id: string) {
        return await this.tagsService.findOne(id);
    }


    // ========== Update Tag Via ID ==========
    @Patch(':id')
    async updateTag(@Param('id') id: string, @Body() payload: any) {
        return await this.tagsService.update(id, payload);
    }


    // ========== Delete Tag Via ID ==========
    @Delete(':id')
    async deleteTag(@Param('id') id: string) {
        return await this.tagsService.delete(id);
    }
}