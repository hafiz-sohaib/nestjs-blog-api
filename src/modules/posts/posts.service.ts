import { Injectable, UnauthorizedException, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error } from 'mongoose';
import { slugGenerator, handleValidationError, handleMongoServerError } from '../../utils/utils';
import { Posts } from 'src/models/posts.model';


@Injectable()
export class PostsService {
    constructor(@InjectModel("Posts") private readonly postModel: Model<Posts>) {}


    // ========== Add New Post ==========
    async create(payload: any, featuredImage: any): Promise<{post: {}}> {
        try {
            const url = (featuredImage && featuredImage.length > 0) ? `http://localhost:3000/blogpost/${featuredImage[0].filename}` : "";
            const slug = payload.title ? await slugGenerator(payload.title, this.postModel) : "";
            const post = await this.postModel.create({ ...payload, slug, featuredImage: url });
            return { post };
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new BadRequestException(handleValidationError(error, "Posts"));
            } else if (error.name === 'MongoServerError') {
                throw new BadRequestException(handleMongoServerError(error));
            } else {
                throw new InternalServerErrorException('Failed to create post');
            }
        }
    }


    // ========== Get All Posts ==========
    async findAll(query: any): Promise<{ posts: {} }> {
        try {
            const { search, sort, order, ...filters } = query;
            const newQuery = {};

            if (search) newQuery["title"] = { $regex: search, $options: 'i' };

            const sortOptions = sort || 'title';
            const sortOrder = order || 'asc';

            const posts = await this.postModel.find({ ...newQuery, ...filters }).sort({ [sortOptions]: sortOrder === 'desc' ? -1 : 1 }).select('-__v').exec();
            return { posts }
        } catch (error) {
            throw new UnauthorizedException('Failed to fetch posts');
        }
    }


    // ========== Get Specific Post Via ID ==========
    async findOne(id: string): Promise<{ post: {} }> {
        try {
            const post = await this.postModel.findById(id);
            if (!post) throw new NotFoundException('post not found');
            return { post }
        } catch (error) {
            if (error instanceof Error.CastError) {
                throw new NotFoundException('Invalid post ID');
            } else if (error.name === "NotFoundException") {
                throw new NotFoundException('Post not found');
            } else {
                throw new InternalServerErrorException('Failed to fetch post');
            }
        }
    }


    // ========== Update Post Via ID ==========
    async update(id: string, payload: any, featuredImage: any): Promise<{ post: {} }> {
        try {
            const data = { ...payload };

            if (featuredImage && featuredImage.length > 0) {
                data['featuredImage'] = `http://localhost:3000/blogpost/${featuredImage[0].filename}`;
            }
            if (payload.title) {
                data['slug'] = await slugGenerator(payload.title, this.postModel);
            }

            const post = await this.postModel.findByIdAndUpdate(id, data, {new: true});
            if (!post) throw new NotFoundException('Post not found');
            return { post }
        } catch (error) {
            if (error instanceof Error.CastError) {
                throw new NotFoundException('Invalid post ID');
            } else if (error.name === "NotFoundException") {
                throw new NotFoundException('Post not found');
            } else {
                throw new InternalServerErrorException('Failed to update post');
            }
        }
    }


    // ========== Delete Post Via ID ==========
    async delete(id: string): Promise<{ message: string }> {
        try {
            const deletedPost = await this.postModel.findByIdAndDelete(id);
            if (!deletedPost) throw new NotFoundException('Post not found');
            return { message: "Post successfully deleted" };
        } catch (error) {
            if (error instanceof Error.CastError) {
                throw new NotFoundException('Invalid post ID');
            } else if (error.name === "NotFoundException") {
                throw new NotFoundException('Post not found');
            } else {
                throw new InternalServerErrorException('Failed to delete post');
            }
        }
    }
}