// src/auth/api.ts
import { apiFetch } from "@/src/lib/api";
import type { LoginRequest, AuthResponse } from "./types";

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}