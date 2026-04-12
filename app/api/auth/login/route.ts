import { NextResponse } from "next/server";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(req: Request) {
  try {
    let body: LoginBody = {};

    // Parse body safely
    try {
      body = (await req.json()) as LoginBody;
    } catch {
      return NextResponse.json(
        { ok: false, message: "Invalid or empty request body" },
        { status: 400 }
      );
    }

    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // ✅ Unified Core API base (Gateway Rule)
    const coreBase =
      process.env.CORE_API_BASE_URL || "http://localhost:3001/v1";

    // ✅ Build final URL safely (no double /v1 bugs)
    const loginUrl = coreBase.endsWith("/v1")
      ? `${coreBase}/auth/login`
      : `${coreBase}/v1/auth/login`;

    // 🔍 Debug (important for Runbook)
    console.log("[LOGIN_PROXY] →", loginUrl);

    const upstream = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    let data: any = {};
    try {
      data = await upstream.json();
    } catch {
      data = {};
    }

    if (!upstream.ok) {
      console.error("[LOGIN_PROXY_ERROR]", data);
      return NextResponse.json(data, { status: upstream.status });
    }

    const accessToken =
      data?.access_token || data?.accessToken || null;

    const refreshToken =
      data?.refresh_token || data?.refreshToken || null;

    if (!accessToken) {
      return NextResponse.json(
        { ok: false, message: "Missing access token from backend" },
        { status: 500 }
      );
    }

    const res = NextResponse.json({ ok: true });

    // ✅ Production-safe cookies
    const isProd = process.env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: isProd, // ✔ Production HTTPS only
      path: "/",
    };

    res.cookies.set("access_token", accessToken, cookieOptions);

    if (refreshToken) {
      res.cookies.set("refresh_token", String(refreshToken), cookieOptions);
    }

    return res;
  } catch (error) {
    console.error("[LOGIN_ROUTE_FATAL]", error);

    return NextResponse.json(
      { ok: false, message: "Login route error" },
      { status: 500 }
    );
  }
}