// src/lib/server-app-fetch.ts

import { cookies } from "next/headers";
import { clearSessionCookies } from "@/src/lib/server-session-guard";

// ===== ARCH GUARD =====
function enforceServerArchitecture(path: string) {
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.includes(":3001") ||
    path.includes("/v1/")
  ) {
    console.error("🚨 SERVER ARCH VIOLATION");
    console.error("Blocked path:", path);

    throw new Error(
      "ARCH VIOLATION: Must use API Proxy only (Web → API → Core)"
    );
  }
}

// ===== Normalize Path =====
function normalizePath(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;

  if (clean.startsWith("/api/")) {
    return clean.replace(/^\/api/, "");
  }

  return clean;
}

// ===== Refresh Token =====
async function refreshAccessToken(): Promise<string | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: "POST",
      cache: "no-store",
    });

    if (!res.ok) return null;

    const cookieStore = await cookies();
    return cookieStore.get("access_token")?.value ?? null;
  } catch {
    return null;
  }
}

// ===== MAIN FETCH =====
export async function serverAppFetch(
  path: string,
  arg2?: RequestInit | string,
  arg3?: RequestInit
): Promise<Response> {
  let token: string | undefined;
  let options: RequestInit = {};

  // overload handling
  if (typeof arg2 === "string" && arg3) {
    token = arg2;
    options = arg3;
  } else if (typeof arg2 === "string") {
    token = arg2;
  } else if (typeof arg2 === "object") {
    options = arg2 || {};
  }

  const cookieStore = await cookies();

  if (!token) {
    token = cookieStore.get("access_token")?.value;
  }

  // ❌ No token → Session انتهت
  if (!token) {
    await clearSessionCookies();
    throw new Error("SESSION_EXPIRED");
  }

  enforceServerArchitecture(path);

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const finalUrl = `${baseUrl}/api${normalizePath(path)}`;

  const buildHeaders = (t: string): Record<string, string> => {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
      Authorization: `Bearer ${t}`,
    };

    if (
      options.method &&
      options.method !== "GET" &&
      options.method !== "DELETE"
    ) {
      headers["Content-Type"] = "application/json";
    }

    return headers;
  };

  // ===== FIRST REQUEST =====
  let res = await fetch(finalUrl, {
    ...options,
    headers: buildHeaders(token),
    cache: "no-store",
  });

  // ===== AUTO REFRESH =====
  if (res.status === 401) {
    console.warn("[AUTO_REFRESH_TRIGGERED]");

    const newToken = await refreshAccessToken();

    // ❌ Refresh فشل → Logout
    if (!newToken) {
      await clearSessionCookies();
      throw new Error("SESSION_EXPIRED");
    }

    // 🔁 Retry
    res = await fetch(finalUrl, {
      ...options,
      headers: buildHeaders(newToken),
      cache: "no-store",
    });

    // ❌ Still 401 → Logout
    if (res.status === 401) {
      await clearSessionCookies();
      throw new Error("SESSION_EXPIRED");
    }
  }

  return res;
}