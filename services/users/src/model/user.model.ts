import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    image: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    bio?: string;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        image: {
            type: String,
            required: true
        },
        instagram: String,
        facebook: String,
        linkedin: String,
        bio: {
            type: String,
            default: "Hello! I am using Blogify.",
            maxlength: 200
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IUser>("User", UserSchema);
