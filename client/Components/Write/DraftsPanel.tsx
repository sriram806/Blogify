import { LocalDraftRecord, RemoteDraft } from "./write.types";

type Props = {
  remoteDrafts: RemoteDraft[];
  localDrafts: LocalDraftRecord[];
  activeRemoteDraftId: number | null;
  onRefreshRemote: () => void;
  onDeleteRemote: () => void;
  onApplyRemote: (draft: RemoteDraft) => void;
  onLoadLocal: (draft: LocalDraftRecord) => void;
  onDeleteLocal: (id: string) => void;
};

const DraftsPanel = ({
  remoteDrafts,
  localDrafts,
  activeRemoteDraftId,
  onRefreshRemote,
  onDeleteRemote,
  onApplyRemote,
  onLoadLocal,
  onDeleteLocal,
}: Props) => {
  return (
    <>
      <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRefreshRemote}
            className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium hover:bg-gray-100"
          >
            Refresh Server Drafts
          </button>
          <button
            type="button"
            onClick={onDeleteRemote}
            className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium hover:bg-gray-100"
          >
            Delete Active Server Draft
          </button>
          <span className="text-xs text-gray-600">Server drafts: {remoteDrafts.length}</span>
        </div>
        {remoteDrafts.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {remoteDrafts.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onApplyRemote(item)}
                className={`rounded-full px-3 py-1 text-xs border ${
                  activeRemoteDraftId === item.id
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                #{item.id} {item.title || "Untitled"}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-600">Local drafts: {localDrafts.length}</span>
        </div>

        {localDrafts.length > 0 ? (
          <div className="mt-3 space-y-2">
            {localDrafts.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500">{new Date(item.savedAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onLoadLocal(item)}
                    className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium hover:bg-gray-100"
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteLocal(item.id)}
                    className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs text-gray-500">No local draft records yet. Click “Save Local Draft”.</p>
        )}
      </div>
    </>
  );
};

export default DraftsPanel;
