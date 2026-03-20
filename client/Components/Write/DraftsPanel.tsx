import { RemoteDraft } from "./write.types";

type Props = {
  remoteDrafts: RemoteDraft[];
  activeRemoteDraftId: number | null;
  onRefreshRemote: () => void;
  onDeleteRemote: () => void;
  onApplyRemote: (draft: RemoteDraft) => void;
};

const DraftsPanel = ({
  remoteDrafts,
  activeRemoteDraftId,
  onRefreshRemote,
  onDeleteRemote,
  onApplyRemote,
}: Props) => {
  return (
    <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-gray-500">Server drafts</p>
        <span className="text-xs text-gray-600">{remoteDrafts.length}</span>
        <button
          type="button"
          onClick={onRefreshRemote}
          className="ml-auto rounded-full border border-gray-300 px-3 py-1 text-xs font-medium hover:bg-gray-100"
        >
          Refresh
        </button>
        <button
          type="button"
          onClick={onDeleteRemote}
          className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium hover:bg-gray-100"
        >
          Delete active
        </button>
      </div>
      {remoteDrafts.length > 0 ? (
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
      ) : (
        <p className="mt-3 text-xs text-gray-500">No server drafts found.</p>
      )}
    </div>
  );
};

export default DraftsPanel;
