import { Schema, Document, model, ObjectId } from "mongoose";

// =============== Post Interface ===============
export interface Posts extends Document{
    title: string;
    category: ObjectId;
    slug: string;
    shortDescription: string;
    content: string;
    tags: ObjectId[];
    author: ObjectId;
    featuredImage: string;
    status: "published" | "draft";
    views: ObjectId[];
    likes: ObjectId[];
    dislikes: ObjectId[];
    comments: number;
}


// =============== Post Schema ===============
export const PostSchema = new Schema<Posts>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            minLength: [3, "Title must be at least 3 characters long"],
            unique: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "categories",
            required: [true, "Category is required"]
        },
        slug: {
            type: String,
            required: [true, "Slug is required"],
            unique: true
        },
        shortDescription: {
            type: String,
            required: [true, "Short Description is required"],
            minLength: [30, "Short Description must be at least 30 characters long"]
        },
        content: {
            type: String,
            required: [true, "Content is required"]
        },
        tags: [{
            type: Schema.Types.ObjectId,
            ref: "tags"
        }],
        author: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: [true, "Author is required"]
        },
        featuredImage: {
            type: String,
            required: [true, "Featured Image is required"]
        },
        status: {
            type: String,
            enum: ["published", "draft"],
            default: "published"
        },
        views: [{
            type: Schema.Types.ObjectId,
            ref: "users"
        }],
        likes: [{
            type: Schema.Types.ObjectId,
            ref: "users"
        }],
        dislikes: [{
            type: Schema.Types.ObjectId,
            ref: "users"
        }],
        comments: {
            type: Number,
            default: 0
        },
    },
    { timestamps: true }
);


// =============== Post Model ================
export const PostModel = model<Posts>('posts', PostSchema);