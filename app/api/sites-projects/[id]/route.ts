import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const CORE_BASE_URL = process.env.CORE_API_BASE_URL!.replace(/\/$/, "");
const API_PREFIX = "/v1";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// ✅ Unified token extraction (cookies + Bearer fallback)
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
  return `${CORE_BASE_URL}${API_PREFIX}/sites-projects/${encodeURIComponent(id)}`;
}

async function buildProxyResponse(upstream: Response) {
  const contentType =
    upstream.headers.get("content-type") ?? "application/json; charset=utf-8";

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
        { message: "Missing site project id" },
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
    console.error("API PROXY ERROR (GET /sites-projects/[id]):", error);

    return NextResponse.json(
      { message: "Upstream service unavailable" },
      { status: 503 }
    );
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const token = await getToken(req);

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = await resolveId(context.params);

    if (!id) {
      return NextResponse.json(
        { message: "Missing site project id" },
        { status: 400 }
      );
    }

    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const upstream = await fetch(buildUpstreamUrl(id), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    return buildProxyResponse(upstream);
  } catch (error) {
    console.error("API PROXY ERROR (PATCH /sites-projects/[id]):", error);

    return NextResponse.json(
      { message: "Upstream service unavailable" },
      { status: 503 }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const token = await getToken(req);

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = await resolveId(context.params);

    if (!id) {
      return NextResponse.json(
        { message: "Missing site project id" },
        { status: 400 }
      );
    }

    const upstream = await fetch(buildUpstreamUrl(id), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    return buildProxyResponse(upstream);
  } catch (error) {
    console.error("API PROXY ERROR (DELETE /sites-projects/[id]):", error);

    return NextResponse.json(
      { message: "Upstream service unavailable" },
      { status: 503 }
    );
  }
}