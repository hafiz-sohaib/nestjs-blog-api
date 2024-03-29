import { Injectable, UnauthorizedException, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error } from 'mongoose';
import slugify from 'slugify';
import { Tags } from 'src/models/tags.model';


@Injectable()
export class TagsService {
    constructor(@InjectModel("Tags") private readonly tagModel: Model<Tags>) {}


    // ========== Add New Tag ==========
    async create(payload: any): Promise<{ tag: {} }> {
        try {
            const slug = slugify(payload?.title, { lower: true });
            const tag = await this.tagModel.create({ ...payload, slug });
            return { tag };
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new BadRequestException(error.message);
            } else if (error.name === 'MongoServerError') {
                throw new BadRequestException(error.message);
            } else {
                throw new InternalServerErrorException('Failed to create tag ');
            }
        }
    }


    // ========== Get All Tags ==========
    async findAll(): Promise<{ tags: {} }> {
        try {
            const tags = await this.tagModel.find();
            return { tags }
        } catch (error) {
            throw new UnauthorizedException('Failed to fetch tags');
        }
    }


    // ========== Get Specific Tag Via ID ==========
    async findOne(id: string): Promise<{ tag: {} }> {
        try {
            const tag = await this.tagModel.findById(id);
            if (!tag) throw new NotFoundException('Tag not found');
            return { tag }
        } catch (error) {
            if (error instanceof Error.CastError) {
                throw new NotFoundException('Invalid tag ID');
            } else if (error.name === "NotFoundException") {
                throw new NotFoundException('Tag not found');
            } else {
                throw new InternalServerErrorException('Failed to fetch tag');
            }
        }
    }


    // ========== Update Tag Via ID ==========
    async update(id: string, payload: any): Promise<{ tag: {} }> {
        try {
            payload = { ...payload, slug: (payload.title) ? slugify(payload.title, {lower: true}) : "" }
            const tag = await this.tagModel.findByIdAndUpdate(id, payload, {new: true});
            if (!tag) throw new NotFoundException('Tag not found');
            return { tag }
        } catch (error) {
            if (error instanceof Error.CastError) {
                throw new NotFoundException('Invalid tag ID');
            } else if (error.name === "NotFoundException") {
                throw new NotFoundException('Tag not found');
            } else {
                throw new InternalServerErrorException('Failed to update tag');
            }
        }
    }


    // ========== Delete Tag Via ID ==========
    async delete(id: string): Promise<{ message: string }> {
        try {
            const deletedTag = await this.tagModel.findByIdAndDelete(id);
            if (!deletedTag) throw new NotFoundException('Tag not found');
            return { message: "Tag successfully deleted" };
        } catch (error) {
            if (error instanceof Error.CastError) {
                throw new NotFoundException('Invalid tag ID');
            } else if (error.name === "NotFoundException") {
                throw new NotFoundException('Tag not found');
            } else {
                throw new InternalServerErrorException('Failed to delete tag');
            }
        }
    }
}