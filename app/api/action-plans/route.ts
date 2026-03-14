import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const CORE_API =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://hawana-core:3001").replace(/\/$/, "");

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

export async function GET(req: Request) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const qs = url.search ? url.search : "";

    const r = await fetch(`${CORE_API}/v1/action-plans${qs}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const bodyText = await r.text();

    return new NextResponse(bodyText, {
      status: r.status,
      headers: {
        "content-type":
          r.headers.get("content-type") ?? "application/json; charset=utf-8",
      },
    });
  } catch {
    return NextResponse.json({ message: "Proxy error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.text();

    const r = await fetch(`${CORE_API}/v1/action-plans`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body,
    });

    const bodyText = await r.text();

    return new NextResponse(bodyText, {
      status: r.status,
      headers: {
        "content-type":
          r.headers.get("content-type") ?? "application/json; charset=utf-8",
      },
    });
  } catch {
    return NextResponse.json({ message: "Proxy error" }, { status: 500 });
  }
}