// WEB-ADMIN — src/lib/api.ts

type ApiFetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("Missing NEXT_PUBLIC_API_BASE_URL in .env.local");
  return base.replace(/\/$/, "");
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = path.startsWith("http") ? path : `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");
    const msg =
      typeof body === "string" && body
        ? body
        : body?.message
          ? String(body.message)
          : `Request failed: ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  if (!isJson) {
    // @ts-expect-error allow non-json responses if needed later
    return (await res.text()) as T;
  }

  return (await res.json()) as T;
}