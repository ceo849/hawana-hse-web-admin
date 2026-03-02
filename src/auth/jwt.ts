export type JwtPayload = {
  sub?: string;
  email?: string;
  role?: string;
  companyId?: string;
  iat?: number;
  exp?: number;
};

function base64UrlToString(input: string): string {
  const pad = '='.repeat((4 - (input.length % 4)) % 4);
  const base64 = (input + pad)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  return atob(base64);
}

export function decodeJwtPayload(token?: string | null): JwtPayload | null {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length < 2) return null;

  try {
    const json = base64UrlToString(parts[1]);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}