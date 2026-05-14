import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

import { authCookieOptions } from "@/src/lib/auth-cookie-options";

export async function GET() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const accessToken = cookieStore.get("access_token")?.value ?? null;
  const refreshToken = cookieStore.get("refresh_token")?.value ?? null;

  const cookieHeader = headerStore.get("cookie");

  const nodeEnv = process.env.NODE_ENV ?? "(undefined)";
  const coreApiBaseUrl = process.env.CORE_API_BASE_URL ?? null;

  const forwardedProto =
    headerStore.get("x-forwarded-proto") ??
    headerStore.get("X-Forwarded-Proto") ??
    null;

  /** What Next sees for the incoming request (reverse proxies set x-forwarded-proto). */
  const requestConsideredSecure = forwardedProto === "https";

  /** Matches `authCookieOptions()` used by login / refresh / logout. */
  const loginRouteCookieFlags = authCookieOptions(headerStore);

  const cookieBlockingNotes: string[] = [];

  if (!loginRouteCookieFlags.secure) {
    cookieBlockingNotes.push(
      "Auth cookies use Secure=false (no HTTPS / x-forwarded-proto: https); SameSite=lax — OK for same-origin HTTP (e.g. local Docker)."
    );
  }

  return NextResponse.json({
    ok: true,

    env: {
      NODE_ENV: nodeEnv,
      CORE_API_BASE_URL: coreApiBaseUrl,
    },

    request: {
      host: headerStore.get("host"),
      forwardedHost: headerStore.get("x-forwarded-host"),
      forwardedProto,
      requestConsideredSecure,
    },

    loginRouteCookieFlags,
    cookieBlockingNotes,

    cookieHeaderPresent: Boolean(cookieHeader),

    cookiesSeenByNext: cookieStore.getAll().map((c) => ({
      name: c.name,
      valuePreview: c.value ? `${c.value.slice(0, 12)}...` : "",
    })),

    accessTokenPresent: Boolean(accessToken),
    refreshTokenPresent: Boolean(refreshToken),
  });
}
