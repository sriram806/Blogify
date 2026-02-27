import { BlogDraft } from "./write.types";

export const STORAGE_KEY = "blogify:author-editor-draft";
export const LOCAL_DRAFTS_KEY = "blogify:author-editor-local-drafts";

export const MAX_IMAGE_SIZE_MB = 5;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export const DEFAULT_DRAFT: BlogDraft = {
  title: "",
  subtitle: "",
  excerpt: "",
  category: "Technology",
  content: "",
  coverImageUrl: "",
  coverImageDataUrl: "",
  tags: [],
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  status: "draft",
  visibility: "public",
  scheduledAt: "",
  allowComments: true,
  featured: false,
};

export const CATEGORIES = [
  "Technology",
  "Programming",
  "Design",
  "Productivity",
  "Business",
  "Career",
  "Lifestyle",
];
