"use client";

import { useEffect, useState } from "react";

import type { Material, MaterialFolder } from "./types";
import {
  deleteFolder,
  deleteMaterial,
  getAllFolders,
  getAllMaterials,
  getMaterialFile,
  putFolder,
  putMaterial,
  storeMaterialFile,
} from "@/lib/db/indexeddb";

export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export class MaterialsStoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MaterialsStoreError";
  }
}

export interface UploadResult {
  material: Material;
}

export async function createFolder(name: string): Promise<MaterialFolder> {
  const folder: MaterialFolder = {
    id: generateId(),
    name: name.trim(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await putFolder(folder);
  return folder;
}

export async function updateFolder(
  folderId: string,
  updates: Partial<Pick<MaterialFolder, "name">>,
): Promise<void> {
  const folders = await getAllFolders();
  const folder = folders.find((f) => f.id === folderId);
  if (!folder) throw new MaterialsStoreError("Folder not found");
  await putFolder({
    ...folder,
    ...updates,
    name: updates.name?.trim() ?? folder.name,
    updatedAt: Date.now(),
  });
}

export async function removeFolder(folderId: string): Promise<void> {
  await deleteFolder(folderId);
}

export async function uploadMaterial(
  file: File,
  options?: { folderId?: string | null; displayName?: string },
): Promise<UploadResult> {
  const now = Date.now();
  const id = generateId();
  const displayName = options?.displayName?.trim() || file.name;

  const material: Material = {
    id,
    filename: file.name,
    displayName,
    type: getFileType(file),
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    createdAt: now,
    updatedAt: now,
    folderId: options?.folderId ?? null,
    processingStatus: "saving",
  };

  await putMaterial(material);
  await storeMaterialFile(id, file);

  const savedMaterial: Material = {
    ...material,
    processingStatus: "saved",
  };
  await putMaterial(savedMaterial);

  return { material: savedMaterial };
}

function getFileType(file: File): Material["type"] {
  const ext = file.name.toLowerCase().split(".").pop() || "";
  const mime = file.type;

  if (mime === "application/pdf" || ext === "pdf") return "pdf";
  if (
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    ext === "docx"
  )
    return "docx";
  if (mime.startsWith("text/plain") || ext === "txt") return "txt";
  if (ext === "md" || ext === "markdown") return "md";
  if (mime.startsWith("image/")) return "image";
  return "unknown";
}

export async function renameMaterial(
  materialId: string,
  displayName: string,
): Promise<void> {
  const materials = await getAllMaterials();
  const material = materials.find((m) => m.id === materialId);
  if (!material) throw new MaterialsStoreError("Material not found");
  await putMaterial({
    ...material,
    displayName: displayName.trim(),
    updatedAt: Date.now(),
  });
}

export async function moveMaterial(
  materialId: string,
  folderId: string | null,
): Promise<void> {
  const materials = await getAllMaterials();
  const material = materials.find((m) => m.id === materialId);
  if (!material) throw new MaterialsStoreError("Material not found");
  await putMaterial({
    ...material,
    folderId,
    updatedAt: Date.now(),
  });
}

export async function removeMaterial(materialId: string): Promise<void> {
  await deleteMaterial(materialId);
}

export async function getMaterialBlob(id: string): Promise<Blob | undefined> {
  return getMaterialFile(id);
}

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [folders, setFolders] = useState<MaterialFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const [m, f] = await Promise.all([getAllMaterials(), getAllFolders()]);
      setMaterials(m);
      setFolders(f);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load materials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    void (async () => {
      if (!mounted) return;
      try {
        const [m, f] = await Promise.all([getAllMaterials(), getAllFolders()]);
        if (mounted) {
          setMaterials(m);
          setFolders(f);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load materials");
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { materials, folders, loading, error, refresh };
}
