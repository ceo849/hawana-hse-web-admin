import { NextRequest, NextResponse } from "next/server";

const CORE_API = (
  process.env.CORE_API_BASE_URL ?? "http://localhost:3001"
).replace(/\/$/, "");

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const token = req.cookies.get("access_token")?.value ?? null;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const r = await fetch(`${CORE_API}/v1/safety-reports/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const bodyText = await r.text();

  return new NextResponse(bodyText, {
    status: r.status,
    headers: {
      "content-type":
        r.headers.get("content-type") ?? "application/json; charset=utf-8",
    },
  });
}