import { NextResponse } from "next/server";

const CORE_API =
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:3001").replace(/\/$/, "");

export async function GET() {
  try {
    const upstream = await fetch(`${CORE_API}/v1/health`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => ({}));

    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    console.error("[HEALTH_PROXY_ERROR]", error);

    return NextResponse.json(
      { ok: false, message: "Health route error" },
      { status: 500 },
    );
  }
}