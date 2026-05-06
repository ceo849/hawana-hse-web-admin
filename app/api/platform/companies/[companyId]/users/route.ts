import { NextResponse } from "next/server";

const CORE_API = process.env.CORE_API_BASE_URL?.replace(/\/$/, "") ?? "";
const API_PREFIX = "/v1";

// ⚠️ DEPRECATED PROXY (LOCKED)
// This endpoint is intentionally disabled.
// companyId must NEVER come from request path/body.
// Backend must extract companyId from JWT only.

function getToken(req: Request): string | null {
  const authHeader = req.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "").trim();
  }

  const cookieHeader = req.headers.get("cookie");

  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [k, ...v] = c.split("=");
        return [k, v.join("=")];
      })
    );

    if (cookies["access_token"]) {
      return cookies["access_token"];
    }
  }

  return null;
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
  _req: Request,
  _context: { params: Promise<{ companyId: string }> }
) {
  return NextResponse.json(
    {
      error: "Deprecated endpoint. Use /api/users instead.",
    },
    { status: 410 }
  );
}