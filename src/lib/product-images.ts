import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { del, put } from "@vercel/blob";

export const PRODUCT_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

function useBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function isLocalProductImage(url: string | null | undefined): boolean {
  return Boolean(url?.startsWith("/uploads/products/"));
}

export function isBlobProductImage(url: string | null | undefined): boolean {
  return Boolean(url?.includes(".blob.vercel-storage.com"));
}

export function localPathFromImageUrl(url: string): string {
  return path.join(process.cwd(), "public", url.replace(/^\//, ""));
}

async function saveToBlob(file: File): Promise<string> {
  const ext = EXT_BY_TYPE[file.type] ?? ".jpg";
  const key = `products/${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const blob = await put(key, buffer, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: false,
  });

  return blob.url;
}

async function saveToLocalDisk(file: File): Promise<string> {
  await mkdir(PRODUCT_UPLOAD_DIR, { recursive: true });

  const ext = EXT_BY_TYPE[file.type] ?? ".jpg";
  const filename = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(PRODUCT_UPLOAD_DIR, filename), buffer);

  return `/uploads/products/${filename}`;
}

export async function saveProductImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Please upload a JPEG, PNG, WebP, or GIF image.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be 5 MB or smaller.");
  }

  if (useBlobStorage()) {
    return saveToBlob(file);
  }

  return saveToLocalDisk(file);
}

/** Remove a stored product image (Vercel Blob or local upload). */
export async function deleteProductImage(url: string | null | undefined): Promise<void> {
  if (!url) return;

  if (isBlobProductImage(url)) {
    try {
      await del(url);
    } catch {
      // Blob may already be removed
    }
    return;
  }

  if (!isLocalProductImage(url)) return;

  try {
    await unlink(localPathFromImageUrl(url));
  } catch {
    // File may already be removed
  }
}

/** @deprecated Use deleteProductImage */
export const deleteLocalProductImage = deleteProductImage;
