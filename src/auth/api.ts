import { apiClient } from '@/src/lib/api-client';
import type { LoginRequest, AuthResponse } from './types';

export async function login(
  payload: LoginRequest,
): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>('/auth/login', payload);
}