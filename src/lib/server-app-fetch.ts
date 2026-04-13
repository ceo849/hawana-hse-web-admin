export function getCoreUrl(): string {
  const url = process.env.CORE_API_BASE_URL;

  if (!url) {
    throw new Error("CORE_API_BASE_URL is not defined");
  }

  // نضمن عدم وجود / في النهاية لتفادي // في URL
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function normalizePath(path: string): string {
  if (!path.startsWith("/")) return `/${path}`;
  return path;
}

export async function serverAppFetch(
  path: string,
  token?: string,
  options?: RequestInit
) {
  const BASE_URL = getCoreUrl();
  const normalizedPath = normalizePath(path);

  const res = await fetch(`${BASE_URL}${normalizedPath}`, {
    ...options,
    headers: {
      ...(options?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  return res;
}