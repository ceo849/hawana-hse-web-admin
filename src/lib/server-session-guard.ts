// src/lib/server-session-guard.ts

import { NextResponse } from "next/server";

// ===== Clear Session (Correct Way) =====
export function clearSessionCookies(res: NextResponse) {
  const isProd = process.env.NODE_ENV === "production";

  const baseOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProd,
    path: "/",
  };

  res.cookies.set("access_token", "", {
    ...baseOptions,
    maxAge: 0,
  });

  res.cookies.set("refresh_token", "", {
    ...baseOptions,
    maxAge: 0,
  });

  return res;
}