/** Normalise Neon/Postgres URL for serverless (channel_binding can break pg). */
export function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return url
    .replace(/&?channel_binding=[^&]*/gi, "")
    .replace(/\?&/, "?")
    .replace(/[?&]$/, "");
}
