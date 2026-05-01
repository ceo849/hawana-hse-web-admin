// hawana-hse-web-admin/src/lib/api-client.ts

const DEFAULT_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? 15000);

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ApiError = {
  status: number;
  message?: string | string[];
  error?: string;
};

// ✅ Request ID
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ✅ URL Builder (ROOT FIX — NO /v1 mismatch)
function buildUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    throw new Error('Direct external URLs are not allowed');
  }

  let cleanPath = path.startsWith('/') ? path : `/${path}`;

  // ✅ لو جاي /v1/... نحذفه
  if (cleanPath.startsWith('/v1/')) {
    cleanPath = cleanPath.replace(/^\/v1/, '');
  }

  // ✅ enforce /api/*
  if (!cleanPath.startsWith('/api/')) {
    return `/api${cleanPath}`;
  }

  return cleanPath;
}

// ❌ ARCH GUARD — Prevent direct Core access
function enforceArchitecture(url: string) {
  if (
    url.includes(':3001') ||
    url.startsWith('http://') ||
    url.startsWith('https://')
  ) {
    console.error('🚨 ARCHITECTURE VIOLATION');
    console.error('Blocked URL:', url);

    throw new Error(
      'ARCH VIOLATION: Direct Core/external access is forbidden. Use /api proxy.'
    );
  }
}

// ✅ Debug
function debugUrlTrace(url: string) {
  console.log('API →', url);
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
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<T> {
  const url = buildUrl(path);

  enforceArchitecture(url);
  debugUrlTrace(url);

  const headers: Record<string, string> = {};
  const requestId = generateRequestId();
  headers['x-request-id'] = requestId;

  if (method !== 'GET' && method !== 'DELETE') {
    headers['Content-Type'] = 'application/json';
  }

  const hasBody = body !== undefined && method !== 'GET' && method !== 'DELETE';

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers,
      credentials: 'include',
      signal: controller.signal,
      body: hasBody
        ? (typeof body === 'string' ? body : JSON.stringify(body))
        : undefined,
    });

    const contentType = response.headers.get('content-type') ?? '';
    const isJson = contentType.includes('application/json');

    if (!response.ok) {
      const payload = isJson ? await response.json().catch(() => ({})) : {};
      const err: ApiError = { status: response.status, ...(payload ?? {}) };
      (err as any).message = normalizeErrorMessage(err);

      console.error('API ERROR', {
        requestId,
        url,
        method,
        status: response.status,
        payload,
      });

      throw err;
    }

    if (!isJson) {
      return (await response.text()) as unknown as T;
    }

    return (await response.json()) as T;
  } catch (e: any) {
    if (e?.name === 'AbortError') {
      const err = makeTimeoutError(timeoutMs);
      (err as any).message = normalizeErrorMessage(err);

      console.error('API TIMEOUT', {
        requestId,
        url,
        method,
      });

      throw err;
    }

    console.error('API UNKNOWN ERROR', {
      requestId,
      url,
      method,
      error: e,
    });

    throw e;
  } finally {
    clearTimeout(timer);
  }
}

export const apiClient = {
  get: <T>(path: string) =>
    request<T>(path, 'GET'),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, 'POST', body),

  put: <T>(path: string, body: unknown) =>
    request<T>(path, 'PUT', body),

  patch: <T>(path: string, body: unknown) =>
    request<T>(path, 'PATCH', body),

  delete: <T>(path: string) =>
    request<T>(path, 'DELETE'),
};