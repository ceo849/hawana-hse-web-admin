import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const CORE_API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:3001";

function getToken(cookieStore: any) {
  return cookieStore.get("access_token")?.value;
}

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = getToken(cookieStore);

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const search = url.search;

    const r = await fetch(`${CORE_API}/v1/safety-reports${search}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    const token = getToken(cookieStore);

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const r = await fetch(`${CORE_API}/v1/safety-reports`, {
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