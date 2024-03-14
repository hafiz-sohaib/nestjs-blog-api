import { Injectable, UnauthorizedException, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error } from 'mongoose';
import { handleValidationError, handleMongoServerError } from '../../helpers/mongooseError.helper';
import { Comments } from 'src/models/comments.model';
import { Posts } from 'src/models/posts.model';


@Injectable()
export class CommentsService {
    constructor(
        @InjectModel("Comments") private readonly commentModel: Model<Comments>,
        @InjectModel("Posts") private readonly postModel: Model<Posts>
    ) {}


    // ========== Add New Comment ==========
    async create(payload: any): Promise<{ comment: {} }> {
        try {
            const postID = payload.whichPost

            if (payload.parent) {
                const commentID = payload.parent;
                const _comments = await this.commentModel.findById(commentID);
                if (!_comments) throw new NotFoundException('Comment not found');
                _comments.replies = _comments.replies+1;
                await _comments.save();
            }

            const comment = await this.commentModel.create(payload);

            if (!payload.parent) {
                const _posts = await this.postModel.findById(postID);
                if (!_posts) throw new NotFoundException('Post not found');
                _posts.comments = _posts.comments + 1;
                await _posts.save();
            }

            return { comment };
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new BadRequestException(handleValidationError(error, "Comments"));
            } else if (error.name === 'MongoServerError') {
                throw new BadRequestException(handleMongoServerError(error));
            } else {
                throw new InternalServerErrorException('Failed to add comment');
            }
        }
    }


    // ========== Get All Comments ==========
    async findAll(postID: string): Promise<{ comments: {} }> {
        try {
            const comments = await this.commentModel.find({ whichPost: postID }).select('-__v').exec();
            return { comments }
        } catch (error) {
            throw new UnauthorizedException('Failed to fetch comments');
        }
    }


    // ========== Delete Comment Via ID ==========
    async delete(id: string, userID: string): Promise<{ message: string }> {
        try {
            await this.commentModel.deleteMany({ parent: id });
            const deletedComment = await this.commentModel.findOneAndDelete({ _id: id, commentedBy: userID });
            if (!deletedComment) throw new NotFoundException('Comment not found');
            return { message: "Comment successfully deleted" };
        } catch (error) {
            if (error instanceof Error.CastError) {
                throw new NotFoundException('Invalid comment ID');
            } else if (error.name === "NotFoundException") {
                throw new NotFoundException('Comment not found');
            } else {
                throw new InternalServerErrorException('Failed to delete comment');
            }
        }
    }
}