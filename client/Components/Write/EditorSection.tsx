import ReactMarkdown from "react-markdown";
import { EditorTab } from "./write.types";

type Props = {
  title: string;
  subtitle: string;
  excerpt: string;
  titleLength: number;
  excerptLength: number;
  content: string;
  editorTab: EditorTab;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onChangeTitle: (value: string) => void;
  onChangeSubtitle: (value: string) => void;
  onChangeExcerpt: (value: string) => void;
  onChangeContent: (value: string) => void;
  onTabChange: (tab: EditorTab) => void;
  onSnippet: (before: string, after?: string) => void;
  onUploadImages: () => void;
  isUploadingImages: boolean;
};

const EditorSection = ({
  title,
  subtitle,
  excerpt,
  titleLength,
  excerptLength,
  content,
  editorTab,
  textareaRef,
  onChangeTitle,
  onChangeSubtitle,
  onChangeExcerpt,
  onChangeContent,
  onTabChange,
  onSnippet,
  onUploadImages,
  isUploadingImages,
}: Props) => {
  return (
    <div className="space-y-7">
      <div className="space-y-5">
        <input
          type="text"
          value={title}
          onChange={(event) => onChangeTitle(event.target.value)}
          placeholder="Title"
          className="w-full border-0 bg-transparent px-0 py-2 text-5xl font-semibold leading-tight text-gray-900 outline-none placeholder:text-gray-300"
        />
        <p className="text-xs text-gray-500">{titleLength}/120 characters</p>

        <input
          type="text"
          value={subtitle}
          onChange={(event) => onChangeSubtitle(event.target.value)}
          placeholder="Tell your story..."
          className="w-full border-0 border-l-2 border-gray-200 bg-transparent px-3 py-1 text-xl text-gray-700 outline-none placeholder:text-gray-300"
        />

        <textarea
          value={excerpt}
          onChange={(event) => onChangeExcerpt(event.target.value)}
          placeholder="Short subtitle / preview text"
          rows={3}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-gray-300"
        />
        <p className="text-xs text-gray-500">{excerptLength}/255 characters</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <label className="text-sm font-medium text-gray-700">Story editor</label>
          <div className="inline-flex rounded-full border border-gray-300 p-1 text-xs">
            {(["edit", "preview", "split"] as EditorTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`rounded-full px-3 py-1 capitalize transition ${
                  editorTab === tab ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" onClick={() => onSnippet("**", "**")} className="rounded-full border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100">Bold</button>
          <button type="button" onClick={() => onSnippet("*", "*")} className="rounded-full border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100">Italic</button>
          <button type="button" onClick={() => onSnippet("`", "`")} className="rounded-full border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100">Inline Code</button>
          <button type="button" onClick={() => onSnippet("## ")} className="rounded-full border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100">Heading</button>
          <button type="button" onClick={() => onSnippet("- ")} className="rounded-full border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100">List</button>
          <button type="button" onClick={() => onSnippet("> ")} className="rounded-full border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100">Quote</button>
          <button type="button" onClick={() => onSnippet("[link text](https://)")} className="rounded-full border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100">Link</button>
          <button
            type="button"
            onClick={onUploadImages}
            disabled={isUploadingImages}
            className="rounded-full border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploadingImages ? "Uploading images..." : "Add images"}
          </button>
        </div>

        <div className={`mt-4 grid gap-4 ${editorTab === "split" ? "md:grid-cols-2" : "grid-cols-1"}`}>
          {editorTab !== "preview" && (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(event) => onChangeContent(event.target.value)}
              placeholder="Write your blog post using Markdown..."
              rows={18}
              className="w-full rounded-xl border border-gray-200 px-5 py-4 text-base leading-8 outline-none focus:border-gray-300"
            />
          )}

          {editorTab !== "edit" && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 min-h-105 prose max-w-none prose-sm sm:prose-base">
              {content.trim().length > 0 ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                <p className="text-sm text-gray-500">Preview will appear as you write markdown content.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorSection;
