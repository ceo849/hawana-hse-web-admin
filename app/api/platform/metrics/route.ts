import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "@/lib/core-api";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value ?? null;

  console.log("PLATFORM_METRICS_TOKEN:", token);

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // ✅ FIX: direct call to Core (no baseUrl)
    const url = api("/platform/metrics");

    console.log("FINAL URL:", url);

    const upstream = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const bodyText = await upstream.text();

    console.log("PLATFORM_METRICS_STATUS:", upstream.status);
    console.log("PLATFORM_METRICS_RESPONSE:", bodyText);

    return new NextResponse(bodyText, {
      status: upstream.status,
      headers: {
        "content-type":
          upstream.headers.get("content-type") ??
          "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("[PLATFORM_METRICS_PROXY_ERROR]", error);

    return NextResponse.json(
      { message: "Failed to fetch platform metrics" },
      { status: 500 },
    );
  }
}