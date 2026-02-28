import { Request, Response } from "express";
import axios from "axios";
import { sql } from "../config/db.js";
import redisClient from "../config/redisDB.js";

const BLOG_LIST_SELECT_FIELDS = sql`
    b.id,
    b.slug,
    b.title,
    b.description,
    b.category,
    b.author,
    b.image_url,
    b.created_at,
    COALESCE(c.comment_count, 0)::int AS comments,
    COALESCE(s.like_count, 0)::int AS likes,
    0::int AS views
`;

const BLOG_DETAIL_SELECT_FIELDS = sql`
    b.*,
    COALESCE(c.comment_count, 0)::int AS comments,
    COALESCE(s.like_count, 0)::int AS likes,
    0::int AS views
`;

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
                SELECT ${BLOG_LIST_SELECT_FIELDS}
                FROM blogs b
                LEFT JOIN (
                    SELECT blogid, COUNT(*)::int AS comment_count
                    FROM comments
                    GROUP BY blogid
                ) c ON c.blogid = b.id::text
                LEFT JOIN (
                    SELECT blogid, COUNT(*)::int AS like_count
                    FROM savedblogs
                    GROUP BY blogid
                ) s ON s.blogid = b.id::text
                WHERE b.category = ${category}
                AND (b.title ILIKE '%' || ${SearchQuery} || '%' 
                OR b.description ILIKE '%' || ${SearchQuery} || '%')
                ORDER BY b.created_at DESC;
            `;
        }
        else if (SearchQuery) {
            result = await sql`
                SELECT ${BLOG_LIST_SELECT_FIELDS}
                FROM blogs b
                LEFT JOIN (
                    SELECT blogid, COUNT(*)::int AS comment_count
                    FROM comments
                    GROUP BY blogid
                ) c ON c.blogid = b.id::text
                LEFT JOIN (
                    SELECT blogid, COUNT(*)::int AS like_count
                    FROM savedblogs
                    GROUP BY blogid
                ) s ON s.blogid = b.id::text
                WHERE b.title ILIKE '%' || ${SearchQuery} || '%'
                OR b.description ILIKE '%' || ${SearchQuery} || '%'
                ORDER BY b.created_at DESC;
            `;
        }
        else if (category) {
            result = await sql`
                SELECT ${BLOG_LIST_SELECT_FIELDS}
                FROM blogs b
                LEFT JOIN (
                    SELECT blogid, COUNT(*)::int AS comment_count
                    FROM comments
                    GROUP BY blogid
                ) c ON c.blogid = b.id::text
                LEFT JOIN (
                    SELECT blogid, COUNT(*)::int AS like_count
                    FROM savedblogs
                    GROUP BY blogid
                ) s ON s.blogid = b.id::text
                WHERE b.category = ${category}
                ORDER BY b.created_at DESC;
            `;
        }
        else {
            result = await sql`
                SELECT ${BLOG_LIST_SELECT_FIELDS}
                FROM blogs b
                LEFT JOIN (
                    SELECT blogid, COUNT(*)::int AS comment_count
                    FROM comments
                    GROUP BY blogid
                ) c ON c.blogid = b.id::text
                LEFT JOIN (
                    SELECT blogid, COUNT(*)::int AS like_count
                    FROM savedblogs
                    GROUP BY blogid
                ) s ON s.blogid = b.id::text
                ORDER BY b.created_at DESC;
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

export const getBlogBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        if (!slug) return res.status(400).json({ success: false, message: "Blog slug is required" });

        const cachekey = `blog:${slug}`;
        try {
            const cachedBlog = await redisClient.get(cachekey);

            if (cachedBlog) {
                const parsed = JSON.parse(cachedBlog);
                return res.status(200).json({ success: true, blog: parsed.blog, author: parsed.author, source: "cache" });
            }
        } catch (err: any) {
            console.warn("Redis GET error:", err.message);
        }

        const blog = await sql`
            SELECT ${BLOG_DETAIL_SELECT_FIELDS}
            FROM blogs b
            LEFT JOIN (
                SELECT blogid, COUNT(*)::int AS comment_count
                FROM comments
                GROUP BY blogid
            ) c ON c.blogid = b.id::text
            LEFT JOIN (
                SELECT blogid, COUNT(*)::int AS like_count
                FROM savedblogs
                GROUP BY blogid
            ) s ON s.blogid = b.id::text
            WHERE b.slug = ${slug} OR b.id::text = ${slug}
        `;

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
        console.error('getBlogBySlug error:', error);
        res.status(500).json({ success: false, message: `Internal server error at getBlogBySlug: ${error}` });
    }
};