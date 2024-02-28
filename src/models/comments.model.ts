import { Schema, Document, model } from "mongoose";

// =============== User Interface ===============
export interface Users extends Document{
    fullName: string;
    username: string;
    email: string;
    isLoggedin: boolean;
    role: boolean;
    image: string;
    accessToken: string;
    verificationToken: string;
    verificationTokenExpires: Date;
}


// =============== User Schema ===============
export const UserSchema = new Schema(
    {
        fullName: {
            type: String,
            minLength: [3, "Full Name must be at least 3 characters long"],
        },
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
        },
        isLoggedin: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        image: {
            type: String
        },
        accessToken: {
            type: String,
            default: null
        },
        verificationToken: {
            type: String,
            default: null
        },
        verificationTokenExpires: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
);


// =============== User Model ================
export const UserModel = model<Users>('users', UserSchema);