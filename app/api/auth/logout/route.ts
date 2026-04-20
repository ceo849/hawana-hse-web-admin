import { NextRequest, NextResponse } from "next/server";


// =======================================================
// ✅ ADDITIVE: REAL LOGOUT (CORRECT FLOW)
// =======================================================

export async function DELETE(req: NextRequest) {
  try {
    const res = NextResponse.json({ ok: true });

    const isProd = process.env.NODE_ENV === "production";

    // ✅ Clear cookies
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
  } catch (error) {
    console.error("[LOGOUT_ROUTE_FATAL]", error);

    return NextResponse.json(
      { message: "Logout route error" },
      { status: 500 }
    );
  }
}


// =======================================================
// ❌ EXISTING (WRONG) LOGIN LOGIC — NOT TOUCHED
// =======================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const upstream = await fetch("http://localhost:3001/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return NextResponse.json(data, { status: upstream.status });
    }

    const res = NextResponse.json({ ok: true });

    res.cookies.set("access_token", data.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
    });

    res.cookies.set("refresh_token", data.refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
    });

    return res;
  } catch {
    return NextResponse.json(
      { message: "Login route error" },
      { status: 500 }
    );
  }
}