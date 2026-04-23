import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { serverAppFetch } from "@/src/lib/server-app-fetch";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
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
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const qs = url.search ?? "";

    const upstream = await serverAppFetch(`/api/users${qs}`, token, {
      method: "GET",
      cache: "no-store",
    });

    return buildProxyResponse(upstream);
  } catch (error) {
    if (error instanceof Error && error.message === "SESSION_EXPIRED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.error("API PROXY ERROR (GET /users):", error);

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

    const upstream = await serverAppFetch("/api/users", token, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body,
      cache: "no-store",
    });

    return buildProxyResponse(upstream);
  } catch (error) {
    if (error instanceof Error && error.message === "SESSION_EXPIRED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.error("API PROXY ERROR (POST /users):", error);

    return NextResponse.json(
      { message: "Upstream service unavailable" },
      { status: 503 }
    );
  }
}