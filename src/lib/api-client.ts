// hawana-hse-web-admin/src/lib/api-client.ts

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '');

// default timeout (ms)
const DEFAULT_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? 15000);

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ApiError = {
  status: number;
  message?: string | string[];
  error?: string;
};

type ErrorPayload = {
  message?: string | string[];
  error?: string;
  [key: string]: unknown;
};

function buildUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  if (cleanPath.startsWith('/api/')) {
    return cleanPath;
  }

  if (typeof window !== 'undefined') {
    return `/api${cleanPath}`;
  }

  if (API_BASE_URL) {
    return `${API_BASE_URL}/api${cleanPath}`;
  }

  return `/api${cleanPath}`;
}

function normalizeErrorMessage(err: ApiError): string {
  const msg = err?.message;

  if (Array.isArray(msg)) return msg.join(' | ');
  if (typeof msg === 'string' && msg.trim()) return msg;
  if (err?.error) return String(err.error);

  return `Request failed (${err?.status ?? 'unknown'})`;
}

function makeTimeoutError(timeoutMs: number): ApiError {
  return {
    status: 408,
    message: `Request timeout after ${timeoutMs}ms`,
    error: 'RequestTimeout',
  };
}

async function request<T>(
  path: string,
  method: HttpMethod,
  body?: unknown,
  accessToken?: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<T> {
  const url = buildUrl(path);

  const headers: Record<string, string> = {};

  if (method !== 'GET' && method !== 'DELETE') {
    headers['Content-Type'] = 'application/json';
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const hasBody =
    body !== undefined && method !== 'GET' && method !== 'DELETE';

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers,
      credentials: 'include',
      signal: controller.signal,
      body: hasBody
        ? typeof body === 'string'
          ? body
          : JSON.stringify(body)
        : undefined,
    });

    const contentType = response.headers.get('content-type') ?? '';
    const isJson = contentType.includes('application/json');

    if (!response.ok) {
      const payload: ErrorPayload = isJson
        ? await response.json().catch(() => ({}))
        : {};

      const err: ApiError = {
        status: response.status,
        message: payload.message,
        error: payload.error,
      };

      err.message = normalizeErrorMessage(err);
      throw err;
    }

    if (!isJson) {
      return (await response.text()) as unknown as T;
    }

    return (await response.json()) as T;
  } catch (e: unknown) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      const err = makeTimeoutError(timeoutMs);
      err.message = normalizeErrorMessage(err);
      throw err;
    }

    throw e;
  } finally {
    clearTimeout(timer);
  }
}

export const apiClient = {
  get: <T>(path: string, token?: string) =>
    request<T>(path, 'GET', undefined, token),

  post: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, 'POST', body, token),

  put: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, 'PUT', body, token),

  patch: <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, 'PATCH', body, token),

  delete: <T>(path: string, token?: string) =>
    request<T>(path, 'DELETE', undefined, token),
};