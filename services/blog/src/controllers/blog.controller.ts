import { Request, Response } from "express";
import axios from "axios";
import { sql } from "../config/db.js";
import redisClient from "../config/redisDB.js";

const parseCsvParam = (value?: string) =>
    (value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 8);

// Ensure pg_trgm extension is available (idempotent)
const ensureTrgm = async () => {
    try {
        await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`;
    } catch {
        // extension may already exist or not be permitted — graceful fallback
    }
};
void ensureTrgm();

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

export const getSearchSuggestions = async (req: Request, res: Response) => {
    try {
        const q = ((req.query.q as string) || "").trim();
        const contextCategories = parseCsvParam(req.query.contextCategories as string | undefined);
        const contextTitles = parseCsvParam(req.query.contextTitles as string | undefined);
        if (q.length < 2) {
            return res.status(200).json({ success: true, suggestions: [] });
        }

        const cacheKey = `suggest:${q.toLowerCase()}:${contextCategories.join("|")}:${contextTitles.join("|")}`;
        try {
            const cached = await redisClient.get(cacheKey);
            if (cached) {
                return res.status(200).json({ success: true, suggestions: JSON.parse(cached), source: "cache" });
            }
        } catch (err: any) {
            console.warn("Redis GET error (suggest):", err.message);
        }

        const titleSeed = contextTitles[0] || q;

        // Use pg_trgm word_similarity + engagement + personalization boosts
        let suggestions;
        try {
            suggestions = await sql`
                SELECT
                    b.slug,
                    b.title,
                    b.category,
                    (
                        GREATEST(word_similarity(${q}, b.title), word_similarity(${q}, b.description)) * 0.65
                        + LEAST((COALESCE(s.like_count, 0)::float / 40.0), 1.0) * 0.2
                        + LEAST((COALESCE(c.comment_count, 0)::float / 25.0), 1.0) * 0.1
                        + CASE WHEN b.category = ANY(${contextCategories}::text[]) THEN 0.15 ELSE 0 END
                        + CASE WHEN word_similarity(${titleSeed}, b.title) > 0.2 THEN 0.1 ELSE 0 END
                    ) AS score
                FROM blogs b
                LEFT JOIN (
                    SELECT blogid, COUNT(*)::int AS comment_count FROM comments GROUP BY blogid
                ) c ON c.blogid = b.id::text
                LEFT JOIN (
                    SELECT blogid, COUNT(*)::int AS like_count FROM savedblogs GROUP BY blogid
                ) s ON s.blogid = b.id::text
                WHERE
                    b.title ILIKE '%' || ${q} || '%'
                    OR b.description ILIKE '%' || ${q} || '%'
                    OR word_similarity(${q}, b.title) > 0.2
                    OR word_similarity(${q}, b.description) > 0.15
                ORDER BY score DESC, COALESCE(s.like_count,0) DESC, b.created_at DESC
                LIMIT 9;
            `;
        } catch {
            // pg_trgm not available — ILIKE + engagement + category boost fallback
            suggestions = await sql`
                SELECT
                    b.slug,
                    b.title,
                    b.category,
                    (
                        CASE WHEN b.title ILIKE ${q + "%"} THEN 0.6 ELSE 0 END
                        + CASE WHEN b.category = ANY(${contextCategories}::text[]) THEN 0.2 ELSE 0 END
                        + LEAST((COALESCE(s.like_count, 0)::float / 40.0), 1.0) * 0.2
                    ) AS score
                FROM blogs b
                LEFT JOIN (
                    SELECT blogid, COUNT(*)::int AS like_count FROM savedblogs GROUP BY blogid
                ) s ON s.blogid = b.id::text
                WHERE b.title ILIKE '%' || ${q} || '%'
                   OR b.description ILIKE '%' || ${q} || '%'
                ORDER BY score DESC, COALESCE(s.like_count,0) DESC, b.created_at DESC
                LIMIT 9;
            `;
        }

        const results = (suggestions as any[]).map((r) => ({
            slug: r.slug,
            title: r.title,
            category: r.category,
            score: Number(r.score || 0),
        }));

        try {
            await redisClient.set(cacheKey, JSON.stringify(results), { EX: 30 });
        } catch (err: any) {
            console.warn("Redis SET error (suggest):", err.message);
        }

        res.status(200).json({ success: true, suggestions: results });
    } catch (error) {
        res.status(500).json({ success: false, message: `Internal server error at getSearchSuggestions: ${error}` });
    }
};

export const getRelatedBlogs = async (req: Request, res: Response) => {
    try {
        const { blogId } = req.params;
        const contextCategories = parseCsvParam(req.query.contextCategories as string | undefined);
        const contextTitles = parseCsvParam(req.query.contextTitles as string | undefined);
        if (!blogId) return res.status(400).json({ success: false, message: "blogId is required" });

        const cacheKey = `related:${blogId}:${contextCategories.join("|")}:${contextTitles.join("|")}`;
        try {
            const cached = await redisClient.get(cacheKey);
            if (cached) {
                return res.status(200).json({ success: true, blogs: JSON.parse(cached), source: "cache" });
            }
        } catch (err: any) {
            console.warn("Redis GET error (related):", err.message);
        }

        // Fetch the source blog first to get category, title, description
        const sourceBlog = await sql`
            SELECT id, slug, title, description, category FROM blogs
            WHERE id::text = ${blogId} OR slug = ${blogId}
            LIMIT 1;
        `;

        if (!sourceBlog || sourceBlog.length === 0) {
            return res.status(404).json({ success: false, message: "Source blog not found" });
        }

        const src = sourceBlog[0] as { id: any; slug: string; title: string; description: string; category: string };

        const titleSeed = contextTitles[0] || src.title;

        // Multi-signal scoring query + personalization from reader context
        let related;
        try {
            related = await sql`
                SELECT
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
                    0::int AS views,
                    (
                        CASE WHEN b.category = ${src.category} THEN 5 ELSE 0 END
                        + CASE WHEN b.category = ANY(${contextCategories}::text[]) THEN 3 ELSE 0 END
                        + CASE WHEN word_similarity(${src.title}, b.title) > 0.15 THEN 3 ELSE 0 END
                        + CASE WHEN word_similarity(${titleSeed}, b.title) > 0.15 THEN 2 ELSE 0 END
                        + CASE WHEN word_similarity(${src.description}, b.description) > 0.1 THEN 2 ELSE 0 END
                        + CASE WHEN (COALESCE(s.like_count,0) + COALESCE(c.comment_count,0)) > 0 THEN 1 ELSE 0 END
                    ) AS relevance_score
                FROM blogs b
                LEFT JOIN (
                    SELECT blogid, COUNT(*)::int AS comment_count FROM comments GROUP BY blogid
                ) c ON c.blogid = b.id::text
                LEFT JOIN (
                    SELECT blogid, COUNT(*)::int AS like_count FROM savedblogs GROUP BY blogid
                ) s ON s.blogid = b.id::text
                WHERE b.id::text <> ${String(src.id)}
                  AND b.slug <> ${src.slug}
                ORDER BY relevance_score DESC, likes DESC, comments DESC, b.created_at DESC
                LIMIT 6;
            `;
        } catch {
            // pg_trgm not available — fallback with category + engagement + context category
            related = await sql`
                SELECT
                    b.id, b.slug, b.title, b.description, b.category,
                    b.author, b.image_url, b.created_at,
                    COALESCE(c.comment_count, 0)::int AS comments,
                    COALESCE(s.like_count, 0)::int AS likes,
                    0::int AS views,
                    (
                        CASE WHEN b.category = ${src.category} THEN 3 ELSE 0 END
                        + CASE WHEN b.category = ANY(${contextCategories}::text[]) THEN 2 ELSE 0 END
                        + CASE WHEN (COALESCE(s.like_count,0) + COALESCE(c.comment_count,0)) > 0 THEN 1 ELSE 0 END
                    ) AS relevance_score
                FROM blogs b
                LEFT JOIN (
                    SELECT blogid, COUNT(*)::int AS comment_count FROM comments GROUP BY blogid
                ) c ON c.blogid = b.id::text
                LEFT JOIN (
                    SELECT blogid, COUNT(*)::int AS like_count FROM savedblogs GROUP BY blogid
                ) s ON s.blogid = b.id::text
                WHERE b.id::text <> ${String(src.id)}
                ORDER BY relevance_score DESC, likes DESC, comments DESC, b.created_at DESC
                LIMIT 6;
            `;
        }

        const blogs = related as any[];

        try {
            await redisClient.set(cacheKey, JSON.stringify(blogs), { EX: 120 });
        } catch (err: any) {
            console.warn("Redis SET error (related):", err.message);
        }

        res.status(200).json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: `Internal server error at getRelatedBlogs: ${error}` });
    }
};