import { cookies, headers } from "next/headers";

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

// ===== Base URL (✅ FIX DOCKER NETWORK) =====
async function getWebBaseUrl(): Promise<string> {
  // ✅ 1) Docker internal routing (PRIMARY)
  if (process.env.APP_BASE_URL) {
    return process.env.APP_BASE_URL;
  }

  // ✅ 2) SSR header fallback (local/dev/browser)
  const h = await headers();
  const host = h.get("host");

  if (host) {
    return `http://${host}`;
  }

  // ✅ 3) Final fallback (Docker service name)
  return "http://web:3000";
}

// ===== Session =====
function throwSessionExpired(): never {
  throw new Error("SESSION_EXPIRED");
}

// ===== Cookie Header =====
async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

// ===== MAIN EXPORT (✅ SUPPORT OLD + NEW SIGNATURE) =====
export async function serverAppFetch(
  path: string,
  arg2?: ServerAppFetchOptions | string,
  arg3?: ServerAppFetchOptions
): Promise<Response> {
  enforceServerArchitecture(path);

  let options: ServerAppFetchOptions = {};

  // ✅ دعم الشكل القديم: (path, token, options)
  if (typeof arg2 === "string" && arg3) {
    options = arg3;
  }
  // ✅ دعم الشكل الجديد: (path, options)
  else if (typeof arg2 === "object") {
    options = arg2 || {};
  }

  const baseUrl = await getWebBaseUrl();
  const finalUrl = `${baseUrl}${normalizePath(path)}`;

  const cookieHeader = await getCookieHeader();

  const res = await fetch(finalUrl, {
    ...options,
    headers: {
      ...Object.fromEntries(new Headers(options.headers || {})),
      cookie: cookieHeader,
    },
    credentials: "include",
    cache: "no-store",
  });

  if (res.status === 401) {
    throwSessionExpired();
  }

  return res;
}