const BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:3001"
).replace(/\/$/, "");

const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX ?? "/v1";

export function api(path: string) {
  if (!path.startsWith("/")) path = "/" + path;
  return `${BASE_URL}${API_PREFIX}${path}`;
}