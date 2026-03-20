"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/Components/Auth/AuthProvider";
import Loading from "@/Components/Utils/Loading";
import { NotAuthenticated } from "@/Components/Utils/NotAuthenticated";
import { getAuthorBlogApiBase, secureApiFetch } from "@/lib/api";
import { fetchBlogBySlug } from "@/Components/Blog/blog.api";
import DraftsPanel from "@/Components/Write/DraftsPanel";
import EditorSection from "@/Components/Write/EditorSection";
import SettingsSidebar from "@/Components/Write/SettingsSidebar";
import WriteTopBar from "@/Components/Write/WriteTopBar";
import {
  ALLOWED_IMAGE_TYPES,
  CATEGORIES,
  DEFAULT_DRAFT,
  MAX_IMAGE_SIZE_MB,
  STORAGE_KEY,
} from "@/Components/Write/write.constants";
import {
  BlogDraft,
  ContentImageUploadResponse,
  DraftListResponse,
  DraftSaveResponse,
  PublishResponse,
  RemoteDraft,
} from "@/Components/Write/write.types";
import {
  composeBlogContentWithMetadata,
  fileToDataUrl,
  getReadMinutes,
  getWordCount,
  parseBlogContentMetadata,
  sanitizeFreeText,
  validateImageFile,
} from "@/Components/Write/write.utils";

const AUTHOR_BLOG_API = getAuthorBlogApiBase();

type ToastState = {
  message: string;
  visible: boolean;
};

