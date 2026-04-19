import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const CORE_API =
  (process.env.CORE_API_BASE_URL ?? "http://localhost:3001").replace(/\/$/, "");

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

// =========================
// GET
// =========================
export async function GET(req: Request) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const qs = url.search ?? "";

    const upstream = await fetch(`${CORE_API}/v1/sites-projects${qs}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const contentType =
      upstream.headers.get("content-type") ??
      "application/json; charset=utf-8";

    const body = await upstream.text();

    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        "content-type": contentType,
      },
    });
  } catch (error) {
    console.error("API PROXY ERROR (GET /sites-projects):", error);

    return NextResponse.json(
      { message: "Upstream service unavailable" },
      { status: 503 }
    );
  }
}

// =========================
// POST
// =========================
export async function POST(req: Request) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.text();

    const upstream = await fetch(`${CORE_API}/v1/sites-projects`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body,
      cache: "no-store",
    });

    const contentType =
      upstream.headers.get("content-type") ??
      "application/json; charset=utf-8";

    const responseBody = await upstream.text();

    return new NextResponse(responseBody, {
      status: upstream.status,
      headers: {
        "content-type": contentType,
      },
    });
  } catch (error) {
    console.error("API PROXY ERROR (POST /sites-projects):", error);

    return NextResponse.json(
      { message: "Upstream service unavailable" },
      { status: 503 }
    );
  }
}