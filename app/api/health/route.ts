// app/api/health/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const CORE_API = process.env.CORE_API_BASE_URL!;

    if (!CORE_API) {
      return NextResponse.json(
        { ok: false, message: "CORE_API_BASE_URL missing" },
        { status: 500 }
      );
    }

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
      { status: 500 }
    );
  }
}