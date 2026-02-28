// hawana-hse-web-admin/src/lib/api-client.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<T>(
  path: string,
  method: HttpMethod,
  body?: unknown,
  accessToken?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      ...error,
    };
  }

  return response.json() as Promise<T>;
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