"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/Components/Auth/AuthProvider";
import Loading from "@/Components/Utils/Loading";
import { NotAuthenticated } from "@/Components/Utils/NotAuthenticated";
import { getAuthorBlogApiBase, secureApiFetch } from "@/lib/api";
import DraftsPanel from "@/Components/Write/DraftsPanel";
import EditorSection from "@/Components/Write/EditorSection";
import SettingsSidebar from "@/Components/Write/SettingsSidebar";
import WriteTopBar from "@/Components/Write/WriteTopBar";
import {
  ALLOWED_IMAGE_TYPES,
  CATEGORIES,
  DEFAULT_DRAFT,
  LOCAL_DRAFTS_KEY,
  MAX_IMAGE_SIZE_MB,
  STORAGE_KEY,
} from "@/Components/Write/write.constants";
import {
  BlogDraft,
  DraftListResponse,
  DraftSaveResponse,
  EditorTab,
  LocalDraftRecord,
  PublishResponse,
  RemoteDraft,
} from "@/Components/Write/write.types";
import { fileToDataUrl, getReadMinutes, getWordCount, sanitizeFreeText, validateImageFile } from "@/Components/Write/write.utils";

const AUTHOR_BLOG_API = getAuthorBlogApiBase();

const BlogWritePage = () => {
  const { user, loading } = useAuth();
  const [draft, setDraft] = useState<BlogDraft>(DEFAULT_DRAFT);
  const [localDrafts, setLocalDrafts] = useState<LocalDraftRecord[]>([]);
  const [remoteDrafts, setRemoteDrafts] = useState<RemoteDraft[]>([]);
  const [activeRemoteDraftId, setActiveRemoteDraftId] = useState<number | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [editorTab, setEditorTab] = useState<EditorTab>("split");
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [hasLoadedSavedDraft, setHasLoadedSavedDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const importFileRef = useRef<HTMLInputElement | null>(null);

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

    try {
      const savedLocalDrafts = localStorage.getItem(LOCAL_DRAFTS_KEY);
      if (!savedLocalDrafts) return;
      const parsedLocalDrafts = JSON.parse(savedLocalDrafts) as LocalDraftRecord[];
      setLocalDrafts(parsedLocalDrafts);
    } catch {
      setLocalDrafts([]);
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

  const updateDraft = <K extends keyof BlogDraft>(key: K, value: BlogDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
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

  const insertSnippet = (before: string, after = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = draft.content.slice(start, end);
    const text = `${before}${selectedText || "text"}${after}`;
    const newContent = draft.content.slice(0, start) + text + draft.content.slice(end);

    updateDraft("content", newContent);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + text.length;
      textarea.setSelectionRange(cursor, cursor);
    });
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

  const clearDraft = () => {
    setDraft(DEFAULT_DRAFT);
    setTagInput("");
    setCoverPreview("");
    setCoverImageFile(null);
    setActiveRemoteDraftId(null);
    setStatusMessage("Draft reset. Start writing a fresh post.");
  };

  const saveToLocalDrafts = () => {
    const localEntry: LocalDraftRecord = {
      id: `${Date.now()}`,
      title: sanitizeFreeText(draft.title) || "Untitled",
      savedAt: new Date().toISOString(),
      draft: { ...draft },
    };

    const nextDrafts = [localEntry, ...localDrafts].slice(0, 12);
    setLocalDrafts(nextDrafts);
    localStorage.setItem(LOCAL_DRAFTS_KEY, JSON.stringify(nextDrafts));
    setStatusMessage("Draft saved to local storage list.");
  };

  const loadFromLocalDrafts = (localDraft: LocalDraftRecord) => {
    setDraft(localDraft.draft);
    setCoverPreview(localDraft.draft.coverImageDataUrl || localDraft.draft.coverImageUrl || "");
    setCoverImageFile(null);
    setStatusMessage(`Loaded local draft: ${localDraft.title}`);
  };

  const deleteFromLocalDrafts = (id: string) => {
    const nextDrafts = localDrafts.filter((item) => item.id !== id);
    setLocalDrafts(nextDrafts);
    localStorage.setItem(LOCAL_DRAFTS_KEY, JSON.stringify(nextDrafts));
    setStatusMessage("Removed local draft from storage list.");
  };

  const downloadDraft = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `blog-draft-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setStatusMessage("Draft exported as JSON.");
  };

  const importDraft = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Partial<BlogDraft>;
      const merged = { ...DEFAULT_DRAFT, ...parsed };
      setDraft(merged);
      setCoverPreview(merged.coverImageUrl || "");
      setCoverImageFile(null);
      setStatusMessage("Draft imported successfully.");
    } catch {
      setStatusMessage("Invalid draft file. Please import a valid JSON draft.");
    } finally {
      event.target.value = "";
    }
  };

  const applyRemoteDraft = (remoteDraft: RemoteDraft) => {
    setDraft({
      title: remoteDraft.title || "",
      subtitle: remoteDraft.metadata?.subtitle || "",
      excerpt: remoteDraft.description || "",
      category: remoteDraft.category || "Technology",
      content: remoteDraft.blog_content || "",
      coverImageUrl: remoteDraft.metadata?.coverImageUrl || "",
      coverImageDataUrl: "",
      tags: remoteDraft.metadata?.tags || [],
      seoTitle: remoteDraft.metadata?.seoTitle || "",
      seoDescription: remoteDraft.metadata?.seoDescription || "",
      seoKeywords: remoteDraft.metadata?.seoKeywords || "",
      status: remoteDraft.metadata?.status || "draft",
      visibility: remoteDraft.metadata?.visibility || "public",
      scheduledAt: remoteDraft.metadata?.scheduledAt || "",
      allowComments: remoteDraft.metadata?.allowComments ?? true,
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
    if (!coverImageFile && !draft.coverImageUrl.trim()) {
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
      const imageFile = await resolveCoverFile();
      if (!imageFile) {
        setStatusMessage("Cover image is required for publishing.");
        return;
      }

      const description = draft.excerpt.trim() || draft.subtitle.trim() || draft.title.trim();
      const contentWithMeta = `${draft.content}\n\n---\nTags: ${draft.tags.join(", ")}\nVisibility: ${draft.visibility}\nComments: ${draft.allowComments ? "enabled" : "disabled"}`;

      const formData = new FormData();
      formData.append("title", draft.title.trim());
      formData.append("description", description.slice(0, 255));
      formData.append("blog_content", contentWithMeta);
      formData.append("category", draft.category);
      formData.append("file", imageFile);

      const response = await secureApiFetch<PublishResponse>(`${AUTHOR_BLOG_API}/create`, {
        method: "POST",
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

      setStatusMessage(`Blog published successfully (id: ${response.data?.blog?.id ?? "new"}).`);
      setActiveRemoteDraftId(null);
      localStorage.removeItem(STORAGE_KEY);
      await loadRemoteDrafts();
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
      <section className="container mx-auto px-5 sm:px-6 md:px-8 py-8 sm:py-10">
        <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Author Studio</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">Write your next blog</h1>
              <p className="text-sm text-gray-600 mt-2">
                Connected to author service: publish blogs, save server drafts, and manage SEO-ready posts.
              </p>
            </div>

            <WriteTopBar
              isSavingDraft={isSavingDraft}
              isPublishing={isPublishing}
              onSaveDraft={saveDraft}
              onSaveLocalDraft={saveToLocalDrafts}
              onExportDraft={downloadDraft}
              onImportDraft={() => importFileRef.current?.click()}
              onReset={clearDraft}
              onPublish={publishPost}
            />
          </div>

          <input
            ref={importFileRef}
            type="file"
            accept="application/json"
            onChange={importDraft}
            className="hidden"
          />

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-gray-500">
            <span className="rounded-full bg-gray-100 px-3 py-1">Words: {wordCount}</span>
            <span className="rounded-full bg-gray-100 px-3 py-1">Read time: {readMinutes} min</span>
            <span className="rounded-full bg-gray-100 px-3 py-1">Slug: /blog/{derivedSlug || "your-title"}</span>
            {lastSavedAt && <span>Auto-saved at {lastSavedAt}</span>}
            <span>Shortcut: Ctrl/Cmd + S</span>
          </div>

          {statusMessage && (
            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
              {statusMessage}
            </div>
          )}

          {hasLoadedSavedDraft && (
            <p className="mt-3 text-xs text-gray-500">
              Existing local draft was loaded. Continue writing or reset if needed.
            </p>
          )}

          <DraftsPanel
            remoteDrafts={remoteDrafts}
            localDrafts={localDrafts}
            activeRemoteDraftId={activeRemoteDraftId}
            onRefreshRemote={loadRemoteDrafts}
            onDeleteRemote={deleteRemoteDraft}
            onApplyRemote={applyRemoteDraft}
            onLoadLocal={loadFromLocalDrafts}
            onDeleteLocal={deleteFromLocalDrafts}
          />

          <div className="mt-8 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
            <EditorSection
              title={draft.title}
              subtitle={draft.subtitle}
              excerpt={draft.excerpt}
              titleLength={titleLength}
              excerptLength={excerptLength}
              content={draft.content}
              editorTab={editorTab}
              textareaRef={textareaRef}
              onChangeTitle={(value) => updateDraft("title", value)}
              onChangeSubtitle={(value) => updateDraft("subtitle", value)}
              onChangeExcerpt={(value) => updateDraft("excerpt", value)}
              onChangeContent={(value) => updateDraft("content", value)}
              onTabChange={setEditorTab}
              onSnippet={insertSnippet}
            />

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
              onSeoTitle={(value) => updateDraft("seoTitle", value)}
              onSeoDescription={(value) => updateDraft("seoDescription", value)}
              onSeoKeywords={(value) => updateDraft("seoKeywords", value)}
              onStatus={(value) => updateDraft("status", value)}
              onScheduledAt={(value) => updateDraft("scheduledAt", value)}
              onVisibility={(value) => updateDraft("visibility", value)}
              onAllowComments={(value) => updateDraft("allowComments", value)}
              onFeatured={(value) => updateDraft("featured", value)}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogWritePage;
