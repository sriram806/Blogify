type Props = {
  isSavingDraft: boolean;
  isPublishing: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
};

const WriteTopBar = ({
  isSavingDraft,
  isPublishing,
  onSaveDraft,
  onPublish,
}: Props) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onSaveDraft}
        disabled={isSavingDraft}
        className="rounded-full border border-gray-300 px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition disabled:opacity-60"
      >
        {isSavingDraft ? "Saving..." : "Save Draft"}
      </button>
      <button
        type="button"
        onClick={onPublish}
        disabled={isPublishing}
        className="rounded-full bg-green-700 text-white px-4 py-1.5 text-xs font-semibold disabled:opacity-60 hover:bg-green-800 transition"
      >
        {isPublishing ? "Publishing..." : "Publish"}
      </button>
    </div>
  );
};

export default WriteTopBar;
