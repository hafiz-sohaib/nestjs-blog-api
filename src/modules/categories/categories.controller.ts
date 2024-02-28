import { Body, Controller, Get, Post, Delete, Param, Patch, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';


@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    async addCategory(@Body() payload: any) {
        return await this.categoriesService.create(payload);
    }


    @Get()
    async getCategories(@Query() query: any) {
        return await this.categoriesService.findAll();
    }


    @Get(':id')
    async getSpecificCategory(@Param('id') id: string) {
        return await this.categoriesService.findOne(id);
    }


    @Patch(':id')
    async updateCategory(@Param('id') id: string, @Body() payload: any) {
        return await this.categoriesService.update(id, payload);
    }


    @Delete(':id')
    async deleteCategory(@Param('id') id: string) {
        return await this.categoriesService.delete(id);
    }
}