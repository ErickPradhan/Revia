import type { Material, MaterialFolder } from "@/lib/materials/types";

const DB_NAME = "revia-personal";
const DB_VERSION = 1;

const STORE_MATERIALS = "materials";
const STORE_MATERIAL_FILES = "materialFiles";
const STORE_FOLDERS = "folders";

export interface ReviaDB {
  materials: Material;
  materialFiles: { id: string; blob: Blob };
  folders: MaterialFolder;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORE_MATERIALS)) {
        const store = db.createObjectStore(STORE_MATERIALS, { keyPath: "id" });
        store.createIndex("folderId", "folderId");
        store.createIndex("createdAt", "createdAt");
        store.createIndex("name", ["filename", "displayName"]);
        store.createIndex("type", "type");
      }

      if (!db.objectStoreNames.contains(STORE_MATERIAL_FILES)) {
        db.createObjectStore(STORE_MATERIAL_FILES, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(STORE_FOLDERS)) {
        const store = db.createObjectStore(STORE_FOLDERS, { keyPath: "id" });
        store.createIndex("name", "name");
        store.createIndex("createdAt", "createdAt");
      }
    };
  });
}

export async function getAllMaterials(): Promise<Material[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_MATERIALS, "readonly");
    const store = transaction.objectStore(STORE_MATERIALS);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

export async function getMaterial(id: string): Promise<Material | undefined> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_MATERIALS, "readonly");
    const store = transaction.objectStore(STORE_MATERIALS);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

export async function putMaterial(material: Material): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_MATERIALS, "readwrite");
    const store = transaction.objectStore(STORE_MATERIALS);
    const request = store.put(material);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

export async function deleteMaterial(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(
      [STORE_MATERIALS, STORE_MATERIAL_FILES],
      "readwrite",
    );
    transaction.objectStore(STORE_MATERIALS).delete(id);
    transaction.objectStore(STORE_MATERIAL_FILES).delete(id);

    transaction.oncomplete = () => db.close();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function storeMaterialFile(id: string, blob: Blob): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_MATERIAL_FILES, "readwrite");
    const store = transaction.objectStore(STORE_MATERIAL_FILES);
    const request = store.put({ id, blob });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

export async function getMaterialFile(id: string): Promise<Blob | undefined> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_MATERIAL_FILES, "readonly");
    const store = transaction.objectStore(STORE_MATERIAL_FILES);
    const request = store.get(id);

    request.onsuccess = () => {
      const result = request.result as { id: string; blob: Blob } | undefined;
      resolve(result?.blob);
    };
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

export async function deleteMaterialFile(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_MATERIAL_FILES, "readwrite");
    const store = transaction.objectStore(STORE_MATERIAL_FILES);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

export async function getAllFolders(): Promise<MaterialFolder[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_FOLDERS, "readonly");
    const store = transaction.objectStore(STORE_FOLDERS);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

export async function putFolder(folder: MaterialFolder): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_FOLDERS, "readwrite");
    const store = transaction.objectStore(STORE_FOLDERS);
    const request = store.put(folder);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

export async function deleteFolder(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_FOLDERS, "readwrite");
    const store = transaction.objectStore(STORE_FOLDERS);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}
