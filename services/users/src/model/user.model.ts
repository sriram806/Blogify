import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "admin" | "user";
  image: string;
  provider: "local" | "google" | "github" | "facebook";
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  bio?: string;
  isActive: boolean;
  createdAt?: Date;
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
      lowercase: true,
      index: true
    },
    password: {
      type: String,
      select: false
    },
    provider: {
      type: String,
      enum: ["local", "google", "github", "facebook"],
      default: "local"
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },
    image: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
    },
    instagram: String,
    facebook: String,
    linkedin: String,
    bio: {
      type: String,
      default: "Hello! I am using Blogify.",
      maxlength: 200
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;