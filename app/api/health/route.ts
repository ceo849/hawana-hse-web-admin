import { NextResponse } from "next/server";
import { api } from "@/lib/core-api";

export async function GET() {
  try {
    const upstream = await fetch(api("/health"), {
      method: "GET",
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => ({}));

    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    console.error("Health route error:", error);

    return NextResponse.json(
      { ok: false, message: "Health route error" },
      { status: 500 },
    );
  }
}
