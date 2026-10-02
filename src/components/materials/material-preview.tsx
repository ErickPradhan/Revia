"use client";

import { useEffect, useState } from "react";
import { File, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getMaterialBlob } from "@/lib/materials/store";
import { canPreview, getPreviewType } from "@/lib/materials/utils";
import type { Material } from "@/lib/materials/types";
import { formatFileSize } from "@/lib/materials/types";

interface MaterialPreviewProps {
  material: Material | null;
  open: boolean;
  onClose: () => void;
}

export function MaterialPreview({ material, open, onClose }: MaterialPreviewProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const [error] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    if (!open || !material) {
      return;
    }

    const load = async () => {
      try {
        const blob = await getMaterialBlob(material.id);
        if (!blob || cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        if (!cancelled) {
          setUrl(objectUrl);
        }
        if (getPreviewType(material.type) === "text" && !cancelled) {
          const content = await blob.text();
          setText(content);
        }
      } catch {
        // ignore
      }
    };

    void load();

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [open, material]);

  useEffect(() => {
    if (!open) {
      return;
    }
  }, [open]);

  if (!open || !material) return null;

  const previewable = canPreview(material.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <Card className="flex h-full w-full max-w-5xl flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-semibold">
              {material.displayName}
            </h2>
            <p className="text-xs text-muted-foreground">
              {material.type.toUpperCase()} • {formatFileSize(material.size)}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {!previewable && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <File className="mb-4 size-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">Preview not available</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Preview not available for this file type yet.
              </p>
            </div>
          )}

          {previewable && error && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          {previewable && !error && material.type === "pdf" && url && (
            <iframe
              src={url}
              className="h-full w-full rounded-md border border-border"
              title={material.displayName}
            />
          )}

          {previewable && !error && material.type === "image" && url && (
            <div className="flex h-full items-center justify-center">
              <img
                src={url}
                alt={material.displayName}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}

          {previewable && !error && (material.type === "txt" || material.type === "md") && (
            <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
              {text}
            </pre>
          )}
        </div>
      </Card>
    </div>
  );
}
