import { NextRequest, NextResponse } from "next/server";

// =======================================================
// ✅ LOGOUT (CLEAN - SINGLE RESPONSIBILITY)
// =======================================================

export async function DELETE(req: NextRequest) {
  try {
    const res = NextResponse.json({ ok: true });

    const isProd = process.env.NODE_ENV === "production";

    // Clear access token
    res.cookies.set("access_token", "", {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: 0,
    });

    // Clear refresh token
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