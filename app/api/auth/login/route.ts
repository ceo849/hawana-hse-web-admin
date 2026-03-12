import { NextResponse } from "next/server";
import { api } from "@/lib/core-api";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(req: Request) {
  try {
    let body: LoginBody = {};

    try {
      body = (await req.json()) as LoginBody;
    } catch {
      return NextResponse.json(
        { ok: false, message: "Invalid or empty request body" },
        { status: 400 },
      );
    }

    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, message: "Email and password are required" },
        { status: 400 },
      );
    }

    const upstream = await fetch(api("/auth/login"), {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return NextResponse.json(data, { status: upstream.status });
    }

    const accessToken = String(
      (data as any).access_token ?? (data as any).accessToken ?? "",
    );

    const refreshToken =
      (data as any).refresh_token ?? (data as any).refreshToken ?? null;

    if (!accessToken) {
      return NextResponse.json(
        { ok: false, message: "Missing access token from backend" },
        { status: 500 },
      );
    }

    const res = NextResponse.json({ ok: true });

    const cookieOptions = {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: true,
      path: "/",
      domain: "hawanaglobal.com",
    };

    res.cookies.set("access_token", accessToken, cookieOptions);

    if (refreshToken) {
      res.cookies.set("refresh_token", String(refreshToken), cookieOptions);
    }

    return res;
  } catch (error) {
    console.error("Login route error:", error);

    return NextResponse.json(
      { ok: false, message: "Login route error" },
      { status: 500 },
    );
  }
}