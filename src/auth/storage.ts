// src/auth/storage.ts

/**
 * @deprecated
 * DO NOT USE.
 *
 * ⚠️ SECURITY & ARCHITECTURE POLICY:
 * - Tokens MUST be handled via HttpOnly cookies ONLY.
 * - localStorage usage is FORBIDDEN in Hawana HSE.
 * - This file is kept temporarily for backward compatibility ONLY.
 *
 * Status: DISABLED (SAFE NO-OP IMPLEMENTATION)
 */

const ACCESS_TOKEN_KEY = 'hawana_access_token';
const REFRESH_TOKEN_KEY = 'hawana_refresh_token';
const ACCESS_TOKEN_COOKIE = 'access_token';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

// ⚠️ DISABLED — DO NOT USE
function setAccessTokenCookie(_token: string) {
  // intentionally disabled
}

// ⚠️ DISABLED — DO NOT USE
function clearAccessTokenCookie() {
  // intentionally disabled
}

export const authStorage = {
  // ❌ DISABLED
  getAccessToken(): string | null {
    return null;
  },

  // ❌ DISABLED
  setAccessToken(_token: string): void {
    // no-op
  },

  // ❌ DISABLED
  clearAccessToken(): void {
    // no-op
  },

  // ❌ DISABLED
  getRefreshToken(): string | null {
    return null;
  },

  // ❌ DISABLED
  setRefreshToken(_token: string): void {
    // no-op
  },

  // ❌ DISABLED
  clearRefreshToken(): void {
    // no-op
  },

  // ❌ DISABLED
  clearAll(): void {
    // no-op
  },
};