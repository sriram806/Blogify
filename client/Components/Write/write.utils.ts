import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from "./write.constants";
import { Visibility } from "./write.types";

type ParsedBlogContentMetadata = {
  content: string;
  tags: string[];
  visibility: Visibility;
  allowComments: boolean;
};

const CONTENT_METADATA_REGEX = /\n-{3,}\n(?:-{3,}\n)?Tags:\s*([^\n]*)\nVisibility:\s*(public|members|private)\nComments:\s*(enabled|disabled)\s*$/i;

const parseTags = (value: string) =>
  value
    .split(",")
    .map((item) => sanitizeFreeText(item).toLowerCase())
    .filter(Boolean);

const normalizeLineBreaks = (value: string) => value.replace(/\r\n/g, "\n");

export const getWordCount = (value: string) =>
  value
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

export const getReadMinutes = (words: number) => Math.max(1, Math.ceil(words / 200));

export const sanitizeFreeText = (value: string) => value.replace(/[\u0000-\u001F\u007F]/g, "").trim();

export const validateImageFile = (file: File) => {
  const maxSizeBytes = MAX_IMAGE_SIZE_MB * 1024 * 1024;

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `Invalid image type. Use jpg/png/webp/avif.`;
  }

  if (file.size > maxSizeBytes) {
    return `Image too large. Max ${MAX_IMAGE_SIZE_MB}MB.`;
  }

  return "";
};

export const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read selected image file."));
    reader.readAsDataURL(file);
  });

export const parseBlogContentMetadata = (value: string): ParsedBlogContentMetadata => {
  const normalized = normalizeLineBreaks(value || "").trimEnd();
  const match = normalized.match(CONTENT_METADATA_REGEX);

  if (!match || match.index === undefined) {
    return {
      content: value || "",
      tags: [],
      visibility: "public",
      allowComments: true,
    };
  }

  const [, tagsValue, visibilityValue, commentsValue] = match;
  const cleanContent = normalized.slice(0, match.index).trimEnd();

  return {
    content: cleanContent,
    tags: parseTags(tagsValue),
    visibility: (visibilityValue?.toLowerCase() as Visibility) || "public",
    allowComments: (commentsValue || "enabled").toLowerCase() === "enabled",
  };
};

export const composeBlogContentWithMetadata = (
  value: string,
  metadata: { tags: string[]; visibility: Visibility; allowComments: boolean }
) => {
  const parsed = parseBlogContentMetadata(value || "");
  const cleanTags = metadata.tags.map((item) => sanitizeFreeText(item).toLowerCase()).filter(Boolean);
  const tagsLine = cleanTags.join(", ");

  return `${parsed.content.trimEnd()}\n\n---\nTags: ${tagsLine}\nVisibility: ${metadata.visibility}\nComments: ${
    metadata.allowComments ? "enabled" : "disabled"
  }`;
};
