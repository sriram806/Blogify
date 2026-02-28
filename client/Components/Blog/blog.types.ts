export type BlogSortBy =
  | "latest"
  | "oldest"
  | "most-liked"
  | "most-commented"
  | "most-viewed"
  | "shortest-read"
  | "longest-read";

export type BlogDateRange = "all" | "24h" | "7d" | "30d" | "90d";

export type BlogItem = {
  id: string;
  slug?: string;
  authorId?: string;
  title: string;
  excerpt: string;
  author: string;
  authorImage?: string;
  coverImage: string;
  publishedAt: string;
  publishedOn: string;
  readMinutes: number;
  category: string;
  likes: number;
  comments: number;
  views: number;
};

export type BlogDetail = BlogItem & {
  content: string;
  authorBio?: string;
  tags: string[];
};

export type BlogFilterState = {
  search: string;
  category: string;
  author: string;
  maxReadMinutes: number;
  minLikes: number;
  dateRange: BlogDateRange;
  sortBy: BlogSortBy;
};