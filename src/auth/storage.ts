// src/auth/storage.ts

const ACCESS_TOKEN_KEY = 'hawana_access_token';
const REFRESH_TOKEN_KEY = 'hawana_refresh_token';
const ACCESS_TOKEN_COOKIE = 'access_token';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function setAccessTokenCookie(token: string) {
  document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(
    token
  )}; Path=/; SameSite=Lax`;
}

function clearAccessTokenCookie() {
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export const authStorage = {
  getAccessToken(): string | null {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken(token: string): void {
    if (!isBrowser()) return;

    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
    setAccessTokenCookie(token); // Required for Next.js middleware
  },

  clearAccessToken(): void {
    if (!isBrowser()) return;

    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    clearAccessTokenCookie();
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
    clearAccessTokenCookie();
  },
};