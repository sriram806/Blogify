"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FaArrowLeft, FaComment, FaEye, FaHeart, FaShare } from "react-icons/fa";
import BlogRowCard from "@/Components/Blog/BlogRowCard";
import { ALL_BLOGS } from "@/Components/Blog/blog.data";
import { BLOG_DETAILS } from "@/Components/Blog/blog.detail.data";
import ReactMarkdown from "react-markdown";

export default function BlogDetailPage() {
  const params = useParams();
  const blogId = params.id as string;
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");

  const blog = useMemo(() => {
    return BLOG_DETAILS[blogId] || ALL_BLOGS.find((b) => b.id === blogId);
  }, [blogId]);

  const relatedBlogs = useMemo(() => {
    if (!blog) return [];
    return ALL_BLOGS.filter(
      (b) => b.category === blog.category && b.id !== blog.id
    ).slice(0, 3);
  }, [blog]);

  if (!blog) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <section className="container mx-auto px-5 sm:px-6 md:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Blog Not Found</h1>
            <p className="mt-2 text-gray-600">The article you're looking for doesn't exist.</p>
            <Link
              href="/blog"
              className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black text-white hover:bg-gray-800 transition"
            >
              <FaArrowLeft /> Back to Blogs
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <article className="container mx-auto px-5 sm:px-6 md:px-8 py-8 sm:py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition mb-6"
        >
          <FaArrowLeft /> Back to Blogs
        </Link>

        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex px-3 py-1.5 rounded-full bg-black text-white text-xs font-semibold">
                {blog.category}
              </span>
              <span className="text-sm text-gray-500">{blog.publishedAt}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              {blog.title}
            </h1>

            <p className="text-lg text-gray-600 mb-6">{blog.excerpt}</p>

            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {blog.authorImage && (
                  <Image
                    src={blog.authorImage}
                    alt={blog.author}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-900">{blog.author}</p>
                  <p className="text-sm text-gray-500">{blog.readMinutes} min read</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                    liked
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <FaHeart className={liked ? "fill-current" : ""} />
                  <span>{blog.likes + (liked ? 1 : 0)}</span>
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                >
                  <FaShare />
                </button>
              </div>
            </div>
          </header>

          <div className="relative w-full h-96 mb-12 rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="prose prose-lg max-w-none mb-12 text-gray-700">
            {blog.content ? (
              <ReactMarkdown>
                {blog.content}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-600">No content available for this blog.</p>
            )}
          </div>

          <div className="py-6 mb-8 border-t border-b border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Tags</p>
            <div className="flex flex-wrap gap-2">
              {(blog.tags || []).map((tag) => (
                <Link
                  key={tag}
                  href={`/blogs?search=${tag}`}
                  className="px-3 py-1.5 rounded-full bg-gray-200 text-gray-700 text-sm hover:bg-gray-300 transition"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          <section className="py-8 border-b border-gray-200 mb-8">
            <div className="flex items-center gap-4 mb-6">
              {blog.authorImage && (
                <Image
                  src={blog.authorImage}
                  alt={blog.author}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{blog.author}</h3>
                {blog.authorBio && (
                  <p className="text-gray-600">{blog.authorBio}</p>
                )}
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments ({blog.comments})</h2>

            <div className="mb-8 p-4 rounded-xl border border-gray-200 bg-white">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave a Comment
              </label>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
              />
              <button
                type="button"
                className="mt-3 px-6 py-2.5 rounded-full bg-black text-white hover:bg-gray-800 transition"
              >
                Post Comment
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-gray-200 bg-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-300" />
                  <div>
                    <p className="font-semibold text-gray-900">Comment Author</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <p className="text-gray-700">This is a great article! Really helpful insights.</p>
              </div>
            </div>
          </section>
        </div>

        {relatedBlogs.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="space-y-4">
              {relatedBlogs.map((relatedBlog) => (
                <BlogRowCard
                  key={relatedBlog.id}
                  id={relatedBlog.id}
                  title={relatedBlog.title}
                  excerpt={relatedBlog.excerpt}
                  author={relatedBlog.author}
                  authorImage={relatedBlog.authorImage}
                  coverImage={relatedBlog.coverImage}
                  publishedAt={relatedBlog.publishedAt}
                  readTime={`${relatedBlog.readMinutes} min`}
                  category={relatedBlog.category}
                  likes={relatedBlog.likes}
                  comments={relatedBlog.comments}
                  views={relatedBlog.views}
                />
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 flex items-center justify-between">
          <div className="flex items-center gap-6 text-gray-600">
            <span className="flex items-center gap-2">
              <FaEye /> {blog.views} views
            </span>
            <span className="flex items-center gap-2">
              <FaComment /> {blog.comments} comments
            </span>
            <span className="flex items-center gap-2">
              <FaHeart /> {blog.likes + (liked ? 1 : 0)} likes
            </span>
          </div>
          <Link
            href="/blogs"
            className="px-6 py-2.5 rounded-full bg-black text-white hover:bg-gray-800 transition"
          >
            Explore More
          </Link>
        </div>
      </article>
    </main>
  );
}
