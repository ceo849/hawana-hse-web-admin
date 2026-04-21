import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const CORE_API =
  (process.env.CORE_API_BASE_URL ?? "http://localhost:3001").replace(/\/$/, "");

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

export async function GET() {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const upstream = await fetch(`${CORE_API}/v1/dashboard`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

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
  } catch (error) {
    console.error("API PROXY ERROR (GET /dashboard):", error);

    return NextResponse.json(
      { message: "Upstream service unavailable" },
      { status: 503 }
    );
  }
}