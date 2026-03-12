import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const CORE_API =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://hawana-core:3001").replace(/\/$/, "");

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const page = url.searchParams.get("page") ?? "1";
    const limit = url.searchParams.get("limit") ?? "20";

    const upstream = new URL(`${CORE_API}/api/v1/safety-reports`);
    upstream.searchParams.set("page", page);
    upstream.searchParams.set("limit", limit);

    const r = await fetch(upstream.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const text = await r.text();

    return new NextResponse(text, {
      status: r.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return NextResponse.json({ message: "Proxy error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const r = await fetch(`${CORE_API}/api/v1/safety-reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const text = await r.text();

    return new NextResponse(text, {
      status: r.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return NextResponse.json({ message: "Proxy error" }, { status: 500 });
  }
}
