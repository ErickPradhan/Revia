import { getMaterialFileType, type MaterialFileType } from "./types";

export const SUPPORTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/markdown",
  "image/*",
];

export const SUPPORTED_EXTENSIONS = [".pdf", ".docx", ".txt", ".md", ".markdown", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp"];

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export function isSupportedFile(file: File): boolean {
  const type = getMaterialFileType(file.type, file.name);
  return (
    type === "pdf" ||
    type === "docx" ||
    type === "txt" ||
    type === "md" ||
    type === "image"
  );
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!isSupportedFile(file)) {
    return {
      valid: false,
      error: "Unsupported file type. Supported: PDF, DOCX, TXT, Markdown, Images",
    };
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds ${formatMB(MAX_FILE_SIZE)} limit`,
    };
  }
  return { valid: true };
}

function formatMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(0) + "MB";
}

export function canPreview(type: MaterialFileType): boolean {
  return type === "pdf" || type === "txt" || type === "md" || type === "image";
}

export function getPreviewType(type: MaterialFileType): string {
  if (type === "pdf") return "pdf";
  if (type === "txt" || type === "md") return "text";
  if (type === "image") return "image";
  return "none";
}
