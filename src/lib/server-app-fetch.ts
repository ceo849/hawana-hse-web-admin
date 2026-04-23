import { cookies } from "next/headers";

type ServerAppFetchOptions = RequestInit;

// ===== ARCH GUARD =====
function enforceServerArchitecture(path: string) {
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.includes(":3001")
  ) {
    console.error("🚨 SERVER ARCH VIOLATION");
    console.error("Blocked path:", path);

    throw new Error("ARCH_VIOLATION: ABSOLUTE_OR_CORE_URL_BLOCKED");
  }

  if (!path.startsWith("/api/")) {
    console.error("🚨 SERVER ARCH VIOLATION");
    console.error("Proxy-only path required. Blocked path:", path);

    throw new Error("ARCH_VIOLATION: PROXY_ONLY_PATH_REQUIRED");
  }
}

// ===== Normalize Path =====
function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

// ===== Base URL for internal Web SSR → /api =====
function getWebBaseUrl(): string {
  const baseUrl =
    process.env.APP_BASE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000";

  return baseUrl.replace(/\/$/, "");
}

// ===== Central Session Signal =====
function throwSessionExpired(): never {
  throw new Error("SESSION_EXPIRED");
}

// ===== Body Normalization =====
function normalizeRequestBody(
  options: ServerAppFetchOptions
): ServerAppFetchOptions {
  if (!options.body) {
    return options;
  }

  const isStringBody =
    typeof options.body === "string" ||
    options.body instanceof FormData ||
    options.body instanceof URLSearchParams ||
    options.body instanceof Blob ||
    options.body instanceof ArrayBuffer;

  if (isStringBody) {
    return options;
  }

  const headers = new Headers(options.headers || {});
  const hasContentType =
    headers.has("Content-Type") || headers.has("content-type");

  if (!hasContentType) {
    headers.set("Content-Type", "application/json");
  }

  return {
    ...options,
    headers,
    body: JSON.stringify(options.body),
  };
}

// ===== Cookie Header Builder =====
function buildCookieHeader(
  accessToken?: string,
  refreshToken?: string
): string | null {
  const cookieParts: string[] = [];

  if (accessToken) {
    cookieParts.push(`access_token=${accessToken}`);
  }

  if (refreshToken) {
    cookieParts.push(`refresh_token=${refreshToken}`);
  }

  return cookieParts.length > 0 ? cookieParts.join("; ") : null;
}

// ===== Proxy Headers =====
function buildProxyHeaders(
  options: ServerAppFetchOptions,
  accessToken?: string,
  refreshToken?: string
): Headers {
  const headers = new Headers(options.headers || {});
  const cookieHeader = buildCookieHeader(accessToken, refreshToken);

  if (cookieHeader) {
    headers.set("cookie", cookieHeader);
  }

  return headers;
}

// ===== Refresh via API Proxy =====
async function refreshAccessTokenViaProxy(
  refreshToken: string,
  accessToken?: string
): Promise<string | null> {
  try {
    const baseUrl = getWebBaseUrl();
    const cookieHeader = buildCookieHeader(accessToken, refreshToken);

    const res = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: "POST",
      headers: cookieHeader ? { cookie: cookieHeader } : {},
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json().catch(() => ({}));

    return data?.access_token || data?.accessToken || null;
  } catch {
    return null;
  }
}

// ===== MAIN FETCH =====
export async function serverAppFetch(
  path: string,
  arg2?: ServerAppFetchOptions | string,
  arg3?: ServerAppFetchOptions
): Promise<Response> {
  let token: string | undefined;
  let options: ServerAppFetchOptions = {};

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

  const accessTokenFromCookie = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!token) {
    token = accessTokenFromCookie;
  }

  // ===== IMPORTANT FIX =====
  // If access token is missing but refresh token exists,
  // try refresh first instead of killing session immediately.
  if (!token && refreshToken) {
    const refreshedToken = await refreshAccessTokenViaProxy(refreshToken);

    if (refreshedToken) {
      token = refreshedToken;
    }
  }

  if (!token) {
    throwSessionExpired();
  }

  const normalizedOptions = normalizeRequestBody(options);
  const baseUrl = getWebBaseUrl();
  const finalUrl = `${baseUrl}${normalizePath(path)}`;

  let res = await fetch(finalUrl, {
    ...normalizedOptions,
    headers: buildProxyHeaders(normalizedOptions, token, refreshToken),
    cache: "no-store",
  });

  if (res.status === 401) {
    if (!refreshToken) {
      throwSessionExpired();
    }

    const newToken = await refreshAccessTokenViaProxy(refreshToken, token);

    if (!newToken) {
      throwSessionExpired();
    }

    res = await fetch(finalUrl, {
      ...normalizedOptions,
      headers: buildProxyHeaders(normalizedOptions, newToken, refreshToken),
      cache: "no-store",
    });

    if (res.status === 401) {
      throwSessionExpired();
    }
  }

  return res;
}