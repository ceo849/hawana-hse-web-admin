import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const CORE_API = process.env.CORE_API_BASE_URL!.replace(/\/$/, "");
const API_PREFIX = "/v1";

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value ?? null;
}

function buildUrl(searchParams: URLSearchParams) {
  const qs = searchParams.toString();

  // existing list endpoint (unchanged)
  return `${CORE_API}${API_PREFIX}/audit-log${qs ? `?${qs}` : ""}`;
}

/* ✅ NEW (Additive Only) */
function buildSingleUrl(id: string) {
  return `${CORE_API}${API_PREFIX}/audit-log/${id}`;
}

async function buildProxyResponse(upstream: Response) {
  const contentType =
    upstream.headers.get("content-type") ??
    "application/json; charset=utf-8";

  const bodyText = await upstream.text();

  return new NextResponse(bodyText, {
    status: upstream.status,
    headers: { "content-type": contentType },
  });
}

export async function GET(req: Request) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);

    /* ========================= */
    /* ✅ NEW: HANDLE /:id CASE */
    /* ========================= */
    const logId = url.searchParams.get("logId");

    if (logId) {
      const upstream = await fetch(buildSingleUrl(logId), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      return buildProxyResponse(upstream);
    }

    /* ========================= */
    /* EXISTING LIST (UNCHANGED) */
    /* ========================= */
    const upstream = await fetch(buildUrl(url.searchParams), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    return buildProxyResponse(upstream);
  } catch (error) {
    console.error("API PROXY ERROR (GET /audit-logs):", error);

    return NextResponse.json(
      { message: "Upstream service unavailable" },
      { status: 503 }
    );
  }
}