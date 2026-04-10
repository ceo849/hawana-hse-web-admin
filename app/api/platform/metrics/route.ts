import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "@/lib/core-api";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value ?? null;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const upstream = await fetch(api("/platform/metrics"), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    return NextResponse.json(
      { message: "Failed to fetch platform metrics" },
      { status: 500 },
    );
  }
}