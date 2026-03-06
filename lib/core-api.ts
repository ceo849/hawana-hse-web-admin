export const CORE_API = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:3001"
).replace(/\/$/, "");

export function api(path: string) {
  if (!path.startsWith("/")) path = "/" + path;
  return `${CORE_API}${path}`;
}
export function coreApi(path: string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:3001";
  const prefix = process.env.NEXT_PUBLIC_API_PREFIX || "/v1";

  if (!path.startsWith("/")) path = "/" + path;

  return `${base}${prefix}${path}`;
}
