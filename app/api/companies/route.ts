import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const CORE_API =
  (process.env.CORE_API_BASE_URL ?? "http://localhost:3001").replace(/\/$/, "");

// ✅ Token extraction (unchanged behavior)
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

    // ✅ explicit URL build (no ambiguity)
    const upstreamUrl = `${CORE_API}/v1/companies${qs}`;

    const upstream = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    // ✅ passthrough (no JSON parsing issues)
    const bodyText = await upstream.text();

    return new NextResponse(bodyText, {
      status: upstream.status,
      headers: {
        "content-type":
          upstream.headers.get("content-type") ??
          "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("API PROXY ERROR (GET /companies):", error);

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

    // ✅ explicit URL build
    const upstreamUrl = `${CORE_API}/v1/companies`;

    const upstream = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body,
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
  } catch (error) {
    console.error("API PROXY ERROR (POST /companies):", error);

    return NextResponse.json(
      { message: "Upstream service unavailable" },
      { status: 503 }
    );
  }
}