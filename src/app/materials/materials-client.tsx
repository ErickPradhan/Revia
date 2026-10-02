"use client";

import { useMemo, useState } from "react";
import {
  Folder,
  FolderPlus,
  MoreHorizontal,
  Search,
  Upload,
  File,
  FileText,
  Image as ImageIcon,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Material, MaterialFolder } from "@/lib/materials/types";
import { formatFileSize } from "@/lib/materials/types";
import {
  createFolder,
  moveMaterial,
  removeFolder,
  removeMaterial,
  renameMaterial,
  useMaterials,
} from "@/lib/materials/store";
import { UploadDialog } from "@/components/materials/upload-dialog";
import { MaterialPreview } from "@/components/materials/material-preview";

type SortBy = "recent" | "name" | "size";
type FilterBy = "all" | "pdf" | "docx" | "txt" | "md" | "image";

export function MaterialsClient() {
  const { materials, folders, loading, error, refresh } = useMaterials();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterBy>("all");
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const filteredMaterials = useMemo(() => {
    let result = materials.filter((m) => m.folderId === selectedFolderId);

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.displayName.toLowerCase().includes(q) ||
          m.filename.toLowerCase().includes(q),
      );
    }

    if (filter !== "all") {
      result = result.filter((m) => m.type === filter || (filter === "md" && m.type === "markdown"));
    }

    result.sort((a, b) => {
      if (sortBy === "recent") return b.createdAt - a.createdAt;
      if (sortBy === "name") return a.displayName.localeCompare(b.displayName);
      if (sortBy === "size") return b.size - a.size;
      return 0;
    });

    return result;
  }, [materials, selectedFolderId, search, filter, sortBy]);

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;
    try {
      await createFolder(folderName);
      setFolderName("");
      setShowNewFolder(false);
      await refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRename = async (material: Material) => {
    const name = prompt("Rename material", material.displayName);
    if (name && name.trim() && name !== material.displayName) {
      try {
        await renameMaterial(material.id, name);
        await refresh();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMove = async (material: Material) => {
  const choice = prompt(
    "Move to folder (enter number):\n0: Root\n" +
      folders.map((f, i) => `${i + 1}: ${f.name}`).join("\n"),
    "0",
  );
    if (choice === null) return;
    const idx = parseInt(choice);
    const newFolderId = idx === 0 ? null : folders[idx - 1]?.id ?? material.folderId;
    if (newFolderId !== material.folderId) {
      try {
        await moveMaterial(material.id, newFolderId);
        await refresh();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async (material: Material) => {
    if (confirm(`Delete "${material.displayName}"? This cannot be undone.`)) {
      try {
        await removeMaterial(material.id);
        await refresh();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteFolder = async (folder: MaterialFolder) => {
    if (confirm(`Delete folder "${folder.name}"? Materials in this folder will remain in root.`)) {
      try {
        await removeFolder(folder.id);
        if (selectedFolderId === folder.id) setSelectedFolderId(null);
        await refresh();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRenameFolder = async (folder: MaterialFolder) => {
    const name = prompt("Rename folder", folder.name);
    if (name && name.trim() && name !== folder.name) {
      try {
        const { updateFolder } = await import("@/lib/materials/store");
        await updateFolder(folder.id, { name });
        await refresh();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getIcon = (type: Material["type"]) => {
    if (type === "pdf") return <FileText className="size-5 text-danger" />;
    if (type === "docx") return <FileText className="size-5 text-primary" />;
    if (type === "txt" || type === "md" || type === "markdown") return <FileText className="size-5 text-muted-foreground" />;
    if (type === "image") return <ImageIcon className="size-5 text-accent" />;
    return <File className="size-5 text-muted-foreground" />;
  };

  const totalMaterials = materials.length;

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl p-4 sm:p-6">
        <p className="text-sm text-muted-foreground">Loading materials...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Materials</h1>
          <p className="text-muted-foreground">
            Manage the study materials you use for revision and exam preparation.
          </p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Upload className="mr-2 size-4" />
          Upload Material
        </Button>
      </div>

      {error && (
        <Card className="border-danger/30 bg-danger/10">
          <CardContent className="pt-6">
            <p className="text-sm text-danger">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={selectedFolderId === null ? "primary" : "secondary"}
            size="sm"
            onClick={() => setSelectedFolderId(null)}
          >
            All
          </Button>
          {folders.map((folder) => (
            <div key={folder.id} className="group relative flex items-center gap-1">
              <Button
                variant={selectedFolderId === folder.id ? "primary" : "secondary"}
                size="sm"
                onClick={() => setSelectedFolderId(folder.id)}
              >
                <Folder className="mr-2 size-3" />
                {folder.name}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100"
                onClick={() => handleRenameFolder(folder)}
              >
                <MoreHorizontal className="size-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-danger opacity-0 group-hover:opacity-100"
                onClick={() => handleDeleteFolder(folder)}
              >
                <X className="size-3" />
              </Button>
            </div>
          ))}
          {showNewFolder ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Folder name"
                className="h-8 rounded-md border border-border bg-background px-2 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateFolder();
                  if (e.key === "Escape") {
                    setShowNewFolder(false);
                    setFolderName("");
                  }
                }}
                autoFocus
              />
              <Button size="sm" onClick={handleCreateFolder}>
                Add
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowNewFolder(false);
                  setFolderName("");
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setShowNewFolder(true)}>
              <FolderPlus className="mr-2 size-3" />
              New Folder
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search materials..."
              className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-3 text-sm sm:w-64"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterBy)}
            className="h-9 rounded-md border border-border bg-background px-3 text-sm"
          >
            <option value="all">All</option>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="txt">TXT</option>
            <option value="md">Markdown</option>
            <option value="image">Images</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="h-9 rounded-md border border-border bg-background px-3 text-sm"
          >
            <option value="recent">Recently added</option>
            <option value="name">Name</option>
            <option value="size">File size</option>
          </select>
        </div>
      </div>

      {filteredMaterials.length === 0 && totalMaterials === 0 ? (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>No study materials yet</CardTitle>
            <CardDescription>
              Upload your lecture notes, slides, textbooks, or other study material to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <Button onClick={() => setUploadOpen(true)}>
              <Upload className="mr-2 size-4" />
              Upload Material
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="group relative flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    {getIcon(material.type)}
                    <CardTitle className="truncate text-sm">{material.displayName}</CardTitle>
                  </div>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={() => setMenuOpenId(menuOpenId === material.id ? null : material.id)}
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                    {menuOpenId === material.id && (
                      <div className="absolute right-0 top-9 z-10 w-40 rounded-md border border-border bg-surface shadow-lg">
                        <button
                          className="w-full px-3 py-2 text-left text-sm hover:bg-surface-muted"
                          onClick={() => {
                            setPreviewMaterial(material);
                            setPreviewOpen(true);
                            setMenuOpenId(null);
                          }}
                        >
                          Open
                        </button>
                        <button
                          className="w-full px-3 py-2 text-left text-sm hover:bg-surface-muted"
                          onClick={() => {
                            handleRename(material);
                            setMenuOpenId(null);
                          }}
                        >
                          Rename
                        </button>
                        <button
                          className="w-full px-3 py-2 text-left text-sm hover:bg-surface-muted"
                          onClick={() => {
                            handleMove(material);
                            setMenuOpenId(null);
                          }}
                        >
                          Move
                        </button>
                        <button
                          className="w-full px-3 py-2 text-left text-sm text-danger hover:bg-surface-muted"
                          onClick={() => {
                            handleDelete(material);
                            setMenuOpenId(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <CardDescription className="truncate">
                  {material.filename}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto flex flex-col gap-1 pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{material.type.toUpperCase()}</span>
                  <span>{formatFileSize(material.size)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(material.createdAt).toLocaleDateString()}</span>
                  <span className="capitalize">{material.processingStatus}</span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    setPreviewMaterial(material);
                    setPreviewOpen(true);
                  }}
                >
                  Open
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        folders={folders}
        selectedFolderId={selectedFolderId}
        onUploadComplete={refresh}
      />

      <MaterialPreview
        material={previewMaterial}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
}
