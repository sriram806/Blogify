import { Request, Response } from "express";
import axios from "axios";
import { sql } from "../config/db.js";
import redisClient from "../config/redisDB.js";

export const getallBlogs = async (req: Request, res: Response) => {
    try {
        const SearchQuery = (req.query.SearchQuery as string) || "";
        const category = (req.query.category as string) || "";

        const cachekey = `blogs:${SearchQuery}:${category}`;
        try {
            const cachedBlogs = await redisClient.get(cachekey);

            if (cachedBlogs) {
                return res.status(200).json({
                    success: true,
                    blogs: JSON.parse(cachedBlogs),
                    source: "cache"
                });
            }
        } catch (err: any) {
            console.warn("Redis GET error:", err.message);
        }

        let result;

        if (SearchQuery && category) {
            result = await sql`
                SELECT * FROM blogs 
                WHERE category = ${category}
                AND (title ILIKE '%' || ${SearchQuery} || '%' 
                OR description ILIKE '%' || ${SearchQuery} || '%')
                ORDER BY created_at DESC;
            `;
        }
        else if (SearchQuery) {
            result = await sql`
                SELECT * FROM blogs
                WHERE title ILIKE '%' || ${SearchQuery} || '%'
                OR description ILIKE '%' || ${SearchQuery} || '%'
                ORDER BY created_at DESC;
            `;
        }
        else if (category) {
            result = await sql`
                SELECT * FROM blogs
                WHERE category = ${category}
                ORDER BY created_at DESC;
            `;
        }
        else {
            result = await sql`
                SELECT * FROM blogs
                ORDER BY created_at DESC;
            `;
        }

        const blogs = result;
        try {
            await redisClient.set(cachekey, JSON.stringify(blogs), { EX: 60 });
        } catch (err: any) {
            console.warn("Redis SET error:", err.message);
        }

        res.status(200).json({ success: true, blogs, source: "database" });

    } catch (error) {
        res.status(500).json({ success: false, message: `Internal server error while fetching blogs: ${error}` });
    }
};

export const getBlogById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: "Blog ID is required" });

        const cachekey = `blog:${id}`;
        try {
            const cachedBlog = await redisClient.get(cachekey);

            if (cachedBlog) {
                return res.status(200).json({ success: true, blog: JSON.parse(cachedBlog), source: "cache" });
            }
        } catch (err: any) {
            console.warn("Redis GET error:", err.message);
        }

        const blog = await sql`SELECT * FROM blogs WHERE id = ${id}`;

        if (!blog || blog.length === 0) {
            return res.status(404).json({ success: false, message: "Blog not found", source: "database" });
        }

        const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL || "http://localhost:5000";
        const authorId = blog[0].author;

        let author: any = null;
        try {
            const resp = await axios.get(
                `${USERS_SERVICE_URL}/api/v1/users/getUserDetails/${authorId}`,
                {
                    headers: {
                        Authorization: (req.headers.authorization as string) || "",
                    },
                    timeout: 5000,
                }
            );
            author = resp.data;
        } catch (axiosErr: any) {
            console.warn("User service lookup failed:", axiosErr?.response?.status || axiosErr?.message);
        }

        try {
            await redisClient.set(cachekey, JSON.stringify({ blog: blog[0], author }), { EX: 60 });
        } catch (err: any) {
            console.warn("Redis SET error:", err.message);
        }
        res.status(200).json({ success: true, blog: blog[0], author });
    } catch (error) {
        console.error('getBlogById error:', error);
        res.status(500).json({ success: false, message: `Internal server error at getBlogById: ${error}` });
    }
};