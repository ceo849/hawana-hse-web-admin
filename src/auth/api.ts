import { apiClient } from '@/src/lib/api-client';

export type AuthResponse = {
  ok: true;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  await apiClient.post('/auth/login', payload);
  return { ok: true };
}

export async function logout(): Promise<void> {
  try {
    await apiClient.delete('/auth/logout');
  } catch {
    // ignore errors (same behavior)
  }
}
