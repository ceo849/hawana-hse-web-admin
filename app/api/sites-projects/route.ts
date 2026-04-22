import { NextRequest, NextResponse } from "next/server";

const CORE_BASE_URL = (
  process.env.CORE_API_BASE_URL ?? "http://localhost:3001"
).replace(/\/$/, "");

// ✅ Contract ثابت
const API_PREFIX = "/v1";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const search = req.nextUrl.searchParams.toString();
  const url = search
    ? `${CORE_BASE_URL}${API_PREFIX}/sites-projects?${search}`
    : `${CORE_BASE_URL}${API_PREFIX}/sites-projects`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const text = await res.text();

  return new NextResponse(text, {
    status: res.status,
    headers: {
      "Content-Type":
        res.headers.get("content-type") || "application/json",
    },
  });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.text();

  const res = await fetch(`${CORE_BASE_URL}${API_PREFIX}/sites-projects`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body,
    cache: "no-store",
  });

  const text = await res.text();

  return new NextResponse(text, {
    status: res.status,
    headers: {
      "Content-Type":
        res.headers.get("content-type") || "application/json",
    },
  });
}