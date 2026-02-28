// src/auth/storage.ts
const ACCESS_TOKEN_KEY = 'hawana_access_token';
const REFRESH_TOKEN_KEY = 'hawana_refresh_token';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export const authStorage = {
  getAccessToken(): string | null {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken(token: string): void {
    if (!isBrowser()) return;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  clearAccessToken(): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(token: string): void {
    if (!isBrowser()) return;
    window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  clearRefreshToken(): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  clearAll(): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};