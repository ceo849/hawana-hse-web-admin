import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const CORE_API = process.env.CORE_API_BASE_URL!.replace(/\/$/, "");
const API_PREFIX = "/v1";

// ✅ NEW: unified token extraction
async function getToken(): Promise<string | null> {
  const store = await cookies();
  return store.get("access_token")?.value ?? null;
}

function buildUpstreamUrl(search: string = "") {
  return `${CORE_API}${API_PREFIX}/users${search}`;
}

const CREATE_USER_FALLBACK_MESSAGE = "Unable to create user";

const SAFE_CREATE_USER_MESSAGES = new Set([
  "email is required",
  "fullName is required",
  "password is required",
  "password must be at least 8 characters",
  "role is required",
  "Invalid role",
  "email already exists",
  "User limit reached for current plan",
  "Insufficient authority to create user with requested role",
]);

function sanitizeCreateUserMessage(value: unknown): string {
  if (Array.isArray(value)) {
    const messages = value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);

    if (
      messages.length > 0 &&
      messages.every((message) => SAFE_CREATE_USER_MESSAGES.has(message))
    ) {
      return messages.join(" | ");
    }

    return CREATE_USER_FALLBACK_MESSAGE;
  }

  if (typeof value === "string") {
    const message = value.trim();

    if (SAFE_CREATE_USER_MESSAGES.has(message)) {
      return message;
    }
  }

  return CREATE_USER_FALLBACK_MESSAGE;
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

async function buildCreateUserProxyResponse(upstream: Response) {
  if (upstream.ok) {
    return buildProxyResponse(upstream);
  }

  const contentType = upstream.headers.get("content-type") ?? "";
  let message = CREATE_USER_FALLBACK_MESSAGE;

  if (contentType.includes("application/json")) {
    const data = (await upstream.json().catch(() => null)) as
      | Record<string, unknown>
      | null;

    if (data) {
      message = sanitizeCreateUserMessage(data.message ?? data.error);
    }
  }

  return NextResponse.json(
    { message },
    { status: upstream.status }
  );
}

// =========================
// GET
// =========================
export async function GET(req: Request) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const qs = url.search ?? "";

    const upstream = await fetch(buildUpstreamUrl(qs), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    return buildProxyResponse(upstream);
  } catch (error) {
    console.error("API PROXY ERROR (GET /users):", error);

    return NextResponse.json(
      { message: "Upstream service unavailable" },
      { status: 503 }
    );
  }
}

// =========================
// POST
// =========================
export async function POST(req: Request) {
  try {
    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
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

    const upstream = await fetch(buildUpstreamUrl(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    return buildCreateUserProxyResponse(upstream);
  } catch (error) {
    console.error("API PROXY ERROR (POST /users):", error);

    return NextResponse.json(
      { message: "Upstream service unavailable" },
      { status: 503 }
    );
  }
}