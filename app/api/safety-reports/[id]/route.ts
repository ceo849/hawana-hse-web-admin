import { NextRequest, NextResponse } from "next/server";

const CORE_API = (
  process.env.CORE_API_BASE_URL ?? "http://localhost:3001"
).replace(/\/$/, "");

const API_PREFIX = "/v1";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function buildUpstreamUrl(id: string) {
  return `${CORE_API}${API_PREFIX}/safety-reports/${encodeURIComponent(id)}`;
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

async function resolveId(params: RouteContext["params"]) {
  const { id } = await params;

  if (!id || !String(id).trim()) {
    return null;
  }

  return String(id).trim();
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const token = req.cookies.get("access_token")?.value ?? null;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = await resolveId(context.params);

    if (!id) {
      return NextResponse.json(
        { message: "Missing safety report id" },
        { status: 400 }
      );
    }

    const upstream = await fetch(buildUpstreamUrl(id), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    return buildProxyResponse(upstream);
  } catch (error) {
    console.error("API PROXY ERROR (GET /safety-reports/[id]):", error);

    return NextResponse.json(
      { message: "Upstream service unavailable" },
      { status: 503 }
    );
  }
}