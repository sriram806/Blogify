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

export const UpdateBlog = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { title, description, blog_content, category } = req.body;

    const file = req.file;

    const blog = await sql`SELECT * FROM blogs WHERE id = ${id}`;
    if (blog.length === 0) {
        return res.status(404).json({ success: false, message: "Blog not found" });
    }
    if (blog[0].author !== req.user?.id) {
        return res.status(403).json({ success: false, message: "You are not authorized to update this blog" });
    }

    let imageUrl = blog[0].image_url;

    if (file) {
        const fileBuffer = await getBuffer(file);
        if (!fileBuffer) return res.status(400).json({ success: false, message: "Invalid file data" });
        const BlogImage = await cloudinary.uploader.upload(fileBuffer, {
            folder: "blog_images",
            resource_type: "image",
        });
        imageUrl = BlogImage.secure_url;
    }

    try {
        const result = await sql`UPDATE blogs SET 
            title = COALESCE(${title}, title),
            description = COALESCE(${description}, description),
            blog_content = COALESCE(${blog_content}, blog_content),
            category = COALESCE(${category}, category),
            image_url = COALESCE(${imageUrl}, image_url)
            WHERE id = ${id} RETURNING *`;
        res.status(200).json({ success: true, message: "Blog updated successfully", blog: result[0] });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error at UpdateBlog: ${error}` });
    }
}

export const GetAllBlogs = async (req: Request, res: Response) => {
    try {
        const blogs = await sql`SELECT * FROM blogs ORDER BY created_at DESC`;
        res.status(200).json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: `Internal server error at GetAllBlogs: ${error}` });
    }
}

// Delete Bolg
export const DeleteBlog = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: "Blog ID is required" });

        const blog = await sql`SELECT * FROM blogs WHERE id = ${id}`;
        if (blog.length === 0) return res.status(404).json({ success: false, message: "Blog not found" });

        if (blog[0].author !== req.user?.id) return res.status(403).json({ success: false, message: "You are not authorized to delete this blog" });
        
        await sql`DELETE FROM blogs WHERE id = ${id}`;
        await sql`DELETE FROM comments WHERE blog_id = ${id}`;
        await sql`DELETE FROM likes WHERE blog_id = ${id}`;

        return res.status(200).json({ success: true, message: "Blog and related data deleted successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error at DeleteBlog: ${error}` });
    }
};
