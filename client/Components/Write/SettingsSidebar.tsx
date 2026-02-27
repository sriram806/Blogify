import { CATEGORIES } from "./write.constants";
import { BlogDraft, PublishStatus, Visibility } from "./write.types";

type Props = {
  draft: BlogDraft;
  tagInput: string;
  coverPreview: string;
  onChangeCategory: (value: string) => void;
  onTagInput: (value: string) => void;
  onTagKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onCoverFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCoverUrl: (value: string) => void;
  onSeoTitle: (value: string) => void;
  onSeoDescription: (value: string) => void;
  onSeoKeywords: (value: string) => void;
  onStatus: (value: PublishStatus) => void;
  onScheduledAt: (value: string) => void;
  onVisibility: (value: Visibility) => void;
  onAllowComments: (value: boolean) => void;
  onFeatured: (value: boolean) => void;
};

const SettingsSidebar = ({
  draft,
  tagInput,
  coverPreview,
  onChangeCategory,
  onTagInput,
  onTagKeyDown,
  onAddTag,
  onRemoveTag,
  onCoverFile,
  onCoverUrl,
  onSeoTitle,
  onSeoDescription,
  onSeoKeywords,
  onStatus,
  onScheduledAt,
  onVisibility,
  onAllowComments,
  onFeatured,
}: Props) => {
  return (
    <aside className="space-y-5">
      <div className="rounded-2xl border border-gray-200 p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-gray-900">Post Settings</h2>

        <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Category</label>
        <select
          value={draft.category}
          onChange={(event) => onChangeCategory(event.target.value)}
          className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Tags</label>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(event) => onTagInput(event.target.value)}
            onKeyDown={onTagKeyDown}
            placeholder="e.g. nextjs"
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
          <button
            type="button"
            onClick={onAddTag}
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
          >
            Add
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {draft.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onRemoveTag(tag)}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 hover:bg-gray-200"
            >
              #{tag} ×
            </button>
          ))}
        </div>

        <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Cover Image Upload</label>
        <input
          type="file"
          accept="image/*"
          onChange={onCoverFile}
          className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
        />

        <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Or Cover Image URL</label>
        <input
          type="url"
          value={draft.coverImageUrl}
          onChange={(event) => onCoverUrl(event.target.value)}
          placeholder="https://example.com/cover.jpg"
          className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
        />

        {coverPreview && (
          <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-2">
            <div
              aria-label="Cover preview"
              className="h-36 w-full rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${coverPreview})` }}
            />
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-gray-900">SEO</h2>

        <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">SEO Title</label>
        <input
          type="text"
          value={draft.seoTitle}
          onChange={(event) => onSeoTitle(event.target.value)}
          placeholder="Optimized search title"
          className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
        />

        <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">SEO Description</label>
        <textarea
          value={draft.seoDescription}
          onChange={(event) => onSeoDescription(event.target.value)}
          rows={3}
          placeholder="Meta description for search engines"
          className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
        />

        <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">SEO Keywords</label>
        <input
          type="text"
          value={draft.seoKeywords}
          onChange={(event) => onSeoKeywords(event.target.value)}
          placeholder="nextjs,typescript,blogging"
          className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
        />
      </div>

      <div className="rounded-2xl border border-gray-200 p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-gray-900">Publishing</h2>

        <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Status</label>
        <select
          value={draft.status}
          onChange={(event) => onStatus(event.target.value as PublishStatus)}
          className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
        >
          <option value="draft">Draft</option>
          <option value="review">Ready for Review</option>
          <option value="published">Publish Now</option>
          <option value="scheduled">Schedule</option>
        </select>

        {draft.status === "scheduled" && (
          <>
            <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Schedule Date</label>
            <input
              type="datetime-local"
              value={draft.scheduledAt}
              onChange={(event) => onScheduledAt(event.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </>
        )}

        <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Visibility</label>
        <select
          value={draft.visibility}
          onChange={(event) => onVisibility(event.target.value as Visibility)}
          className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
        >
          <option value="public">Public</option>
          <option value="members">Members only</option>
          <option value="private">Private</option>
        </select>

        <div className="mt-4 space-y-2">
          <label className="flex items-center justify-between text-sm text-gray-700">
            Allow comments
            <input
              type="checkbox"
              checked={draft.allowComments}
              onChange={(event) => onAllowComments(event.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between text-sm text-gray-700">
            Mark as featured
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(event) => onFeatured(event.target.checked)}
            />
          </label>
        </div>
      </div>
    </aside>
  );
};

export default SettingsSidebar;
