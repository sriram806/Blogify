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
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onSaveDraft}
        disabled={isSavingDraft}
        className="rounded-full border border-gray-300 px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition disabled:opacity-60"
      >
        {isSavingDraft ? "Saving..." : "Save"}
      </button>
      <button
        type="button"
        onClick={onSaveLocalDraft}
        className="rounded-full border border-gray-300 px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition"
      >
        Local
      </button>
      <button
        type="button"
        onClick={onExportDraft}
        className="rounded-full border border-gray-300 px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition"
      >
        Export Draft
      </button>
      <button
        type="button"
        onClick={onImportDraft}
        className="rounded-full border border-gray-300 px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition"
      >
        Import Draft
      </button>
      <button
        type="button"
        onClick={onReset}
        className="rounded-full border border-gray-300 px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition"
      >
        Reset
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
