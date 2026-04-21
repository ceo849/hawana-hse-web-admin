import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const CORE_API =
  (process.env.CORE_API_BASE_URL ?? "http://localhost:3001").replace(/\/$/, "");

type RefreshResponse = {
  access_token?: string;
  accessToken?: string;
};

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value ?? null;

    if (!refreshToken) {
      return NextResponse.json(
        { ok: false, message: "Missing refresh token" },
        { status: 401 }
      );
    }

    const upstream = await fetch(`${CORE_API}/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        refreshToken,
      }),
      cache: "no-store",
    });

    const contentType = upstream.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");

    const data: RefreshResponse | Record<string, unknown> = isJson
      ? await upstream.json().catch(() => ({}))
      : {};

    if (!upstream.ok) {
      const res = NextResponse.json(
        (data as any)?.message
          ? data
          : { ok: false, message: "Refresh failed" },
        { status: upstream.status }
      );

      const isProd = process.env.NODE_ENV === "production";

      res.cookies.set("access_token", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        path: "/",
        maxAge: 0,
      });

      res.cookies.set("refresh_token", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: isProd,
        path: "/",
        maxAge: 0,
      });

      return res;
    }

    const accessToken =
      (data as RefreshResponse)?.access_token ||
      (data as RefreshResponse)?.accessToken ||
      null;

    if (!accessToken) {
      return NextResponse.json(
        { ok: false, message: "Missing access token from backend" },
        { status: 500 }
      );
    }

    const res = NextResponse.json({
      ok: true,
      access_token: String(accessToken),
    });

    const isProd = process.env.NODE_ENV === "production";

    res.cookies.set("access_token", String(accessToken), {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return res;
  } catch (error) {
    console.error("[REFRESH_ROUTE_FATAL]", error);

    return NextResponse.json(
      { ok: false, message: "Refresh route error" },
      { status: 500 }
    );
  }
}