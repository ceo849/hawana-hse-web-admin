// src/auth/api.ts

import { apiClient } from '@/src/lib/api-client'; // ✅ ADDITIVE

export type AuthResponse = {
  ok: true;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  // ✅ استبدال fetch بـ apiClient
  await apiClient.post('/auth/login', payload);

  return { ok: true };
}

export async function logout(): Promise<void> {
  // ✅ استبدال fetch بـ apiClient
  try {
    await apiClient.post('/auth/logout');
  } catch {
    // نفس السلوك السابق (ignore errors)
  }
}