import { headers, cookies } from "next/headers";

type ServerAppFetchOptions = RequestInit;

// ===== ARCH GUARD =====
function enforceServerArchitecture(path: string) {
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.includes(":3001")
  ) {
    throw new Error("ARCH_VIOLATION: ABSOLUTE_OR_CORE_URL_BLOCKED");
  }

  if (!path.startsWith("/api/")) {
    throw new Error("ARCH_VIOLATION: PROXY_ONLY_PATH_REQUIRED");
  }
}

// ===== Normalize Path =====
function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

// ===== Convert /api → /v1 =====
function toCorePath(path: string): string {
  return path.replace(/^\/api/, "/v1");
}

// ===== Extract Token (FIXED) =====
async function extractToken(): Promise<string | null> {
  const store = await cookies();
  return store.get("access_token")?.value ?? null;
}

// ===== Base URL (STABLE) =====
async function getBaseUrl(): Promise<string> {
  // 1) Core direct (Docker / Production internal)
  if (process.env.CORE_API_BASE_URL) {
    return process.env.CORE_API_BASE_URL.replace(/\/$/, "");
  }

  // 2) SSR → Proxy via host
  const h = await headers();
  const host = h.get("host");

  if (host) {
    return `http://${host}`;
  }

  // 3) Fallback (still proxy-safe via /api in path)
  return "http://localhost:3005";
}

// ===== Session =====
function throwSessionExpired(): never {
  throw new Error("SESSION_EXPIRED");
}

// ===== MAIN =====
export async function serverAppFetch(
  path: string,
  arg2?: ServerAppFetchOptions | string,
  arg3?: ServerAppFetchOptions
): Promise<Response> {
  enforceServerArchitecture(path);

  let options: ServerAppFetchOptions = {};

  if (typeof arg2 === "string" && arg3) {
    options = arg3;
  } else if (typeof arg2 === "object") {
    options = arg2 || {};
  }

  const isCoreDirect = !!process.env.CORE_API_BASE_URL;

  const baseUrl = await getBaseUrl();

  const finalPath = isCoreDirect
    ? toCorePath(normalizePath(path))
    : normalizePath(path);

  const finalUrl = `${baseUrl}${finalPath}`;

  console.log("FINAL_URL:", finalUrl);

  const token = await extractToken();

  const res = await fetch(finalUrl, {
    ...options,
    headers: {
      ...Object.fromEntries(new Headers(options.headers || {})),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    throwSessionExpired();
  }

  return res;
}