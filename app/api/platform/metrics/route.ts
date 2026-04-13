import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { api } from "@/lib/core-api";

async function getBaseUrl() {
  const h = await headers();

  const protocol =
    h.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "development" ? "http" : "https");

  const host =
    h.get("host") ||
    process.env.NEXT_PUBLIC_APP_HOST ||
    "localhost:3000";

  return `${protocol}://${host}`;
}

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value ?? null;

  console.log("PLATFORM_METRICS_TOKEN:", token);

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const baseUrl = await getBaseUrl();

    // ✅ FIX هنا
    const url = `${baseUrl}${api("/platform/metrics")}`;

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