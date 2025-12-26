import { Request, Response } from "express";
import getBuffer from "../utils/buffer.service";
import { v2 as cloudinary } from "cloudinary";
import { sql } from "../utils/DataBase";

interface AuthRequest extends Request {
    user?: { id: string };
}

export const CreateBlog = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, blog_content, category } = req.body;

        const file = req.file;
        if (!file) return res.status(400).json({ success: false, message: "No file uploaded" });

        const fileBuffer = await getBuffer(file);
        if (!fileBuffer) return res.status(400).json({ success: false, message: "Invalid file data" });

        const BlogImage = await cloudinary.uploader.upload(fileBuffer, {
            folder: "blog_images",
            resource_type: "image",
        });

        const result = await sql`INSERT INTO blogs(title, description, blog_content, category, author, image_url)
        VALUES (${title}, ${description}, ${blog_content}, ${category}, ${req.user?.id}, ${BlogImage.secure_url}) RETURNING *`;

        res.status(201).json({ success: true, message: "Blog created successfully", blog: result[0] });

    } catch (error) {
        res.status(500).json({ success: false, message: `Internal server error at CreateBlog: ${error}` });
    }
}