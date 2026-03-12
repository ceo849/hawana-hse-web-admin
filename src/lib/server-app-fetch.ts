import { cookies, headers } from "next/headers";

async function getBaseUrl() {
  const h = await headers();

  const host =
    h.get("x-forwarded-host") ||
    h.get("host");

  const proto =
    h.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "production" ? "https" : "http");

  if (!host) {
    throw new Error("Host header missing");
  }

  return `${proto}://${host}`;
}

export async function serverAppFetch(path: string, init?: RequestInit) {
  const cookieStore = await cookies();
  const baseUrl = await getBaseUrl();

  const requestHeaders = new Headers(init?.headers);

  const cookieHeader = cookieStore.toString();

  if (cookieHeader) {
    requestHeaders.set("cookie", cookieHeader);
  }

  const res = await fetch(`${baseUrl}${path}`, {
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