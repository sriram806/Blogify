export type EditorTab = "edit" | "preview" | "split";
export type PublishStatus = "draft" | "review" | "published" | "scheduled";
export type Visibility = "public" | "members" | "private";

export type BlogDraft = {
  title: string;
  subtitle: string;
  excerpt: string;
  category: string;
  content: string;
  coverImageUrl: string;
  coverImageDataUrl?: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  status: PublishStatus;
  visibility: Visibility;
  scheduledAt: string;
  allowComments: boolean;
  featured: boolean;
};

export type RemoteDraft = {
  id: number;
  title: string;
  description: string;
  blog_content: string;
  category: string;
  updated_at: string;
  metadata?: {
    subtitle?: string;
    coverImageUrl?: string;
    tags?: string[];
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string;
    status?: PublishStatus;
    visibility?: Visibility;
    scheduledAt?: string;
    allowComments?: boolean;
    featured?: boolean;
  };
};

export type LocalDraftRecord = {
  id: string;
  title: string;
  savedAt: string;
  draft: BlogDraft;
};

export type DraftListResponse = { drafts?: RemoteDraft[]; message?: string };
export type DraftSaveResponse = { draft?: { id?: number }; message?: string };
export type PublishResponse = { blog?: { id?: number }; message?: string };
