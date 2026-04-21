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

// ===== MAIN FETCH =====
export async function serverAppFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  enforceServerArchitecture(path);

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("SESSION_EXPIRED");
  }

  // ================================
  // ✅ NEW: API PROXY MODE
  // ================================
  if (isApiRoute(path)) {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}${normalizePath(path)}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        cookie: `access_token=${token}`,
      },
      cache: "no-store",
    });

    if (res.status === 401) {
      throw new Error("SESSION_EXPIRED");
    }

    return res;
  }

  // ================================
  // 🟡 LEGACY: DIRECT CORE MODE
  // ================================
  const CORE_API =
    (process.env.CORE_API_BASE_URL ?? "http://localhost:3001").replace(/\/$/, "");

  const finalUrl = `${CORE_API}/v1${normalizePath(path)}`;

  const res = await fetch(finalUrl, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    throw new Error("SESSION_EXPIRED");
  }

  return res;
}