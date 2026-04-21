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
  return path.startsWith("/") ? path : `/${path}`;
}

// ===== Detect API Proxy =====
function isApiRoute(path: string): boolean {
  return path.startsWith("/api/");
}

// ===== Base URL for internal Web SSR → /api =====
function getWebBaseUrl(): string {
  return (
    process.env.APP_BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

// ===== Refresh via API Proxy =====
async function refreshAccessTokenViaProxy(
  refreshToken: string,
  accessToken?: string
): Promise<string | null> {
  try {
    const baseUrl = getWebBaseUrl();

    const cookieParts = [`refresh_token=${refreshToken}`];
    if (accessToken) {
      cookieParts.push(`access_token=${accessToken}`);
    }

    const res = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: "POST",
      headers: {
        cookie: cookieParts.join("; "),
      },
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

  // ===== Backward-compatible overload support =====
  if (typeof arg2 === "string" && arg3) {
    token = arg2;
    options = arg3;
  } else if (typeof arg2 === "string") {
    token = arg2;
  } else if (typeof arg2 === "object") {
    options = arg2 || {};
  }

  enforceServerArchitecture(path);

  const cookieStore = await cookies();

  if (!token) {
    token = cookieStore.get("access_token")?.value;
  }

  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!token) {
    throw new Error("SESSION_EXPIRED");
  }

  // ================================
  // ✅ NEW: API PROXY MODE
  // ================================
  if (isApiRoute(path)) {
    const baseUrl = getWebBaseUrl();
    const finalUrl = `${baseUrl}${normalizePath(path)}`;

    const buildProxyHeaders = (accessToken: string): HeadersInit => {
      const cookieParts = [`access_token=${accessToken}`];

      if (refreshToken) {
        cookieParts.push(`refresh_token=${refreshToken}`);
      }

      return {
        ...(options.headers || {}),
        cookie: cookieParts.join("; "),
      };
    };

    let res = await fetch(finalUrl, {
      ...options,
      headers: buildProxyHeaders(token),
      cache: "no-store",
    });

    if (res.status === 401) {
      if (!refreshToken) {
        throw new Error("SESSION_EXPIRED");
      }

      const newToken = await refreshAccessTokenViaProxy(refreshToken, token);

      if (!newToken) {
        throw new Error("SESSION_EXPIRED");
      }

      res = await fetch(finalUrl, {
        ...options,
        headers: buildProxyHeaders(newToken),
        cache: "no-store",
      });

      if (res.status === 401) {
        throw new Error("SESSION_EXPIRED");
      }
    }

    return res;
  }

  // ================================
  // 🟡 LEGACY: DIRECT CORE MODE
  // ================================
  const CORE_API =
    (process.env.CORE_API_BASE_URL ?? "http://localhost:3001").replace(/\/$/, "");

  const finalUrl = `${CORE_API}/v1${normalizePath(path)}`;

  const buildCoreHeaders = (accessToken: string): HeadersInit => {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
      Authorization: `Bearer ${accessToken}`,
    };

    if (
      options.method &&
      options.method !== "GET" &&
      options.method !== "DELETE" &&
      !headers["Content-Type"] &&
      !headers["content-type"]
    ) {
      headers["Content-Type"] = "application/json";
    }

    return headers;
  };

  let res = await fetch(finalUrl, {
    ...options,
    headers: buildCoreHeaders(token),
    cache: "no-store",
  });

  if (res.status === 401) {
    if (!refreshToken) {
      throw new Error("SESSION_EXPIRED");
    }

    const newToken = await refreshAccessTokenViaProxy(refreshToken, token);

    if (!newToken) {
      throw new Error("SESSION_EXPIRED");
    }

    res = await fetch(finalUrl, {
      ...options,
      headers: buildCoreHeaders(newToken),
      cache: "no-store",
    });

    if (res.status === 401) {
      throw new Error("SESSION_EXPIRED");
    }
  }

  return res;
}