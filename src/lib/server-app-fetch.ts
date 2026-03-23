import { cookies } from "next/headers";

async function getBaseUrl() {
  return "http://127.0.0.1:3000";
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