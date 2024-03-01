import { Schema, Document, model, ObjectId } from "mongoose";

// =============== Comment Interface ===============
export interface Comments extends Document{
    whichPost: ObjectId;
    content: string;
    commentedBy: ObjectId;
    parent?: ObjectId | Comments;
    status: "approved" | "pending";
    likes?: ObjectId[];
    dislikes?: ObjectId[];
    isReported?: boolean;
    replies?: number;
}


// =============== Comment Schema ===============
export const CommentSchema = new Schema<Comments>(
    {
        whichPost: {
            type: Schema.Types.ObjectId,
            ref: "posts",
            required: [true, "Post ID is required"]
        },
        content: {
            type: String,
            required: [true, "Content is required"]
        },
        commentedBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: [true, "User ID is required"]
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: "Comments"
        },
        status: {
            type: String,
            enum: ["approved", "pending"],
            default: "pending"
        },
        likes: [{
            type: Schema.Types.ObjectId,
            ref: "users"
        }],
        dislikes: [{
            type: Schema.Types.ObjectId,
            ref: "users"
        }],
        isReported: {
            type: Boolean,
            default: false
        },
        replies: {
            type: Number,
            default: 0
        },
    },
    { timestamps: true }
);


// =============== Comment Model ================
export const CommentModel = model<Comments>('comments', CommentSchema);