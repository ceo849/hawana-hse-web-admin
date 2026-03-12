import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "@/lib/core-api";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value ?? null;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const upstream = await fetch(api("/users"), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const bodyText = await upstream.text();

  return new NextResponse(bodyText, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ??
        "application/json; charset=utf-8",
    },
  });
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value ?? null;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const rawBody = await req.text();

  const upstream = await fetch(api("/users"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: rawBody,
    cache: "no-store",
  });

  const bodyText = await upstream.text();

  return new NextResponse(bodyText, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ??
        "application/json; charset=utf-8",
    },
  });
}