const BlogWritePage = () => {
  const [editIdParam, setEditIdParam] = useState("");
  const { user, loading } = useAuth();
  const [draft, setDraft] = useState<BlogDraft>(DEFAULT_DRAFT);
  const [remoteDrafts, setRemoteDrafts] = useState<RemoteDraft[]>([]);
  const [activeRemoteDraftId, setActiveRemoteDraftId] = useState<number | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [hasLoadedSavedDraft, setHasLoadedSavedDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isUploadingContentImages, setIsUploadingContentImages] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string>("");
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({ message: "", visible: false });
  const contentImagesRef = useRef<HTMLInputElement | null>(null);
  const hasLoadedEditDraftRef = useRef(false);

  const wordCount = useMemo(() => getWordCount(draft.content), [draft.content]);
  const readMinutes = useMemo(() => getReadMinutes(wordCount), [wordCount]);
  const titleLength = draft.title.trim().length;
  const excerptLength = draft.excerpt.trim().length;

  const derivedSlug = useMemo(
    () =>
      draft.title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 80),
    [draft.title]
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as BlogDraft;
      setDraft({ ...DEFAULT_DRAFT, ...parsed });
      setCoverPreview(parsed.coverImageDataUrl || parsed.coverImageUrl || "");
      setHasLoadedSavedDraft(true);
      setStatusMessage("Recovered your previous local draft.");
    } catch {
      setStatusMessage("Unable to recover saved draft.");
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setLastSavedAt(new Date().toLocaleTimeString());
    }, 900);

    return () => clearTimeout(timeout);
  }, [draft]);

  useEffect(() => {
    if (!coverImageFile) return;

    const objectUrl = URL.createObjectURL(coverImageFile);
    setCoverPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [coverImageFile]);

  useEffect(() => {
    if (!toast.visible) return;
    const timeout = setTimeout(() => {
      setToast({ message: "", visible: false });
    }, 2800);
    return () => clearTimeout(timeout);
  }, [toast.visible]);

  useEffect(() => {
    if (!user) return;

    const fetchRemoteDrafts = async () => {
      const response = await secureApiFetch<DraftListResponse>(`${AUTHOR_BLOG_API}/draft/my`, {
        method: "GET",
      });

      if (!response.ok) {
        setRemoteDrafts([]);
        return;
      }

      setRemoteDrafts(response.data?.drafts || []);
    };

    fetchRemoteDrafts();
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const query = new URLSearchParams(window.location.search);
    setEditIdParam((query.get("editId") || "").trim());
  }, []);

  useEffect(() => {
    if (!user?._id || !editIdParam || hasLoadedEditDraftRef.current) return;

    const loadForEdit = async () => {
      const response = await fetchBlogBySlug(editIdParam);

      if (!response.ok || !response.blog) {
        setStatusMessage(response.message || "Unable to load blog for editing.");
        return;
      }

      if (String(response.blog.authorId || "") !== String(user._id)) {
        setStatusMessage("Only the author who created this blog can edit it.");
        return;
      }

      hasLoadedEditDraftRef.current = true;
      const parsedContent = parseBlogContentMetadata(response.blog?.content || "");
      setEditingBlogId(response.blog.id);
      setDraft((prev) => ({
        ...prev,
        title: response.blog?.title || "",
        subtitle: prev.subtitle,
        excerpt: response.blog?.excerpt || "",
        category: response.blog?.category || "Technology",
        content: parsedContent.content,
        coverImageUrl: response.blog?.coverImage || "",
        coverImageDataUrl: "",
        tags: response.blog?.tags?.length ? response.blog.tags : parsedContent.tags,
        visibility: parsedContent.visibility,
        allowComments: parsedContent.allowComments,
      }));
      setCoverImageFile(null);
      setCoverPreview(response.blog.coverImage || "");
      setStatusMessage("Editing mode enabled for your blog.");
    };

    loadForEdit();
  }, [editIdParam, user?._id]);

  const updateDraft = <K extends keyof BlogDraft>(key: K, value: BlogDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const resetEditorForm = () => {
    setDraft(DEFAULT_DRAFT);
    setTagInput("");
    setCoverPreview("");
    setCoverImageFile(null);
    setActiveRemoteDraftId(null);
    setLastSavedAt("");
    localStorage.removeItem(STORAGE_KEY);
  };

  const addTag = (value: string) => {
    const cleanTag = value.trim().toLowerCase();
    if (!cleanTag || draft.tags.includes(cleanTag)) return;
    if (draft.tags.length >= 8) {
      setStatusMessage("You can add up to 8 tags per blog.");
      return;
    }
    updateDraft("tags", [...draft.tags, cleanTag]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    updateDraft(
      "tags",
      draft.tags.filter((item) => item !== tag)
    );
  };

  const handleCoverFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) {
      setCoverImageFile(null);
      return;
    }

    const imageError = validateImageFile(file);
    if (imageError) {
      setStatusMessage(imageError);
      event.target.value = "";
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setCoverImageFile(file);
      setCoverPreview(dataUrl);
      updateDraft("coverImageUrl", "");
      updateDraft("coverImageDataUrl", dataUrl);
      setStatusMessage("Cover image selected and saved in local draft storage.");
    } catch {
      setStatusMessage("Unable to read selected image file.");
    }
  };

  const handleCoverUrlChange = (value: string) => {
    updateDraft("coverImageUrl", value);
    updateDraft("coverImageDataUrl", "");
    setCoverImageFile(null);
    setCoverPreview(value);
  };

  const insertAtCursor = (value: string) => {
    const separator = draft.content && !draft.content.endsWith("\n") ? "\n" : "";
    updateDraft("content", `${draft.content}${separator}${value}`);
  };

  const uploadContentImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const validFiles = files.filter((file) => !validateImageFile(file));
    if (!validFiles.length) {
      setStatusMessage("No valid images selected. Use jpg/png/webp/avif under size limit.");
      event.target.value = "";
      return;
    }

    try {
      setIsUploadingContentImages(true);
      const formData = new FormData();
      validFiles.forEach((file) => formData.append("files", file));

      const response = await secureApiFetch<ContentImageUploadResponse>(`${AUTHOR_BLOG_API}/content-images/upload`, {
        method: "POST",
        body: formData,
        timeoutMs: 30000,
      });

      if (!response.ok) {
        setStatusMessage(response.message || "Unable to upload content images.");
        return;
      }

      const urls = response.data?.images || [];
      if (!urls.length) {
        setStatusMessage("No image URLs returned from upload.");
        return;
      }

      const markdown = urls.map((url) => `\n![content image](${url})\n`).join("\n");
      insertAtCursor(markdown);
      setStatusMessage(`${urls.length} image(s) uploaded and inserted into content.`);
    } catch {
      setStatusMessage("Failed to upload content images.");
    } finally {
      setIsUploadingContentImages(false);
      event.target.value = "";
    }
  };

  const loadRemoteDrafts = useCallback(async () => {
    const response = await secureApiFetch<DraftListResponse>(`${AUTHOR_BLOG_API}/draft/my`, {
      method: "GET",
    });

    if (!response.ok) {
      setStatusMessage(response.message || "Unable to load server drafts.");
      return;
    }

    setRemoteDrafts(response.data?.drafts || []);
    setStatusMessage("Server drafts loaded.");
  }, []);

  const saveDraft = useCallback(async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    setLastSavedAt(new Date().toLocaleTimeString());

    try {
      setIsSavingDraft(true);
      const payload = {
        id: activeRemoteDraftId || undefined,
        title: sanitizeFreeText(draft.title).slice(0, 120),
        description: sanitizeFreeText(draft.excerpt).slice(0, 255),
        blog_content: draft.content,
        category: CATEGORIES.includes(draft.category) ? draft.category : "Technology",
        metadata: {
          subtitle: sanitizeFreeText(draft.subtitle).slice(0, 160),
          coverImageUrl: sanitizeFreeText(draft.coverImageUrl),
          tags: draft.tags,
          seoTitle: sanitizeFreeText(draft.seoTitle).slice(0, 120),
          seoDescription: sanitizeFreeText(draft.seoDescription).slice(0, 255),
          seoKeywords: sanitizeFreeText(draft.seoKeywords).slice(0, 255),
          status: draft.status,
          visibility: draft.visibility,
          scheduledAt: draft.scheduledAt,
          allowComments: draft.allowComments,
          featured: draft.featured,
        },
      };

      const response = await secureApiFetch<DraftSaveResponse>(`${AUTHOR_BLOG_API}/draft/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setStatusMessage(response.message || "Local draft saved, server draft save failed.");
        return;
      }

      if (response.data?.draft?.id) {
        setActiveRemoteDraftId(response.data.draft.id);
      }

      await loadRemoteDrafts();
      setStatusMessage("Draft saved locally and on server.");
    } catch {
      setStatusMessage("Draft saved locally. Could not save on server.");
    } finally {
      setIsSavingDraft(false);
    }
  }, [activeRemoteDraftId, draft, loadRemoteDrafts]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        saveDraft();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [saveDraft]);

  const applyRemoteDraft = (remoteDraft: RemoteDraft) => {
    const parsedContent = parseBlogContentMetadata(remoteDraft.blog_content || "");
    setDraft({
      title: remoteDraft.title || "",
      subtitle: remoteDraft.metadata?.subtitle || "",
      excerpt: remoteDraft.description || "",
      category: remoteDraft.category || "Technology",
      content: parsedContent.content,
      coverImageUrl: remoteDraft.metadata?.coverImageUrl || "",
      coverImageDataUrl: "",
      tags: remoteDraft.metadata?.tags?.length ? remoteDraft.metadata.tags : parsedContent.tags,
      seoTitle: remoteDraft.metadata?.seoTitle || "",
      seoDescription: remoteDraft.metadata?.seoDescription || "",
      seoKeywords: remoteDraft.metadata?.seoKeywords || "",
      status: remoteDraft.metadata?.status || "draft",
      visibility: remoteDraft.metadata?.visibility || parsedContent.visibility,
      scheduledAt: remoteDraft.metadata?.scheduledAt || "",
      allowComments: remoteDraft.metadata?.allowComments ?? parsedContent.allowComments,
      featured: remoteDraft.metadata?.featured ?? false,
    });

    setCoverPreview(remoteDraft.metadata?.coverImageUrl || "");
    setCoverImageFile(null);
    setActiveRemoteDraftId(remoteDraft.id);
    setStatusMessage(`Loaded server draft #${remoteDraft.id}.`);
  };

  const deleteRemoteDraft = async () => {
    if (!activeRemoteDraftId) {
      setStatusMessage("Load a server draft first to delete it.");
      return;
    }

    try {
      const response = await secureApiFetch<{ message?: string }>(
        `${AUTHOR_BLOG_API}/draft/${activeRemoteDraftId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        setStatusMessage(response.message || "Unable to delete server draft.");
        return;
      }

      setRemoteDrafts((prev) => prev.filter((item) => item.id !== activeRemoteDraftId));
      setActiveRemoteDraftId(null);
      setStatusMessage("Server draft deleted.");
    } catch {
      setStatusMessage("Unable to connect to author service.");
    }
  };

  const validateBeforePublish = () => {
    if (titleLength < 10) return "Title must be at least 10 characters.";
    if (excerptLength < 30) return "Excerpt must be at least 30 characters.";
    if (excerptLength > 255) return "Excerpt must be 255 characters or less.";
    if (wordCount < 80) return "Content is too short. Add more depth before publishing.";
    if (draft.tags.length === 0) return "Add at least one tag to improve discoverability.";
    if (draft.status === "scheduled" && !draft.scheduledAt) {
      return "Pick a schedule date and time for scheduled publishing.";
    }
    if (!coverImageFile && !draft.coverImageUrl.trim() && !coverPreview.trim()) {
      return "Upload a cover image file or provide a valid image URL.";
    }
    return "";
  };

  const resolveCoverFile = async () => {
    if (coverImageFile) {
      const maxSizeBytes = MAX_IMAGE_SIZE_MB * 1024 * 1024;
      if (!ALLOWED_IMAGE_TYPES.includes(coverImageFile.type)) {
        throw new Error("Unsupported image type. Use jpg/png/webp/avif.");
      }
      if (coverImageFile.size > maxSizeBytes) {
        throw new Error(`Image too large. Max ${MAX_IMAGE_SIZE_MB}MB.`);
      }
      return coverImageFile;
    }

    if (draft.coverImageDataUrl?.trim()) {
      const response = await fetch(draft.coverImageDataUrl, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Unable to read local draft image data.");

      const imageBlob = await response.blob();
      const maxSizeBytes = MAX_IMAGE_SIZE_MB * 1024 * 1024;
      if (imageBlob.size > maxSizeBytes) {
        throw new Error(`Image too large. Max ${MAX_IMAGE_SIZE_MB}MB.`);
      }

      return new File([imageBlob], `cover-${Date.now()}.jpg`, {
        type: imageBlob.type || "image/jpeg",
      });
    }

    if (draft.coverImageUrl.trim()) {
      const urlValue = draft.coverImageUrl.trim();
      const parsed = new URL(urlValue);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Only http/https image URLs are allowed.");
      }

      let response: Response;
      try {
        response = await fetch(urlValue, {
          cache: "no-store",
          referrerPolicy: "no-referrer",
        });
      } catch {
        throw new Error("Could not access cover image URL due to network/CORS. Upload image file instead.");
      }
      if (!response.ok) throw new Error("Unable to fetch cover image from URL. Upload image file instead.");

      const imageBlob = await response.blob();
      const maxSizeBytes = MAX_IMAGE_SIZE_MB * 1024 * 1024;
      if (imageBlob.size > maxSizeBytes) {
        throw new Error(`Image too large. Max ${MAX_IMAGE_SIZE_MB}MB.`);
      }

      return new File([imageBlob], `cover-${Date.now()}.jpg`, {
        type: imageBlob.type || "image/jpeg",
      });
    }

    return null;
  };

  const publishPost = async () => {
    const error = validateBeforePublish();
    if (error) {
      setStatusMessage(error);
      return;
    }

    setIsPublishing(true);
    setStatusMessage("Publishing in progress...");

    try {
      const shouldResolveCover = !editingBlogId || Boolean(coverImageFile || (draft.coverImageDataUrl || "").trim());
      const imageFile = shouldResolveCover ? await resolveCoverFile() : null;

      if (!editingBlogId && !imageFile) {
        setStatusMessage("Cover image is required for publishing.");
        return;
      }

      const description = draft.excerpt.trim() || draft.subtitle.trim() || draft.title.trim();
      const contentWithMeta = composeBlogContentWithMetadata(draft.content, {
        tags: draft.tags,
        visibility: draft.visibility,
        allowComments: draft.allowComments,
      });

      const formData = new FormData();
      formData.append("title", draft.title.trim());
      formData.append("description", description.slice(0, 255));
      formData.append("blog_content", contentWithMeta);
      formData.append("category", draft.category);
      if (imageFile) {
        formData.append("file", imageFile);
      }

      const endpoint = editingBlogId
        ? `${AUTHOR_BLOG_API}/update/${encodeURIComponent(editingBlogId)}`
        : `${AUTHOR_BLOG_API}/create`;

      const response = await secureApiFetch<PublishResponse>(endpoint, {
        method: editingBlogId ? "PUT" : "POST",
        body: formData,
      });

      if (!response.ok) {
        setStatusMessage(
          response.status === 401
            ? "Session expired or unauthorized. Please login again and retry."
            : response.message || "Publish failed. Please check auth/session and try again."
        );
        return;
      }

      if (editingBlogId) {
        setStatusMessage("Blog updated successfully.");
        setToast({ message: "Blog updated successfully.", visible: true });
        resetEditorForm();
        setEditingBlogId(null);
      } else {
        setStatusMessage(`Blog published successfully (id: ${response.data?.blog?.id ?? "new"}).`);
        setToast({ message: "Blog published successfully.", visible: true });
        resetEditorForm();
        await loadRemoteDrafts();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected publish error.";
      setStatusMessage(`Publish failed: ${message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  if (loading) return <Loading name="Preparing your writing studio" />;
  if (!user) return <NotAuthenticated />;

  return (
    <main className="min-h-screen bg-gray-50">
      {toast.visible && (
        <div className="fixed right-4 top-20 z-50 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast.message}
        </div>
      )}
      <section className="mx-auto w-full max-w-350 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="sticky top-16 z-20 mb-6 rounded-2xl border border-gray-200 bg-white/95 p-4 sm:p-5 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Draft</p>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mt-1">
                {editingBlogId ? "Edit your blog" : "Write your next blog"}
              </h1>
              <p className="text-xs text-gray-500 mt-1">Clean writing space inspired by Medium.</p>
            </div>

            <WriteTopBar
              isSavingDraft={isSavingDraft}
              isPublishing={isPublishing}
              onSaveDraft={saveDraft}
              onPublish={publishPost}
            />
          </div>
        </div>

        <input
          ref={contentImagesRef}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          multiple
          onChange={uploadContentImages}
          className="hidden"
        />

        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span className="rounded-full bg-gray-100 px-3 py-1">Words: {wordCount}</span>
          <span className="rounded-full bg-gray-100 px-3 py-1">Read time: {readMinutes} min</span>
          <span className="rounded-full bg-gray-100 px-3 py-1">Slug: /blog/{derivedSlug || "your-title"}</span>
          {lastSavedAt && <span>Auto-saved at {lastSavedAt}</span>}
          <span>Shortcut: Ctrl/Cmd + S</span>
        </div>

        {statusMessage && (
          <div className="mb-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
            {statusMessage}
          </div>
        )}

        {hasLoadedSavedDraft && (
          <p className="mb-4 text-xs text-gray-500">Existing local draft was loaded. Continue writing or reset if needed.</p>
        )}

        <DraftsPanel
          remoteDrafts={remoteDrafts}
          activeRemoteDraftId={activeRemoteDraftId}
          onRefreshRemote={loadRemoteDrafts}
          onDeleteRemote={deleteRemoteDraft}
          onApplyRemote={applyRemoteDraft}
        />

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] xl:justify-center gap-8 items-start">
          <div className="xl:pr-2">
            <EditorSection
              title={draft.title}
              subtitle={draft.subtitle}
              excerpt={draft.excerpt}
              titleLength={titleLength}
              excerptLength={excerptLength}
              content={draft.content}
              onChangeTitle={(value) => updateDraft("title", value)}
              onChangeSubtitle={(value) => updateDraft("subtitle", value)}
              onChangeExcerpt={(value) => updateDraft("excerpt", value)}
              onChangeContent={(value) => updateDraft("content", value)}
              onUploadImages={() => contentImagesRef.current?.click()}
              isUploadingImages={isUploadingContentImages}
            />
          </div>

          <div>
            <SettingsSidebar
              draft={draft}
              tagInput={tagInput}
              coverPreview={coverPreview}
              onChangeCategory={(value) => updateDraft("category", value)}
              onTagInput={setTagInput}
              onTagKeyDown={(event) => {
                if (event.key === "Enter" || event.key === ",") {
                  event.preventDefault();
                  addTag(tagInput);
                }
              }}
              onAddTag={() => addTag(tagInput)}
              onRemoveTag={removeTag}
              onCoverFile={handleCoverFileChange}
              onCoverUrl={handleCoverUrlChange}
              onStatus={(value) => updateDraft("status", value)}
              onScheduledAt={(value) => updateDraft("scheduledAt", value)}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogWritePage;
