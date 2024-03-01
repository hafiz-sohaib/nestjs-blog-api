import { Body, Controller, Get, Post, Delete, Param, Patch, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';


@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    // ========== Add New Category ==========
    @Post()
    async addCategory(@Body() payload: any) {
        return await this.categoriesService.create(payload);
    }


    // ========== Get All Categories ==========
    @Get()
    async getCategories(@Query() query: any) {
        return await this.categoriesService.findAll(query);
    }


    // ========== Get Specific Category Via ID ==========
    @Get(':id')
    async getSpecificCategory(@Param('id') id: string) {
        return await this.categoriesService.findOne(id);
    }


    // ========== Update Category Via ID ==========
    @Patch(':id')
    async updateCategory(@Param('id') id: string, @Body() payload: any) {
        return await this.categoriesService.update(id, payload);
    }


    // ========== Delete Category Via ID ==========
    @Delete(':id')
    async deleteCategory(@Param('id') id: string) {
        return await this.categoriesService.delete(id);
    }
}