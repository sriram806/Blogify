import { Request, Response } from "express";
import { sql } from "../config/db.js";

export const getallBlogs = async (req: Request, res: Response) => {
    try {
        const { SearchQuery, category } = req.query;
        let blogs

        if (SearchQuery && category) {
            blogs = await sql`SELECT * FROM blogs WHERE category = ${category} AND (title ILIKE '%' || ${SearchQuery} || '%' OR description ILIKE '%' || ${SearchQuery} || '%') ORDER BY created_at DESC;`
        } else if (SearchQuery) {
            blogs = await sql`SELECT * FROM blogs WHERE title ILIKE '%' || ${SearchQuery} || '%' OR description ILIKE '%' || ${SearchQuery} || '%' ORDER BY created_at DESC;`
        } else {
            blogs = await sql`SELECT * FROM blogs WHERE category = ${category} ORDER BY created_at DESC;`
        }

        res.status(200).json({ success: true, blogs: blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: `Internal server error at fetch all blogs: ${error}` })
    }
}

export const getBlogById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: "Blog ID is required" });

        const blog = await sql`SELECT * FROM blogs WHERE id = ${id}`;

        const data = await axios.get(`http://localhost:5000/api/v1/users/${blog[0].author}`);
        res.status(200).json({ success: true, blog: blog[0], author: data });
    } catch (error) {
        res.status(500).json({ success: false, message: `Internal server error at getBlogById: ${error}` })
    }
}