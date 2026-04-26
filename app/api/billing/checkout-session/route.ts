import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = await req.json();

  const CORE_API =
    (process.env.CORE_API_BASE_URL ?? "http://localhost:3001").replace(
      /\/$/,
      "",
    );

  const upstream = await fetch(`${CORE_API}/v1/billing/checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = await upstream.text();

  return new Response(data, {
    status: upstream.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}