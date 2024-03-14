import { Injectable, UnauthorizedException, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error } from 'mongoose';
import { slugGenerator, handleValidationError, handleMongoServerError } from '../../helpers/mongooseError.helper';
import { Posts } from 'src/models/posts.model';

import { Comments } from 'src/models/comments.model';


@Injectable()
export class PostsService {
    constructor(
        @InjectModel("Posts") private readonly postModel: Model<Posts>,
        @InjectModel("Comments") private readonly commentModel: Model<Comments>
    ) {}


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
            const post = await this.postModel.findById(id).select('-__v').exec();
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

            const post = await this.postModel.findOneAndUpdate({ _id: id, author: payload.author }, data, {new: true}).select('-__v').exec();
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
    

    // ========== Update Likes of the Post Via ID ===============
    async updateLikes(id: string, payload: any): Promise<{post: {}}> {
        try {
            if (!payload.userID) throw new NotFoundException('User ID is missing');

            const update = {};
            const options = { new: true };

            const existingPost = await this.postModel.findById(id);
            if (!existingPost) throw new NotFoundException('Post not found');

            const isLiked = existingPost.likes.includes(payload.userID);
            const isDisliked = existingPost.dislikes.includes(payload.userID);

            if (isLiked) {
                update["$pull"] = { likes: payload.userID };
            } else {
                update["$addToSet"] = { likes: payload.userID };
                if (isDisliked) update["$pull"] = { dislikes: payload.userID };
            }

            const updatedPost = await this.postModel.findByIdAndUpdate(id, update, options);
            return { post: updatedPost }
        } catch (error) {
            if (error instanceof Error.CastError) {
                throw new NotFoundException('Invalid post ID');
            } else if (error.name === "NotFoundException") {
                throw new NotFoundException('Post not found');
            } else {
                throw new InternalServerErrorException('Failed to update post like');
            }
        }
    }


    // ========== Update Dislikes of the Post Via ID ===============
    async updateDislikes(id: string, payload: any): Promise<{post: {}}> {
        try {
            if (!payload.userID) throw new NotFoundException('User ID is missing');

            const update = {};
            const options = { new: true };

            const existingPost = await this.postModel.findById(id);
            if (!existingPost) throw new NotFoundException('Post not found');

            const isLiked = existingPost.likes.includes(payload.userID);
            const isDisliked = existingPost.dislikes.includes(payload.userID);

            if (isDisliked) {
                update["$pull"] = { dislikes: payload.userID };
            } else {
                update["$addToSet"] = { dislikes: payload.userID };
                if (isLiked) update["$pull"] = { likes: payload.userID };
            }

            const updatedPost = await this.postModel.findByIdAndUpdate(id, update, options);
            return { post: updatedPost }
        } catch (error) {
            if (error instanceof Error.CastError) {
                throw new NotFoundException('Invalid post ID');
            } else if (error.name === "NotFoundException") {
                throw new NotFoundException('Post not found');
            } else {
                throw new InternalServerErrorException('Failed to update post like');
            }
        }
    }


    // ========== Delete Post Via ID ==========
    async delete(id: string, userID: string): Promise<{ message: string }> {
        try {
            await this.commentModel.deleteMany({ whichPost: id });
            const deletedPost = await this.postModel.findOneAndDelete({ _id: id, author: userID });
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