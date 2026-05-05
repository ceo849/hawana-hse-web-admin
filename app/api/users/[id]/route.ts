import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const CORE_API = (
  process.env.CORE_API_BASE_URL!
).replace(/\/$/, "");

const API_PREFIX = "/v1";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

function buildUpstreamUrl(id: string) {
  return `${CORE_API}${API_PREFIX}/users/${encodeURIComponent(id)}`;
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

export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = await resolveId(params);

    if (!id) {
      return NextResponse.json(
        { message: "Missing user id" },
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
    console.error("API PROXY ERROR (GET /users/[id]):", error);

    return NextResponse.json(
      { message: "Upstream service unavailable" },
      { status: 503 }
    );
  }
}

/* =========================
   ✅ NEW — PATCH (Additive)
========================= */

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = await resolveId(params);

    if (!id) {
      return NextResponse.json(
        { message: "Missing user id" },
        { status: 400 }
      );
    }

    const body = await req.text();

    const upstream = await fetch(buildUpstreamUrl(id), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body,
    });

    return buildProxyResponse(upstream);
  } catch (error) {
    console.error("API PROXY ERROR (PATCH /users/[id]):", error);

    return NextResponse.json(
      { message: "Upstream service unavailable" },
      { status: 503 }
    );
  }
}