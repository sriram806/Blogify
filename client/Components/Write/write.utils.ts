import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from "./write.constants";

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
