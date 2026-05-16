/** Normalise Neon/Postgres URL for the pg driver (channel_binding breaks pg). */
export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  let normalized = url
    .replace(/&?channel_binding=[^&]*/gi, "")
    .replace(/\?&/, "?")
    .replace(/[?&]$/, "");

  // pg v8 treats sslmode=require as verify-full; Neon docs recommend libpq compat
  if (!/uselibpqcompat=/i.test(normalized) && /sslmode=require/i.test(normalized)) {
    const sep = normalized.includes("?") ? "&" : "?";
    normalized = `${normalized}${sep}uselibpqcompat=true`;
  }

  return normalized;
}
