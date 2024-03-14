import { Schema, Document, model, ObjectId } from "mongoose";


// =============== Category Interface ===============
export interface Categories extends Document{
    title: string;
    slug: string;
    parent?: ObjectId | Categories;
    status: "published" | "draft";
}


// =============== Category Schema ===============
export const CategorySchema = new Schema<Categories>(
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
        parent: {
            type: Schema.Types.ObjectId,
            ref: "Categories"
        },
        status: {
            type: String,
            enum: ["published", "draft"],
            default: "published"
        }
    },
    { timestamps: true }
);


// =============== Category Model ================
export const CategoryModel = model<Categories>('categories', CategorySchema);