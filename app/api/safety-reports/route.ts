import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "@/lib/core-api";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();

  const token = cookieStore.get("access_token")?.value;

  // ✅ DEBUG (تشخيص حقيقي)
  console.log("=== SAFETY REPORTS DEBUG ===");
  console.log("TOKEN:", token);
  console.log("HAS TOKEN:", !!token);
  console.log("COOKIES:", cookieStore.getAll());

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const urlObj = new URL(req.url);
  const qs = urlObj.search ?? "";

  // ✅ URL كامل
  const base = await api("/safety-reports");
  const finalUrl = `${base}${qs}`;

  const upstream = await fetch(finalUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const text = await upstream.text();

  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ??
        "application/json; charset=utf-8",
    },
  });
}