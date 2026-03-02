"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaComment, FaEdit, FaEye, FaHeart, FaShare, FaTrash } from "react-icons/fa";
import BlogRowCard from "@/Components/Blog/BlogRowCard";
import ReactMarkdown from "react-markdown";
import { BlogDetail, BlogItem } from "@/Components/Blog/blog.types";
import { addCommentToBlog,
  buildAuthorProfilePath,
  BlogCommentItem,
  fetchAllBlogs,
  fetchBlogBySlug,
  fetchCommentsByBlogId,
  deleteBlogById,
  fetchLikeStatus,
  toggleBlogLike,
} from "@/Components/Blog/blog.api";
import { useAuth } from "@/Components/Auth/AuthProvider";
import LoginModal from "@/Components/Auth/LoginModal";
import RegisterModal from "@/Components/Auth/RegisterModal";

export default function BlogDetailPage() {
  const router = useRouter();
  const params = useParams();
  const blogSlug = params.id as string;
  const { user } = useAuth();
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [allBlogs, setAllBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<BlogCommentItem[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMessage("");

      const [detailResponse, listResponse] = await Promise.all([
        fetchBlogBySlug(blogSlug),
        fetchAllBlogs(),
      ]);

      if (!detailResponse.ok || !detailResponse.blog) {
        setBlog(null);
        setErrorMessage(detailResponse.message || "Unable to load this blog.");
        setLoading(false);
        return;
      }

      setBlog(detailResponse.blog);
      setAllBlogs(listResponse.ok ? listResponse.blogs : []);

      const commentsResponse = await fetchCommentsByBlogId(detailResponse.blog.id);
      if (commentsResponse.ok) {
        setComments(commentsResponse.comments);
      } else {
        setComments([]);
      }

      if (user) {
        const likeResponse = await fetchLikeStatus(detailResponse.blog.id);
        setLiked(likeResponse.ok ? likeResponse.liked : false);
      } else {
        setLiked(false);
      }

      setCommentError("");
      setLoading(false);
    };

    if (blogSlug) {
      load();
    }
  }, [blogSlug, user]);

  const relatedBlogs = useMemo(() => {
    if (!blog) return [];
    return allBlogs.filter(
      (b) => b.category === blog.category && b.slug !== blog.slug
    ).slice(0, 3);
  }, [blog, allBlogs]);

  const canEditBlog = Boolean(user?._id && blog?.authorId && user._id === blog.authorId);
  const authorProfilePath = blog?.authorId ? buildAuthorProfilePath(blog.author, blog.authorId) : "";

  const requireAuth = () => {
    if (user) return true;
    setShowLoginModal(true);
    return false;
  };

  const handleLikeToggle = () => {
    if (!requireAuth()) return;
    if (!blog) return;

    const run = async () => {
      const response = await toggleBlogLike(blog.id);
      if (!response.ok) {
        return;
      }

      setLiked(response.liked);
      setBlog((prev) => {
        if (!prev) return prev;
        return { ...prev, likes: response.likes };
      });
    };

    run();
  };

  const handlePostComment = () => {
    if (!requireAuth()) return;
    if (!blog) return;

    const normalized = commentText.trim();
    if (!normalized) return;

    const run = async () => {
      setCommentError("");
      const response = await addCommentToBlog(blog.id, normalized, user?.name || "User");

      if (!response.ok || !response.comment) {
        setCommentError(response.message || "Unable to post comment right now.");
        return;
      }

      const createdComment = response.comment;

      setComments((prev) => [createdComment, ...prev]);
      setBlog((prev) => {
        if (!prev) return prev;
        return { ...prev, comments: response.commentsCount || prev.comments + 1 };
      });
      setCommentText("");
    };

    run();
  };

  const displayedLikes = blog?.likes || 0;
  const displayedComments = comments.length;

  const handleDeleteBlog = async () => {
    if (!blog) return;

    const shouldDelete = window.confirm("Are you sure you want to delete this blog? This action cannot be undone.");
    if (!shouldDelete) return;

    setDeleteError("");
    setIsDeleting(true);

    const response = await deleteBlogById(blog.id);
    if (!response.ok) {
      setDeleteError(response.message || "Unable to delete blog right now.");
      setIsDeleting(false);
      return;
    }

    router.replace("/blog");
  };

  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <section className="container max-w-5xl mx-auto px-5 sm:px-6 md:px-8 py-12">
    
    <div className="animate-pulse space-y-8">
      
      {/* Blog Title Skeleton */}
      <div className="space-y-4">
        <div className="h-10 bg-gray-300 rounded mx-auto"></div>
        <div className="h-4 bg-gray-300 rounded mx-auto"></div>
      </div>

      {/* Featured Image Skeleton */}
      <div className="h-64 bg-gray-300 rounded-xl w-full"></div>

      {/* Blog Content Skeleton */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 rounded w-4/6"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </div>

    </div>

  </section>
</main>
    )
  }

  if (!blog) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <section className="container mx-auto px-5 sm:px-6 md:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Blog Not Found</h1>
            <p className="mt-2 text-gray-600">{errorMessage || "The article you're looking for doesn't exist."}</p>
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
      <article className="container mx-auto px-5 sm:px-6 md:px-8 py-6 sm:py-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition mb-6"
        >
          <FaArrowLeft /> Back to Blogs
        </Link>

        <div className="max-w-5xl mx-auto ">
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
                {authorProfilePath ? (
                  <Link href={authorProfilePath} className="inline-flex items-center gap-3">
                    {blog.authorImage && (
                      <Image
                        src={blog.authorImage}
                        alt={blog.author}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                  </Link>
                ) : (
                  blog.authorImage && (
                    <Image
                      src={blog.authorImage}
                      alt={blog.author}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )
                )}
                <div>
                  {authorProfilePath ? (
                    <Link href={authorProfilePath} className="font-semibold text-gray-900 hover:underline">
                      {blog.author}
                    </Link>
                  ) : (
                    <p className="font-semibold text-gray-900">{blog.author}</p>
                  )}
                  <p className="text-sm text-gray-500">{blog.readMinutes} min read</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleLikeToggle}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                    liked
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <FaHeart className={liked ? "fill-current" : ""} />
                  <span>{displayedLikes}</span>
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                >
                  <FaShare />
                </button>
                {canEditBlog && (
                  <>
                    <Link
                      href={`/blog/write?editId=${blog.id}`}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition"
                    >
                      <FaEdit />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={handleDeleteBlog}
                      disabled={isDeleting}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FaTrash />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </>
                )}
              </div>
            </div>
            {deleteError && <p className="mt-3 text-sm text-red-600">{deleteError}</p>}
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
                  href={`/blog?search=${tag}`}
                  className="px-3 py-1.5 rounded-full bg-gray-200 text-gray-700 text-sm hover:bg-gray-300 transition"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          <section className="py-8 border-b border-gray-200 mb-8">
            <div className="flex items-center gap-4 mb-6">
              {authorProfilePath ? (
                <Link href={authorProfilePath} className="inline-flex items-center gap-4">
                  {blog.authorImage && (
                    <Image
                      src={blog.authorImage}
                      alt={blog.author}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                </Link>
              ) : (
                blog.authorImage && (
                  <Image
                    src={blog.authorImage}
                    alt={blog.author}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )
              )}
              <div>
                {authorProfilePath ? (
                  <Link href={authorProfilePath} className="text-lg font-semibold text-gray-900 hover:underline">
                    {blog.author}
                  </Link>
                ) : (
                  <h3 className="text-lg font-semibold text-gray-900">{blog.author}</h3>
                )}
                {blog.authorBio && (
                  <p className="text-gray-600">{blog.authorBio}</p>
                )}
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments ({displayedComments})</h2>

            {!user && (
              <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700 flex flex-wrap items-center justify-between gap-3">
                <span>Login or register to like this blog and post comments.</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(true)}
                    className="px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(true)}
                    className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                  >
                    Register
                  </button>
                </div>
              </div>
            )}

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
                onClick={handlePostComment}
                className="mt-3 px-6 py-2.5 rounded-full bg-black text-white hover:bg-gray-800 transition"
              >
                Post Comment
              </button>
              {commentError && <p className="mt-2 text-sm text-red-600">{commentError}</p>}
            </div>

            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="p-4 rounded-lg border border-gray-200 bg-white">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gray-300" />
                      <div>
                        <p className="font-semibold text-gray-900">{comment.author}</p>
                        <p className="text-xs text-gray-500">{comment.createdAtLabel}</p>
                      </div>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-600">
                  No comments yet. Be the first to comment.
                </div>
              )}
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
                  slug={relatedBlog.slug}
                  authorId={relatedBlog.authorId}
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
              <FaComment /> {displayedComments} comments
            </span>
            <span className="flex items-center gap-2">
              <FaHeart /> {displayedLikes} likes
            </span>
          </div>
          <Link
            href="/blog"
            className="px-6 py-2.5 rounded-full bg-black text-white hover:bg-gray-800 transition"
          >
            Explore More
          </Link>
        </div>
      </article>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </main>
  );
}
