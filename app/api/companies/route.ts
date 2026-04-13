import { NextRequest, NextResponse } from "next/server";

const CORE_API =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:3001";

function getAuthHeader(req: NextRequest) {
  const auth = req.headers.get("authorization");
  return auth ?? null;
}

export async function GET(req: NextRequest) {
  const auth = getAuthHeader(req);

  if (!auth) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(`${CORE_API}/v1/companies`);
    url.search = req.nextUrl.search;

    const upstream = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: auth,
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
  } catch (error) {
    console.error("[COMPANIES_PROXY_ERROR]", error);

    return NextResponse.json(
      { message: "Proxy error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = getAuthHeader(req);

  if (!auth) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.text();

    const upstream = await fetch(`${CORE_API}/v1/companies`, {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body,
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
  } catch (error) {
    console.error("[COMPANIES_PROXY_ERROR]", error);

    return NextResponse.json(
      { message: "Proxy error" },
      { status: 500 },
    );
  }
}