import { Request, Response } from "express";
import getBuffer from "../utils/buffer.service";
import { v2 as cloudinary } from "cloudinary";
import { sql } from "../utils/DataBase";
import { invalidateCache } from "../utils/rabbitmq";

interface AuthRequest extends Request {
    user?: { id: string };
}

const toBaseSlug = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "blog";

const createUniqueBlogSlug = async (title: string, blogId?: string | number) => {
    const baseSlug = toBaseSlug(title);
    let candidate = baseSlug;
    let suffix = 1;

    while (true) {
        const existing = await sql`
            SELECT id FROM blogs WHERE slug = ${candidate} LIMIT 1
        `;

        if (!existing.length || String(existing[0].id) === String(blogId || "")) {
            return candidate;
        }

        suffix += 1;
        candidate = `${baseSlug}-${suffix}`;
    }
};

export const CreateBlog = async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, blog_content, category } = req.body;

        const slug = await createUniqueBlogSlug(title || "blog");

        const file = req.file;
        if (!file) return res.status(400).json({ success: false, message: "No file uploaded" });

        const fileBuffer = await getBuffer(file);
        if (!fileBuffer) return res.status(400).json({ success: false, message: "Invalid file data" });

        const BlogImage = await cloudinary.uploader.upload(fileBuffer, {
            folder: "blog_images",
            resource_type: "image",
        });

        const result = await sql`INSERT INTO blogs(slug, title, description, blog_content, category, author, image_url)
        VALUES (${slug}, ${title}, ${description}, ${blog_content}, ${category}, ${req.user?.id}, ${BlogImage.secure_url}) RETURNING *`;

        await invalidateCache(["blogs:*"]);

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
    const nextSlug = title ? await createUniqueBlogSlug(title, id) : null;

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
            slug = COALESCE(${nextSlug}, slug),
            image_url = COALESCE(${imageUrl}, image_url)
            WHERE id = ${id} RETURNING *`;
        
        await invalidateCache(["blogs:*"]);
        
        res.status(200).json({ success: true, message: "Blog updated successfully", blog: result[0] });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error at UpdateBlog: ${error}` });
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
        await sql`DELETE FROM comments WHERE blogid = ${id}`;
        await sql`DELETE FROM savedblogs WHERE blogid = ${id}`;

        await invalidateCache(["blogs:*"]);

        return res.status(200).json({ success: true, message: "Blog and related data deleted successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error at DeleteBlog: ${error}` });
    }
};

