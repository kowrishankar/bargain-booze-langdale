import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const PRODUCT_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export function isLocalProductImage(url: string | null | undefined): boolean {
  return Boolean(url?.startsWith("/uploads/products/"));
}

export function localPathFromImageUrl(url: string): string {
  return path.join(process.cwd(), "public", url.replace(/^\//, ""));
}

export async function saveProductImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Please upload a JPEG, PNG, WebP, or GIF image.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be 5 MB or smaller.");
  }

  await mkdir(PRODUCT_UPLOAD_DIR, { recursive: true });

  const ext = EXT_BY_TYPE[file.type] ?? ".jpg";
  const filename = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(PRODUCT_UPLOAD_DIR, filename), buffer);

  return `/uploads/products/${filename}`;
}

export async function deleteLocalProductImage(url: string | null | undefined): Promise<void> {
  if (!isLocalProductImage(url)) return;
  try {
    await unlink(localPathFromImageUrl(url!));
  } catch {
    // File may already be removed
  }
}
