type Props = {
  isSavingDraft: boolean;
  isPublishing: boolean;
  onSaveDraft: () => void;
  onSaveLocalDraft: () => void;
  onExportDraft: () => void;
  onImportDraft: () => void;
  onReset: () => void;
  onPublish: () => void;
};

const WriteTopBar = ({
  isSavingDraft,
  isPublishing,
  onSaveDraft,
  onSaveLocalDraft,
  onExportDraft,
  onImportDraft,
  onReset,
  onPublish,
}: Props) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onSaveDraft}
        disabled={isSavingDraft}
        className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 transition disabled:opacity-60"
      >
        {isSavingDraft ? "Saving..." : "Save Draft"}
      </button>
      <button
        type="button"
        onClick={onSaveLocalDraft}
        className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 transition"
      >
        Save Local Draft
      </button>
      <button
        type="button"
        onClick={onExportDraft}
        className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 transition"
      >
        Export Draft
      </button>
      <button
        type="button"
        onClick={onImportDraft}
        className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 transition"
      >
        Import Draft
      </button>
      <button
        type="button"
        onClick={onReset}
        className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 transition"
      >
        Reset
      </button>
      <button
        type="button"
        onClick={onPublish}
        disabled={isPublishing}
        className="rounded-full bg-black text-white px-5 py-2 text-sm font-medium disabled:opacity-60 hover:bg-gray-800 transition"
      >
        {isPublishing ? "Publishing..." : "Publish"}
      </button>
    </div>
  );
};

export default WriteTopBar;
