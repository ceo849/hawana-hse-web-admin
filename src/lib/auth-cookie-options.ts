export type AuthCookieBaseOptions = {
  httpOnly: true;
  sameSite: "lax" | "none";
  secure: boolean;
  path: string;
  domain?: string;
};

/**
 * Extract hostname safely from headers (supports proxies like Nginx)
 */
function hostnameFromHeaders(h: Headers): string {
  const forwardedHost = h
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();

  const host = forwardedHost || h.get("host") || "";

  // remove port if exists
  return host.split(":")[0].toLowerCase();
}

/**
 * Detect HTTPS correctly (proxy-aware)
 */
function isHttps(h: Headers, requestUrl?: string): boolean {
  const forwardedProto = h
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();

  if (forwardedProto === "https") return true;

  if (requestUrl) {
    try {
      return new URL(requestUrl).protocol === "https:";
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Only allow domain cookie in real production domain over HTTPS
 */
function resolveCookieDomain(
  hostname: string,
  secure: boolean
): string | undefined {
  if (!secure) return undefined;

  if (
    hostname === "hawanaglobal.com" ||
    hostname.endsWith(".hawanaglobal.com")
  ) {
    return ".hawanaglobal.com";
  }

  return undefined;
}

/**
 * ✅ MAIN: Build cookie options based on REAL request (NOT NODE_ENV)
 */
export function authCookieOptions(
  h: Headers,
  requestUrl?: string
): AuthCookieBaseOptions {
  const secure = isHttps(h, requestUrl);
  const hostname = hostnameFromHeaders(h);
  const domain = resolveCookieDomain(hostname, secure);

  return {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/",
    ...(domain ? { domain } : {}),
  };
}