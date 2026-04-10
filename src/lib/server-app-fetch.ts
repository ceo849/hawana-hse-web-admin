import { cookies, headers } from "next/headers";

async function getBaseUrl() {
  const h = await headers();

  const protocol = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host");

  if (!host) {
    throw new Error("Missing host header");
  }

  return `${protocol}://${host}`;
}

export async function serverAppFetch(path: string, init?: RequestInit) {
  const cookieStore = await cookies();
  const baseUrl = await getBaseUrl();

  const requestHeaders = new Headers(init?.headers);

  const cookieHeader = cookieStore.toString();

  if (cookieHeader) {
    requestHeaders.set("cookie", cookieHeader);
  }

  // ✅ إضافة Authorization header
  const token = cookieStore.get("access_token")?.value;

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(`${baseUrl}${normalizedPath}`, {
    ...init,
    headers: requestHeaders,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed: ${res.status} ${text}`);
  }

  return res.json();
}