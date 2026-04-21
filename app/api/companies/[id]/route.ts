import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const CORE_API = (
  process.env.CORE_API_BASE_URL ?? "http://localhost:3001"
).replace(/\/$/, "");

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _req: Request,
  { params }: RouteContext
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value ?? null;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const r = await fetch(`${CORE_API}/v1/companies/${encodeURIComponent(id)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const text = await r.text();

  return new NextResponse(text, {
    status: r.status,
    headers: {
      "content-type":
        r.headers.get("content-type") ??
        "application/json; charset=utf-8",
    },
  });
}

export async function PATCH(
  req: Request,
  { params }: RouteContext
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value ?? null;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const r = await fetch(`${CORE_API}/v1/companies/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const text = await r.text();

  return new NextResponse(text, {
    status: r.status,
    headers: {
      "content-type":
        r.headers.get("content-type") ??
        "application/json; charset=utf-8",
    },
  });
}

export async function DELETE(
  _req: Request,
  { params }: RouteContext
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value ?? null;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const r = await fetch(`${CORE_API}/v1/companies/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const text = await r.text();

  return new NextResponse(text, {
    status: r.status,
    headers: {
      "content-type":
        r.headers.get("content-type") ??
        "application/json; charset=utf-8",
    },
  });
}