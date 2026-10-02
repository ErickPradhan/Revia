export type MaterialFileType =
  | "pdf"
  | "docx"
  | "txt"
  | "md"
  | "markdown"
  | "image"
  | "unknown";

export interface MaterialFolder {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

export interface Material {
  id: string;
  filename: string;
  displayName: string;
  type: MaterialFileType;
  mimeType: string;
  size: number;
  createdAt: number;
  updatedAt: number;
  folderId: string | null;
  processingStatus: "ready" | "saving" | "saved" | "failed";
  error?: string;
}

export function getMaterialFileType(
  mimeType: string,
  filename: string,
): MaterialFileType {
  const ext = filename.toLowerCase().split(".").pop() || "";

  if (mimeType === "application/pdf" || ext === "pdf") return "pdf";
  if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    ext === "docx"
  )
    return "docx";
  if (mimeType.startsWith("text/plain") || ext === "txt") return "txt";
  if (ext === "md" || ext === "markdown") return "md";
  if (mimeType.startsWith("image/")) return "image";

  return "unknown";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
