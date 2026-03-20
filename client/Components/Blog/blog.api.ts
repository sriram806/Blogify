import { getAuthorBlogApiBase, secureApiFetch } from "@/lib/api";
import { BlogDetail, BlogItem } from "./blog.types";

type RawBlog = {
  id: number | string;
  slug?: string;
  title?: string;
  description?: string;
  blog_content?: string;
  category?: string;
  author?: string | { id?: string; _id?: string; name?: string; image?: string; bio?: string };
  image_url?: string;
  created_at?: string;
  likes?: number | string;
  comments?: number | string;
  views?: number | string;
};

type UserDetailsResponse = {
  success?: boolean;
  data?: {
    _id?: string;
    name?: string;
    email?: string;
    image?: string;
    bio?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
};

export type PublicUserProfile = {
  _id: string;
  name: string;
  email?: string;
  image?: string;
  bio?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
};

type AuthorPayload = {
  data?: {
    name?: string;
    image?: string;
    bio?: string;
  };
  user?: {
    name?: string;
    image?: string;
    bio?: string;
  };
  name?: string;
  image?: string;
  bio?: string;
};

type AllBlogsResponse = {
  success?: boolean;
  blogs?: RawBlog[];
  message?: string;
};

type BlogByIdResponse = {
  success?: boolean;
  blog?: RawBlog;
  author?: AuthorPayload;
  message?: string;
};

type LikeToggleResponse = {
  success?: boolean;
  liked?: boolean;
  likes?: number;
  message?: string;
};

type LikeStatusResponse = {
  success?: boolean;
  liked?: boolean;
  message?: string;
};

type DeleteBlogResponse = {
  success?: boolean;
  message?: string;
};

type CommentPayload = {
  id: number | string;
  comment: string;
  userid: string;
  username: string;
  blogid: string;
  created_at?: string;
};

type CommentsResponse = {
  success?: boolean;
  comments?: CommentPayload[];
  message?: string;
};

type AddCommentResponse = {
  success?: boolean;
  comment?: CommentPayload;
  comments?: number;
  message?: string;
};

const BLOG_READ_API = process.env.NEXT_PUBLIC_BLOG_API_URL || "http://localhost:5002/api/v1/blog";
const USER_API_BASE = process.env.NEXT_PUBLIC_USER_API_URL || "http://localhost:5000/api/v1/users";
const authorDetailsCache = new Map<string, { name?: string; image?: string; bio?: string }>();
const AUTHOR_CACHE_STORAGE_KEY = "blogify.author.cache.v1";

const toDateText = (value?: string) => {
  if (!value) return { publishedOn: new Date().toISOString(), publishedAt: "Recently" };

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { publishedOn: new Date().toISOString(), publishedAt: "Recently" };

  const now = Date.now();
  const diffDays = Math.floor((now - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return { publishedOn: date.toISOString(), publishedAt: "Today" };
  if (diffDays === 1) return { publishedOn: date.toISOString(), publishedAt: "1 day ago" };
  if (diffDays < 7) return { publishedOn: date.toISOString(), publishedAt: `${diffDays} days ago` };
  if (diffDays < 30) return { publishedOn: date.toISOString(), publishedAt: `${Math.floor(diffDays / 7)} weeks ago` };

  return {
    publishedOn: date.toISOString(),
    publishedAt: date.toLocaleDateString(),
  };
};

const getReadMinutes = (content: string, excerpt?: string) => {
  const source = content.trim().length > 0 ? content : (excerpt || "");
  const words = source.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "blog";

export const buildAuthorProfilePath = (authorName?: string, authorId?: string) => {
  const handle = toSlug(authorName || "author");
  const uid = (authorId || "").trim();
  return uid
    ? `/users/auther/${encodeURIComponent(uid)}@user=${encodeURIComponent(handle)}`
    : `/users/auther/@${encodeURIComponent(handle)}`;
};

const readPersistedAuthorCache = () => {
  if (typeof window === "undefined") return {} as Record<string, { name?: string; image?: string; bio?: string }>;

  try {
    const raw = localStorage.getItem(AUTHOR_CACHE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, { name?: string; image?: string; bio?: string }>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const persistAuthorCacheEntry = (userId: string, details: { name?: string; image?: string; bio?: string }) => {
  if (typeof window === "undefined") return;

  try {
    const current = readPersistedAuthorCache();
    current[userId] = details;
    localStorage.setItem(AUTHOR_CACHE_STORAGE_KEY, JSON.stringify(current));
  } catch {
    // ignore cache write issues
  }
};

const applyCachedAuthorDetails = (blogs: BlogItem[]) => {
  const persisted = readPersistedAuthorCache();

  return blogs.map((blog) => {
    const authorId = (blog.authorId || "").trim();
    if (!authorId) return blog;

    const details = authorDetailsCache.get(authorId) || persisted[authorId];
    if (!details) return blog;

    authorDetailsCache.set(authorId, details);

    return {
      ...blog,
      author: toAuthorDisplayName(details.name || blog.author),
      authorImage: details.image || blog.authorImage,
    };
  });
};

const parseTagsFromContent = (content: string) => {
  const tagLine = content
    .split("\n")
    .find((line) => line.trim().toLowerCase().startsWith("tags:"));

  if (!tagLine) return [];

  return tagLine
    .replace(/tags:/i, "")
    .split(",")
    .map((tag) => tag.trim().replace(/^#/, ""))
    .filter(Boolean)
    .slice(0, 10);
};

const isLikelyId = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return false;

  if (/^[0-9a-f]{24}$/i.test(trimmed)) return true;
  if (/^\d+$/.test(trimmed)) return true;
  if (/^[0-9a-f-]{30,}$/i.test(trimmed)) return true;
  if (trimmed.length > 20 && !trimmed.includes(" ")) return true;

  return false;
};

const toAuthorDisplayName = (value?: string) => {
  const raw = (value || "").trim();
  if (!raw || isLikelyId(raw)) return "Author";
  return raw;
};

const getAuthorId = (author?: RawBlog["author"]) => {
  if (!author) return "";
  if (typeof author === "string") return author;
  return String(author.id || author._id || "").trim();
};

const getAuthorName = (author?: RawBlog["author"]) => {
  if (!author) return "";
  if (typeof author === "string") return author;
  return String(author.name || "").trim();
};

const getAuthorImage = (author?: RawBlog["author"]) => {
  if (!author || typeof author === "string") return "";
  return String(author.image || "").trim();
};

const fetchUserById = async (userId: string) => {
  const normalizedUserId = userId.trim();
  if (!normalizedUserId) return null;

  if (authorDetailsCache.has(normalizedUserId)) {
    return authorDetailsCache.get(normalizedUserId) || null;
  }

  const persisted = readPersistedAuthorCache()[normalizedUserId];
  if (persisted) {
    authorDetailsCache.set(normalizedUserId, persisted);
    return persisted;
  }

  const response = await secureApiFetch<UserDetailsResponse>(
    `${USER_API_BASE}/getUserDetails/${encodeURIComponent(normalizedUserId)}`,
    { method: "GET" }
  );

  if (!response.ok || !response.data?.data) {
    return null;
  }

  const details = {
    name: response.data.data.name,
    image: response.data.data.image,
    bio: response.data.data.bio,
  };

  authorDetailsCache.set(normalizedUserId, details);
  persistAuthorCacheEntry(normalizedUserId, details);
  return details;
};

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  try {
    return await Promise.race<T>([
      promise,
      new Promise<T>((resolve) => {
        timer = setTimeout(() => resolve(fallback), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

export const fetchUserProfileById = async (userId: string) => {
  const response = await secureApiFetch<UserDetailsResponse>(
    `${USER_API_BASE}/getUserDetails/${encodeURIComponent(userId.trim())}`,
    { method: "GET" }
  );

  if (!response.ok || !response.data?.data || !response.data.data._id) {
    return {
      ok: false,
      user: null as PublicUserProfile | null,
      message: response.message,
    };
  }

  const data = response.data.data as PublicUserProfile;

  return {
    ok: true,
    user: {
      _id: String(data._id),
      name: data.name || "Author",
      email: data.email,
      image: data.image,
      bio: data.bio,
      instagram: data.instagram,
      facebook: data.facebook,
      linkedin: data.linkedin,
    },
    message: "OK",
  };
};

export const mapRawBlogToItem = (raw: RawBlog): BlogItem => {
  const content = raw.blog_content || "";
  const dateMeta = toDateText(raw.created_at);
  const likes = Number(raw.likes ?? 0);
  const comments = Number(raw.comments ?? 0);
  const views = Number(raw.views ?? 0);
  const authorId = getAuthorId(raw.author);
  const authorName = getAuthorName(raw.author);
  const authorImage = getAuthorImage(raw.author);

  return {
    id: String(raw.id),
    slug: raw.slug || toSlug(raw.title || String(raw.id)),
    authorId: authorId || undefined,
    title: raw.title || "Untitled",
    excerpt: raw.description || "No description available.",
    author: toAuthorDisplayName(authorName || authorId),
    authorImage: authorImage || "/images/author.avif",
    coverImage: raw.image_url || "/images/bg.avif",
    publishedAt: dateMeta.publishedAt,
    publishedOn: dateMeta.publishedOn,
    readMinutes: getReadMinutes(content, raw.description),
    category: raw.category || "General",
    likes: Number.isFinite(likes) ? likes : 0,
    comments: Number.isFinite(comments) ? comments : 0,
    views: Number.isFinite(views) ? views : 0,
  };
};

const extractAuthor = (author?: AuthorPayload) => {
  const root = author || {};
  const nested = root.data || root.user || {};

  return {
    name: toAuthorDisplayName(nested.name || root.name),
    image: nested.image || root.image || "/images/author.avif",
    bio: nested.bio || root.bio || "",
  };
};

const hydrateBlogsWithAuthorDetails = async (blogs: BlogItem[]) => {
  const authorIds = Array.from(
    new Set(
      blogs
        .map((blog) => blog.authorId || "")
        .map((id) => id.trim())
        .filter(Boolean)
    )
  );

  if (authorIds.length === 0) return blogs;

  const authorEntries = await Promise.all(
    authorIds.map(async (authorId) => {
      const details = await fetchUserById(authorId);
      return [authorId, details] as const;
    })
  );

  const authorById = new Map(authorEntries);

  return blogs.map((blog) => {
    const authorId = (blog.authorId || "").trim();
    if (!authorId) return blog;

    const details = authorById.get(authorId);
    if (!details) return blog;

    return {
      ...blog,
      author: toAuthorDisplayName(details.name || blog.author),
      authorImage: details.image || blog.authorImage,
    };
  });
};

export const fetchAllBlogs = async () => {
  const response = await secureApiFetch<AllBlogsResponse>(`${BLOG_READ_API}/all-blogs`, {
    method: "GET",
  });

  if (!response.ok) {
    return {
      ok: false,
      blogs: [] as BlogItem[],
      message: response.message,
    };
  }

  const mappedBlogs = (response.data?.blogs || []).map(mapRawBlogToItem);
  const blogs = applyCachedAuthorDetails(mappedBlogs);

  void withTimeout(hydrateBlogsWithAuthorDetails(mappedBlogs), 800, mappedBlogs);

  return {
    ok: true,
    blogs,
    message: "OK",
  };
};

export const fetchBlogBySlug = async (slug: string) => {
  const response = await secureApiFetch<BlogByIdResponse>(`${BLOG_READ_API}/get/${encodeURIComponent(slug)}`, {
    method: "GET",
  });

  if (!response.ok || !response.data?.blog) {
    return {
      ok: false,
      blog: null as BlogDetail | null,
      message: response.message,
    };
  }

  const raw = response.data.blog;
  const item = mapRawBlogToItem(raw);
  const author = extractAuthor(response.data.author);
  const fallbackAuthorDetails = item.authorId ? await fetchUserById(item.authorId) : null;

  const detail: BlogDetail = {
    ...item,
    author: toAuthorDisplayName(author.name || fallbackAuthorDetails?.name || item.author),
    authorImage: author.image || fallbackAuthorDetails?.image || item.authorImage,
    authorBio: author.bio || fallbackAuthorDetails?.bio || "",
    content: raw.blog_content || "No content available for this blog.",
    tags: parseTagsFromContent(raw.blog_content || ""),
  };

  return {
    ok: true,
    blog: detail,
    message: "OK",
  };
};

export const fetchBlogById = fetchBlogBySlug;

export const getAuthorBlogApi = () => getAuthorBlogApiBase();

export type BlogCommentItem = {
  id: string;
  author: string;
  text: string;
  createdAtLabel: string;
};

const toRelativeTime = (value?: string) => {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

const mapComment = (raw: CommentPayload): BlogCommentItem => ({
  id: String(raw.id),
  author: toAuthorDisplayName(raw.username),
  text: raw.comment || "",
  createdAtLabel: toRelativeTime(raw.created_at),
});

export const fetchCommentsByBlogId = async (blogId: string) => {
  const response = await secureApiFetch<CommentsResponse>(`${getAuthorBlogApiBase()}/comment/${blogId}`, {
    method: "GET",
  });

  if (!response.ok) {
    return {
      ok: false,
      comments: [] as BlogCommentItem[],
      message: response.message,
    };
  }

  return {
    ok: true,
    comments: (response.data?.comments || []).map(mapComment),
    message: "OK",
  };
};

export const addCommentToBlog = async (blogId: string, comment: string, username?: string) => {
  const response = await secureApiFetch<AddCommentResponse>(`${getAuthorBlogApiBase()}/comment/${blogId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment, username }),
  });

  if (!response.ok || !response.data?.comment) {
    return {
      ok: false,
      comment: null as BlogCommentItem | null,
      commentsCount: 0,
      message: response.message,
    };
  }

  return {
    ok: true,
    comment: mapComment(response.data.comment),
    commentsCount: response.data.comments || 0,
    message: "OK",
  };
};

export const fetchLikeStatus = async (blogId: string) => {
  const response = await secureApiFetch<LikeStatusResponse>(`${getAuthorBlogApiBase()}/like/${blogId}/status`, {
    method: "GET",
  });

  if (!response.ok) {
    return {
      ok: false,
      liked: false,
      message: response.message,
    };
  }

  return {
    ok: true,
    liked: Boolean(response.data?.liked),
    message: "OK",
  };
};

export const toggleBlogLike = async (blogId: string) => {
  const response = await secureApiFetch<LikeToggleResponse>(`${getAuthorBlogApiBase()}/like/${blogId}`, {
    method: "POST",
  });

  if (!response.ok) {
    return {
      ok: false,
      liked: false,
      likes: 0,
      message: response.message,
    };
  }

  return {
    ok: true,
    liked: Boolean(response.data?.liked),
    likes: Number(response.data?.likes || 0),
    message: "OK",
  };
};

export const deleteBlogById = async (blogId: string) => {
  const response = await secureApiFetch<DeleteBlogResponse>(`${getAuthorBlogApiBase()}/delete/${encodeURIComponent(blogId)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    return {
      ok: false,
      message: response.message,
    };
  }

  return {
    ok: true,
    message: response.data?.message || "Blog deleted successfully",
  };
};

export type SearchSuggestion = {
  slug: string;
  title: string;
  category: string;
};

type SearchSuggestionsResponse = {
  success?: boolean;
  suggestions?: SearchSuggestion[];
  message?: string;
};

export const fetchSearchSuggestions = async (query: string): Promise<SearchSuggestion[]> => {
  if (!query || query.trim().length < 2) return [];

  const response = await secureApiFetch<SearchSuggestionsResponse>(
    `${BLOG_READ_API}/search-suggestions?q=${encodeURIComponent(query.trim())}`,
    { method: "GET" }
  );

  if (!response.ok || !response.data?.suggestions) return [];
  return response.data.suggestions;
};

type RelatedBlogsResponse = {
  success?: boolean;
  blogs?: RawBlog[];
  message?: string;
};

export const fetchRelatedBlogs = async (blogId: string): Promise<BlogItem[]> => {
  if (!blogId) return [];

  const response = await secureApiFetch<RelatedBlogsResponse>(
    `${BLOG_READ_API}/related/${encodeURIComponent(blogId)}`,
    { method: "GET" }
  );

  if (!response.ok || !response.data?.blogs) return [];

  const mapped = response.data.blogs.map(mapRawBlogToItem);
  return applyCachedAuthorDetails(mapped);
};
