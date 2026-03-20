import { CATEGORIES } from "./write.constants";
import { BlogDraft, PublishStatus } from "./write.types";

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
  onStatus: (value: PublishStatus) => void;
  onScheduledAt: (value: string) => void;
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
  onStatus,
  onScheduledAt,
}: Props) => {
  return (
    <aside className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
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

        <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Cover image upload</label>
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

        <h2 className="mt-5 text-sm font-semibold text-gray-900">Publishing</h2>

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
      </div>
    </aside>
  );
};

export default SettingsSidebar;
