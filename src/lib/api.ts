// WEB-ADMIN — src/lib/api.ts

import { apiClient } from '@/src/lib/api-client';

type ApiFetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

function normalizePath(path: string): string {
  // ✅ enforce API Proxy contract (no /api here)
  if (path.startsWith("/api")) {
    return path.replace(/^\/api/, "");
  }

  return path.startsWith("/") ? path : `/${path}`;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();

  // ✅ normalized path (critical to avoid /api/api issue)
  const normalizedPath = normalizePath(path);

  try {
    switch (method) {
      case "POST":
        return await apiClient.post<T>(
          normalizedPath,
          options.body ? JSON.parse(String(options.body)) : undefined
        );

      case "PUT":
        return await apiClient.put<T>(
          normalizedPath,
          options.body ? JSON.parse(String(options.body)) : undefined
        );

      case "PATCH":
        return await apiClient.patch<T>(
          normalizedPath,
          options.body ? JSON.parse(String(options.body)) : undefined
        );

      case "DELETE":
        return await apiClient.delete<T>(normalizedPath);

      case "GET":
      default:
        return await apiClient.get<T>(normalizedPath);
    }
  } catch (err) {
    throw err;
  }
}