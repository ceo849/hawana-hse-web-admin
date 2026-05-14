import { NextRequest, NextResponse } from "next/server";

import { authCookieOptions } from "@/src/lib/auth-cookie-options";

// =======================================================
// ✅ LOGOUT (CLEAN - SINGLE RESPONSIBILITY)
// =======================================================

export async function DELETE(req: NextRequest) {
  try {
    const res = NextResponse.json({ ok: true });

    const cookieOptions = authCookieOptions(req.headers, req.url);

    // Clear access token
    res.cookies.set("access_token", "", {
      ...cookieOptions,
      maxAge: 0,
    });

    // Clear refresh token
    res.cookies.set("refresh_token", "", {
      ...cookieOptions,
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