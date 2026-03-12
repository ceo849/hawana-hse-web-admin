import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const accessToken = cookieStore.get("access_token")?.value ?? null;
  const refreshToken = cookieStore.get("refresh_token")?.value ?? null;

  const cookieHeader = headerStore.get("cookie");

  return NextResponse.json({
    ok: true,

    request: {
      host: headerStore.get("host"),
      forwardedHost: headerStore.get("x-forwarded-host"),
      forwardedProto: headerStore.get("x-forwarded-proto"),
    },

    cookieHeaderPresent: Boolean(cookieHeader),

    cookiesSeenByNext: cookieStore.getAll().map((c) => ({
      name: c.name,
      valuePreview: c.value ? `${c.value.slice(0, 12)}...` : "",
    })),

    accessTokenPresent: Boolean(accessToken),
    refreshTokenPresent: Boolean(refreshToken),
  });
}
