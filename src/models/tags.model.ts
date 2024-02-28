import { Schema, Document, model } from "mongoose";

// =============== Tag Interface ===============
export interface Tags extends Document{
    title: string;
    slug: string;
    status: "published" | "draft";
}


// =============== Tag Schema ===============
export const TagSchema = new Schema<Tags>(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            minLength: [3, "Title must be at least 3 characters long"],
            unique: true
        },
        slug: {
            type: String,
            required: [true, "Slug is required"],
            unique: true
        },
        status: {
            type: String,
            enum: ["published", "draft"],
            default: "published"
        }
    },
    { timestamps: true }
);


// =============== Tag Model ================
export const TagModel = model<Tags>('tags', TagSchema);