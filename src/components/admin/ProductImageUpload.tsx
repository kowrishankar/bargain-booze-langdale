"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export function ProductImageUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <span className="block text-sm font-semibold text-stone-800">Product image</span>

      {value ? (
        <div className="relative aspect-square max-w-xs overflow-hidden rounded-lg border-2 border-stone-200 bg-stone-50">
          <Image src={value} alt="Product preview" fill className="object-contain p-3" sizes="320px" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-md bg-white/90 p-1.5 text-stone-700 shadow hover:bg-white"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square max-w-xs w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 text-stone-600 transition hover:border-brand hover:bg-brand-light hover:text-brand"
        >
          <Upload className="h-8 w-8" />
          <span className="text-sm font-medium">{uploading ? "Uploading…" : "Upload image"}</span>
          <span className="text-xs text-stone-500">JPEG, PNG, WebP or GIF · max 5 MB</span>
        </button>
      )}

      {value && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="text-sm font-medium text-brand hover:underline"
        >
          {uploading ? "Uploading…" : "Replace image"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />

      <label className="block text-sm">
        <span className="mb-1 block text-stone-600">Or paste image URL (optional)</span>
        <input
          type="url"
          value={value.startsWith("/uploads/") ? "" : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-lg border border-stone-300 px-3 py-2"
        />
      </label>

      <input type="hidden" name="imageUrl" value={value} />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
