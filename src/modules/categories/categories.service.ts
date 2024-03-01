import { Injectable, UnauthorizedException, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error } from 'mongoose';
import slugify from 'slugify';
import { Categories } from 'src/models/categories.model';
import { Comments } from 'src/models/comments.model';
import { Posts } from 'src/models/posts.model';
import { handleMongoServerError, handleValidationError } from "src/utils/utils";


@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel("Categories") private readonly categoryModel: Model<Categories>,
        @InjectModel("Posts") private readonly postModel: Model<Posts>,
        @InjectModel("Comments") private readonly commentModel: Model<Comments>
    ) {}


    // ========== Add New Category ==========
    async create(payload: any): Promise<{ category: {} }> {
        try {
            const slug = slugify(payload?.title, { lower: true });
            const category = await this.categoryModel.create({ ...payload, slug });
            return { category };
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new BadRequestException(handleValidationError(error.message, "Categories"));
            } else if (error.name === 'MongoServerError') {
                throw new BadRequestException(handleMongoServerError(error.message));
            } else {
                throw new InternalServerErrorException('Failed to create category');
            }
        }
    }


    // ========== Get All Categories ==========
    async findAll(query: any): Promise<{ categories: {} }> {
        try {
            const { search, sort, order, ...filters } = query;
            const newQuery = {};

            if (search) newQuery["title"] = { $regex: search, $options: 'i' };

            const sortOptions = sort || 'title';
            const sortOrder = order || 'asc';

            const categories = await this.categoryModel.find({ ...newQuery, ...filters }).sort({[sortOptions]: sortOrder === 'desc' ? -1 : 1 }).select('-__v').exec();
            return { categories }
        } catch (error) {
            throw new UnauthorizedException('Failed to fetch categories');
        }
    }


    // ========== Get Specific Category Via ID ==========
    async findOne(id: string): Promise<{ category: {} }> {
        try {
            const category = await this.categoryModel.findById(id).select('-__v');
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
            const category = await this.categoryModel.findByIdAndUpdate(id, payload, {new: true}).select('-__v');
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
            const posts = await this.postModel.find({ category: id });
            const comments = (await Promise.all(posts.map(async post => await this.commentModel.find({ whichPost: post._id })))).flat();
            const replies = (await Promise.all(comments.map(async comment => await this.commentModel.find({ parent: comment._id })))).flat();

            if (replies.length > 0) {
                replies.map(async ({ _id }) => { await this.commentModel.deleteMany({ _id }); })
            }

            if (comments.length > 0) {
                comments.map(async ({ _id }) => { await this.commentModel.deleteMany({ _id }); })
            }

            if (posts.length > 0) {
                posts.map(async ({ _id }) => { await this.postModel.deleteMany({ _id }); })
            }

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