import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// ===== Clear Session (Universal Safe) =====
export async function clearSessionCookies(res?: NextResponse) {
  const isProd = process.env.NODE_ENV === "production";

  const baseOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProd,
    path: "/",
  };

  // =========================
  // API ROUTE MODE
  // =========================
  if (res) {
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

  // =========================
  // SSR MODE (Next 13+ / 16 fix)
  // =========================
  const cookieStore = await cookies();

  cookieStore.set("access_token", "", {
    ...baseOptions,
    maxAge: 0,
  });

  cookieStore.set("refresh_token", "", {
    ...baseOptions,
    maxAge: 0,
  });
}