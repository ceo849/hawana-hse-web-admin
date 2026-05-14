import { NextResponse } from "next/server";
import { authCookieOptions } from "@/src/lib/auth-cookie-options";

type LoginBody = {
  email?: string;
  password?: string;
};

const CORE_API = process.env.CORE_API_BASE_URL!.replace(/\/$/, "");

export async function POST(req: Request) {
  try {
    let body: LoginBody = {};

    try {
      body = (await req.json()) as LoginBody;
    } catch {
      return NextResponse.json(
        { ok: false, message: "Invalid request body" },
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

    const upstream = await fetch(`${CORE_API}/v1/auth/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    let data: any = {};
    let rawText = "";

    try {
      rawText = await upstream.text();
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      data = {};
    }

    if (!upstream.ok) {
      return NextResponse.json(
        data?.message
          ? data
          : { ok: false, message: "Authentication failed" },
        { status: upstream.status }
      );
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

    const cookieOptions = authCookieOptions(req.headers, req.url);

    const res = NextResponse.json({
      ok: true,
      accessToken,
    });

    res.cookies.set("access_token", String(accessToken), {
      ...cookieOptions,
      maxAge: 60 * 60 * 24,
    });

    if (refreshToken) {
      res.cookies.set("refresh_token", String(refreshToken), {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 30,
      });
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