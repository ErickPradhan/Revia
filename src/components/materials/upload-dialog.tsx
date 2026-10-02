"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/lib/materials/types";
import { validateFile } from "@/lib/materials/utils";
import { uploadMaterial } from "@/lib/materials/store";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: Array<{ id: string; name: string }>;
  selectedFolderId: string | null;
  onUploadComplete: () => void;
}

interface PendingFile {
  file: File;
  status: "ready" | "saving" | "saved" | "failed";
  error?: string;
}

export function UploadDialog({
  open,
  onOpenChange,
  selectedFolderId,
  onUploadComplete,
}: UploadDialogProps) {
  const [dragActive, setDragActive] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles: PendingFile[] = Array.from(files).map((file) => {
      const validation = validateFile(file);
      return {
        file,
        status: validation.valid ? "ready" : "failed",
        error: validation.error,
      };
    });
    setPendingFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const uploadAll = async () => {
    for (let i = 0; i < pendingFiles.length; i++) {
      const pf = pendingFiles[i];
      if (pf.status !== "ready") continue;
      setPendingFiles((prev) =>
        prev.map((p, idx) =>
          idx === i ? { ...p, status: "saving" as const } : p,
        ),
      );
      try {
        await uploadMaterial(pf.file, { folderId: selectedFolderId });
        setPendingFiles((prev) =>
          prev.map((p, idx) => (idx === i ? { ...p, status: "saved" as const } : p)),
        );
      } catch (err) {
        setPendingFiles((prev) =>
          prev.map((p, idx) =>
            idx === i
              ? {
                  ...p,
                  status: "failed" as const,
                  error: err instanceof Error ? err.message : "Upload failed",
                }
              : p,
          ),
        );
      }
    }
    onUploadComplete();
  };

  const removeFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const close = () => {
    setPendingFiles([]);
    setDragActive(false);
    onOpenChange(false);
  };

  const hasReady = pendingFiles.some((p) => p.status === "ready");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-2xl">
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="text-lg font-semibold">Upload Material</h2>
          <Button variant="ghost" size="icon" onClick={close}>
            <X className="size-4" />
          </Button>
        </div>
        <div className="space-y-4 p-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border-strong p-8 text-center transition-colors",
              dragActive && "border-primary bg-primary-muted/20",
            )}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="mb-4 size-8 text-muted-foreground" />
            <p className="text-sm font-medium">
              Drag and drop files here, or click to browse
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Supports PDF, DOCX, TXT, Markdown, Images (up to 100MB)
            </p>
            <input
              ref={inputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
              accept=".pdf,.docx,.txt,.md,.markdown,.png,.jpg,.jpeg,.gif,.webp,.svg,.bmp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown,image/*"
            />
          </div>

          {pendingFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Files</h3>
              <div className="max-h-80 space-y-2 overflow-y-auto">
                {pendingFiles.map((pf, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-md border border-border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {pf.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(pf.file.size)} • {pf.file.type || "unknown"}
                      </p>
                      {pf.status === "failed" && pf.error && (
                        <p className="mt-1 text-xs text-danger">{pf.error}</p>
                      )}
                      {pf.status === "saving" && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Saving...
                        </p>
                      )}
                      {pf.status === "saved" && (
                        <p className="mt-1 text-xs text-success">Saved</p>
                      )}
                    </div>
                    {pf.status !== "saving" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(i)}
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button variant="secondary" onClick={close}>
              Close
            </Button>
            <Button onClick={uploadAll} disabled={!hasReady}>
              Upload {pendingFiles.filter((p) => p.status === "ready").length} file(s)
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
