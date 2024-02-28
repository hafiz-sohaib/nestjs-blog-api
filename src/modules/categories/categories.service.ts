import { Injectable, UnauthorizedException, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error } from 'mongoose';
import slugify from 'slugify';
import { Categories } from 'src/models/categories.model';


@Injectable()
export class CategoriesService {
    constructor(@InjectModel("Categories") private readonly categoryModel: Model<Categories>) {}


    // ========== Add New Category ==========
    async create(payload: any): Promise<{ category: {} }> {
        try {
            const slug = slugify(payload?.title, { lower: true });
            const category = await this.categoryModel.create({ ...payload, slug });
            return { category };
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new BadRequestException(error.message);
            } else if (error.name === 'MongoServerError') {
                throw new BadRequestException(error.message);
            } else {
                throw new InternalServerErrorException('Failed to create category');
            }
        }
    }


    // ========== Get All Categories ==========
    async findAll(): Promise<{ categories: {} }> {
        try {
            const categories = await this.categoryModel.find();
            return { categories }
        } catch (error) {
            throw new UnauthorizedException('Failed to fetch categories');
        }
    }


    // ========== Get Specific Category Via ID ==========
    async findOne(id: string): Promise<{ category: {} }> {
        try {
            const category = await this.categoryModel.findById(id);
            if (!category) throw new NotFoundException('Category not found');
            return { category }
        } catch (error) {
            if (error instanceof Error.CastError) {
                throw new NotFoundException('Invalid category ID');
            } else if (error.name === "NotFoundException") {
                throw new NotFoundException('Category not found');
            } else {
                throw new InternalServerErrorException('Failed to fetch category');
            }
        }
    }


    // ========== Update Category Via ID ==========
    async update(id: string, payload: any): Promise<{ category: {} }> {
        try {
            payload = { ...payload, slug: (payload.title) ? slugify(payload.title, {lower: true}) : "" }
            const category = await this.categoryModel.findByIdAndUpdate(id, payload, {new: true});
            if (!category) throw new NotFoundException('Category not found');
            return { category }
        } catch (error) {
            if (error instanceof Error.CastError) {
                throw new NotFoundException('Invalid category ID');
            } else if (error.name === "NotFoundException") {
                throw new NotFoundException('Category not found');
            } else {
                throw new InternalServerErrorException('Failed to update category');
            }
        }
    }


    // ========== Delete Category Via ID ==========
    async delete(id: string): Promise<{ message: string }> {
        try {
            await this.categoryModel.deleteMany({ parent: id });
            const deletedCategory = await this.categoryModel.findByIdAndDelete(id);

            if (!deletedCategory) throw new NotFoundException('Category not found');
            return { message: "Category and its Subcategories are successfully deleted" };
        } catch (error) {
            if (error instanceof Error.CastError) {
                throw new NotFoundException('Invalid category ID');
            } else if (error.name === "NotFoundException") {
                throw new NotFoundException('Category not found');
            } else {
                throw new InternalServerErrorException('Failed to delete category');
            }
        }
    }
}