export const ToggleLike = async (req: AuthRequest, res: Response) => {
    try {
        const { blogId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (!blogId) {
            return res.status(400).json({ success: false, message: "Blog id is required" });
        }

        const blog = await sql`SELECT id FROM blogs WHERE id = ${blogId} LIMIT 1`;
        if (!blog.length) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        const existing = await sql`
            SELECT id FROM savedblogs WHERE blogid = ${blogId} AND userid = ${userId} LIMIT 1
        `;

        let liked = false;

        if (existing.length) {
            await sql`DELETE FROM savedblogs WHERE blogid = ${blogId} AND userid = ${userId}`;
            liked = false;
        } else {
            await sql`INSERT INTO savedblogs(userid, blogid) VALUES (${userId}, ${blogId})`;
            liked = true;
        }

        const total = await sql`
            SELECT COUNT(*)::int AS likes FROM savedblogs WHERE blogid = ${blogId}
        `;

        await invalidateCache(["blogs:*", "blog:*"]);

        return res.status(200).json({
            success: true,
            liked,
            likes: total[0]?.likes || 0,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error at ToggleLike: ${error}` });
    }
};

export const GetLikeStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { blogId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (!blogId) {
            return res.status(400).json({ success: false, message: "Blog id is required" });
        }

        const existing = await sql`
            SELECT id FROM savedblogs WHERE blogid = ${blogId} AND userid = ${userId} LIMIT 1
        `;

        return res.status(200).json({
            success: true,
            liked: existing.length > 0,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error at GetLikeStatus: ${error}` });
    }
};

export const AddComment = async (req: AuthRequest, res: Response) => {
    try {
        const { blogId } = req.params;
        const userId = req.user?.id;
        const { comment, username } = req.body as { comment?: string; username?: string };

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (!blogId) {
            return res.status(400).json({ success: false, message: "Blog id is required" });
        }

        const normalizedComment = (comment || "").trim();
        if (!normalizedComment) {
            return res.status(400).json({ success: false, message: "Comment is required" });
        }

        const blog = await sql`SELECT id FROM blogs WHERE id = ${blogId} LIMIT 1`;
        if (!blog.length) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }

        const safeUsername = (username || "").trim() || "User";

        const inserted = await sql`
            INSERT INTO comments(comment, userid, username, blogid)
            VALUES (${normalizedComment}, ${userId}, ${safeUsername}, ${blogId})
            RETURNING *
        `;

        const total = await sql`
            SELECT COUNT(*)::int AS comments FROM comments WHERE blogid = ${blogId}
        `;

        await invalidateCache(["blogs:*", "blog:*"]);

        return res.status(201).json({
            success: true,
            comment: inserted[0],
            comments: total[0]?.comments || 0,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error at AddComment: ${error}` });
    }
};

export const GetCommentsByBlog = async (req: Request, res: Response) => {
    try {
        const { blogId } = req.params;

        if (!blogId) {
            return res.status(400).json({ success: false, message: "Blog id is required" });
        }

        const comments = await sql`
            SELECT id, comment, userid, username, blogid, created_at
            FROM comments
            WHERE blogid = ${blogId}
            ORDER BY created_at DESC
        `;

        return res.status(200).json({
            success: true,
            comments,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error at GetCommentsByBlog: ${error}` });
    }
};

export const SaveDraft = async (req: AuthRequest, res: Response) => {
    try {
        const { id, title, description, blog_content, category, metadata } = req.body;

        if (!req.user?.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (id) {
            const existing = await sql`SELECT * FROM blog_drafts WHERE id = ${id} AND author = ${req.user.id}`;
            if (existing.length === 0) {
                return res.status(404).json({ success: false, message: "Draft not found" });
            }

            const updated = await sql`UPDATE blog_drafts SET
                title = COALESCE(${title}, title),
                description = COALESCE(${description}, description),
                blog_content = COALESCE(${blog_content}, blog_content),
                category = COALESCE(${category}, category),
                metadata = COALESCE(${metadata ? JSON.stringify(metadata) : null}::jsonb, metadata),
                updated_at = CURRENT_TIMESTAMP
                WHERE id = ${id} AND author = ${req.user.id}
                RETURNING *`;

            return res.status(200).json({ success: true, message: "Draft updated", draft: updated[0] });
        }

        const created = await sql`INSERT INTO blog_drafts(
            title,
            description,
            blog_content,
            category,
            author,
            metadata
        ) VALUES (
            ${title || ""},
            ${description || ""},
            ${blog_content || ""},
            ${category || "Technology"},
            ${req.user.id},
            ${JSON.stringify(metadata || {})}::jsonb
        ) RETURNING *`;

        return res.status(201).json({ success: true, message: "Draft saved", draft: created[0] });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error at SaveDraft: ${error}` });
    }
};

export const GetMyDrafts = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const drafts = await sql`SELECT * FROM blog_drafts WHERE author = ${req.user.id} ORDER BY updated_at DESC`;

        return res.status(200).json({ success: true, drafts });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error at GetMyDrafts: ${error}` });
    }
};

export const DeleteDraft = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        if (!req.user?.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const draft = await sql`SELECT * FROM blog_drafts WHERE id = ${id} AND author = ${req.user.id}`;
        if (draft.length === 0) {
            return res.status(404).json({ success: false, message: "Draft not found" });
        }

        await sql`DELETE FROM blog_drafts WHERE id = ${id} AND author = ${req.user.id}`;

        return res.status(200).json({ success: true, message: "Draft deleted" });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error at DeleteDraft: ${error}` });
    }
};
