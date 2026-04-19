// src/lib/server-auth.ts

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAccessToken(): Promise<string> {
  // ✅ FIX: cookies() is async in Next.js 16
  const cookieStore = await cookies();

  const token = cookieStore.get("access_token")?.value ?? null;

  if (!token) {
    redirect("/login");
  }

  return token;
}