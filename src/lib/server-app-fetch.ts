// src/lib/server-app-fetch.ts

import { cookies } from "next/headers";

export async function serverAppFetch(
  path: string,
  arg2?: RequestInit | string,
  arg3?: RequestInit
) {
  let token: string | undefined;
  let options: RequestInit = {};

  // ✅ case 1: (path, token, options)
  if (typeof arg2 === "string" && arg3) {
    token = arg2;
    options = arg3;
  }

  // ✅ case 2: (path, token)
  else if (typeof arg2 === "string") {
    token = arg2;
  }

  // ✅ case 3: (path, options)
  else if (typeof arg2 === "object") {
    options = arg2 || {};
  }

  // ✅ fallback: token من الكوكيز
  if (!token) {
    const cookieStore = await cookies();
    token = cookieStore.get("access_token")?.value;
  }

  if (!token) {
    throw new Error("Missing access token");
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:3001";

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  return res;
}