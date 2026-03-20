"use client";

import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type Props = {
  title: string;
  subtitle: string;
  excerpt: string;
  titleLength: number;
  excerptLength: number;
  content: string;
  onChangeTitle: (value: string) => void;
  onChangeSubtitle: (value: string) => void;
  onChangeExcerpt: (value: string) => void;
  onChangeContent: (value: string) => void;
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
  onChangeTitle,
  onChangeSubtitle,
  onChangeExcerpt,
  onChangeContent,
  onUploadImages,
  isUploadingImages,
}: Props) => {
  return (
    <div className="space-y-6">
      <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
        <input
          type="text"
          value={title}
          onChange={(event) => onChangeTitle(event.target.value)}
          placeholder="Title"
          className="w-full border-0 bg-transparent px-0 py-2 text-4xl sm:text-5xl font-semibold leading-tight text-gray-900 outline-none placeholder:text-gray-300"
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

      <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <label className="text-sm font-medium text-gray-700">Story editor (Markdown)</label>
          <p className="text-xs text-gray-500">Live preview enabled</p>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-gray-500">Use the toolbar for bold, headings, links, lists, quotes, and code blocks.</p>
          <button
            type="button"
            onClick={onUploadImages}
            disabled={isUploadingImages}
            className="rounded-full border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploadingImages ? "Uploading images..." : "Add images"}
          </button>
        </div>

        <div className="mt-4" data-color-mode="light">
          <MDEditor
            value={content}
            onChange={(value) => onChangeContent(value || "")}
            height={560}
            preview="live"
            visibleDragbar={false}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorSection;
