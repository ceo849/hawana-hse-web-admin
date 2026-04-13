export function api(path: string) {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:3001";

  const prefix = process.env.NEXT_PUBLIC_API_PREFIX || "/v1";

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${base}${prefix}${normalizedPath}`;
}