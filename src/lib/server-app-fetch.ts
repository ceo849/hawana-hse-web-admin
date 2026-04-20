import { cookies } from "next/headers";

// ===== ARCH GUARD =====
function enforceServerArchitecture(path: string) {
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.includes(":3001")
  ) {
    console.error("🚨 SERVER ARCH VIOLATION");
    console.error("Blocked path:", path);

    throw new Error("ARCH VIOLATION: Invalid path usage");
  }
}

// ===== Normalize Path =====
function normalizePath(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean;
}

// ===== Refresh Token =====
async function refreshAccessToken(
  refreshToken: string
): Promise<string | null> {
  try {
    const CORE_API =
      (process.env.CORE_API_BASE_URL ?? "http://localhost:3001").replace(/\/$/, "");

    const res = await fetch(`${CORE_API}/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ✅ ADDITIVE
      },
      body: JSON.stringify({
        refreshToken, // ✅ ROOT FIX
      }),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json().catch(() => ({}));

    return data?.access_token || data?.accessToken || null;
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

  // overload
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

  const refreshToken = cookieStore.get("refresh_token")?.value;

  // ❌ No token
  if (!token) {
    throw new Error("SESSION_EXPIRED");
  }

  enforceServerArchitecture(path);

  const CORE_API =
    (process.env.CORE_API_BASE_URL ?? "http://localhost:3001").replace(/\/$/, "");

  const finalUrl = `${CORE_API}/v1${normalizePath(path)}`;

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

    if (!refreshToken) {
      throw new Error("SESSION_EXPIRED");
    }

    const newToken = await refreshAccessToken(refreshToken);

    if (!newToken) {
      throw new Error("SESSION_EXPIRED");
    }

    // 🔁 Retry (مرة واحدة فقط)
    res = await fetch(finalUrl, {
      ...options,
      headers: buildHeaders(newToken),
      cache: "no-store",
    });

    if (res.status === 401) {
      throw new Error("SESSION_EXPIRED");
    }
  }

  return res;
}