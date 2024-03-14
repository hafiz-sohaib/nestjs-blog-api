import { Body, Controller, Get, Post, Delete, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';


@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}


    // ========== Add New Category ==========
    @Post()
    @UseGuards(AuthGuard, new RoleGuard('admin'))
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
    @UseGuards(AuthGuard, new RoleGuard('admin'))
    async updateCategory(@Param('id') id: string, @Body() payload: any) {
        return await this.categoriesService.update(id, payload);
    }


    // ========== Delete Category Via ID ==========
    @Delete(':id')
    @UseGuards(AuthGuard, new RoleGuard('admin'))
    async deleteCategory(@Param('id') id: string) {
        return await this.categoriesService.delete(id);
    }
}