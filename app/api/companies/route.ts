import { NextResponse } from "next/server";

const CORE_API = (
  process.env.CORE_API_BASE_URL!
).replace(/\/$/, "");

const API_PREFIX = "/v1";

// ✅ FIX: استخدام request بدل cookies()
function getToken(req: Request): string | null {
  // 1) Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "").trim();
  }

  // 2) Raw cookie header
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [k, ...v] = c.split("=");
        return [k, v.join("=")];
      })
    );

    if (cookies["access_token"]) {
      return cookies["access_token"];
    }
  }

  return null;
}

function buildUpstreamUrl(search: string = "") {
  return `${CORE_API}${API_PREFIX}/companies${search}`;
}

async function buildProxyResponse(upstream: Response) {
  const contentType =
    upstream.headers.get("content-type") ??
    "application/json; charset=utf-8";

  const bodyText = await upstream.text();

  return new NextResponse(bodyText, {
    status: upstream.status,
    headers: {
      "content-type": contentType,
    },
  });
}

// =========================
// GET
// =========================
export async function GET(req: Request) {
  try {
    const token = getToken(req);

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const qs = url.search ?? "";

    const upstream = await fetch(buildUpstreamUrl(qs), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    return buildProxyResponse(upstream);
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
    const token = getToken(req);

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const upstream = await fetch(buildUpstreamUrl(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    return buildProxyResponse(upstream);
  } catch (error) {
    console.error("API PROXY ERROR (POST /companies):", error);

    return NextResponse.json(
      { message: "Upstream service unavailable" },
      { status: 503 }
    );
  }
}