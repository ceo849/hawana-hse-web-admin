// app/api/audit-log/[id]/route.ts

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const CORE_API = process.env.CORE_API_BASE_URL!.replace(/\/$/, "");
const API_PREFIX = "/v1";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ REQUIRED by Next.js 16
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await context.params; // ✅ REQUIRED

    const upstream = await fetch(
      `${CORE_API}${API_PREFIX}/audit-log/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const contentType =
      upstream.headers.get("content-type") ??
      "application/json; charset=utf-8";

    const body = await upstream.text();

    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        "content-type": contentType,
      },
    });
  } catch (error) {
    console.error("API PROXY ERROR (GET /audit-log/:id):", error);

    return NextResponse.json(
      { message: "Upstream service unavailable" },
      { status: 503 }
    );
  }
}