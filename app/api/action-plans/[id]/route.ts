import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const CORE_API = process.env.CORE_API_BASE_URL!.replace(/\/$/, "");
const API_PREFIX = "/v1";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// ✅ FIX: unified token extraction (cookies + Bearer fallback)
async function getToken(req: NextRequest) {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("access_token")?.value ?? null;

  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  return cookieToken || bearerToken;
}

function buildUpstreamUrl(id: string) {
  return `${CORE_API}${API_PREFIX}/action-plans/${encodeURIComponent(id)}`;
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
    const token = await getToken(req);

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = await resolveId(context.params);

    if (!id) {
      return NextResponse.json(
        { message: "Missing action plan id" },
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
    console.error("API PROXY ERROR (GET /action-plans/[id]):", error);

    return NextResponse.json(
      { message: "Upstream service unavailable" },
      { status: 503 }
    );
  }
}