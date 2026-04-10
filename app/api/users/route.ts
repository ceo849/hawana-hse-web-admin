import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "@/lib/core-api";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value ?? null;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const qs = url.search ? url.search : "";

  try {
    console.log("API PROXY → GET /users", { qs });

    const upstream = await fetch(`${api("/users")}${qs}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const bodyText = await upstream.text();

    return new NextResponse(bodyText, {
      status: upstream.status,
      headers: {
        "content-type":
          upstream.headers.get("content-type") ??
          "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("API PROXY ERROR (GET /users):", error);

    return NextResponse.json(
      { message: "Upstream service unavailable" },
      { status: 503 },
    );
  }
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value ?? null;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const rawBody = await req.text();

  try {
    console.log("API PROXY → POST /users");

    const upstream = await fetch(api("/users"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: rawBody,
      cache: "no-store",
    });

    const bodyText = await upstream.text();

    return new NextResponse(bodyText, {
      status: upstream.status,
      headers: {
        "content-type":
          upstream.headers.get("content-type") ??
          "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("API PROXY ERROR (POST /users):", error);

    return NextResponse.json(
      { message: "Upstream service unavailable" },
      { status: 503 },
    );
  }
}