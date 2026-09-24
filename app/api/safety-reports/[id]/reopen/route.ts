import { NextRequest, NextResponse } from "next/server";

const CORE_API = (
  process.env.CORE_API_BASE_URL!
).replace(/\/$/, "");

const API_PREFIX = "/v1";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "").trim();
  }

  return req.cookies.get("access_token")?.value ?? null;
}

async function resolveId(params: RouteContext["params"]) {
  const { id } = await params;

  if (!id || !String(id).trim()) {
    return null;
  }

  return String(id).trim();
}

function buildUpstreamUrl(id: string) {
  return `${CORE_API}${API_PREFIX}/safety-reports/${encodeURIComponent(id)}/reopen`;
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

export async function POST(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const token = await getToken(req);

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const id = await resolveId(context.params);

    if (!id) {
      return NextResponse.json(
        { message: "Missing safety report id" },
        { status: 400 }
      );
    }

    const body = await req.text();

    const upstream = await fetch(buildUpstreamUrl(id), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body,
      cache: "no-store",
    });

    return buildProxyResponse(upstream);
  } catch (error) {
    console.error(
      "API PROXY ERROR (POST /safety-reports/[id]/reopen):",
      error
    );

    return NextResponse.json(
      { message: "Upstream service unavailable" },
      { status: 503 }
    );
  }
}
