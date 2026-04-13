import { cookies } from "next/headers";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function serverAppFetch(
  path: string,
  init?: RequestInit,
) {
  const cookieStore = await cookies();

  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("401 Unauthorized");
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(`${BASE_URL}${normalizedPath}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`, // ✅ هنا الحل
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    throw new Error("401 Unauthorized");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed: ${res.status} ${text}`);
  }

  return res.json();
}