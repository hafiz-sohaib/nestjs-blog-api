import { Schema, Document, model } from "mongoose";
import { randomBytes, createHash } from "crypto"


// =============== User Interface ===============
export interface Users extends Document{
    fullName: string;
    username: string;
    email: string;
    isLoggedin: boolean;
    role: "user" | "admin";
    image: string;
    accessToken: string;
    verificationToken: string;
    verificationTokenExpires: Date;
    generateVerificationToken(): Promise<string>;
}


// =============== User Schema ===============
export const UserSchema = new Schema<Users>(
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


UserSchema.methods.generateVerificationToken = async function (): Promise<string> {
    const token = randomBytes(32).toString("hex");
    this.verificationToken = createHash('sha256').update(token).digest("hex");
    this.verificationTokenExpires = Date.now() + 10 * 60 * 1000;
    return token;
}


// =============== User Model ================
export const UserModel = model<Users>('users', UserSchema);