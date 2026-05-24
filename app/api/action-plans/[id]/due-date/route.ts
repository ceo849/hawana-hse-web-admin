import { NextRequest } from "next/server";

/* ================= ADD START ================= */

function decodeJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(Buffer.from(payload, "base64").toString());
  } catch {
    return null;
  }
}

/* ================= ADD END ================= */

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  let body: any;

  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
    });
  }

  const payload = decodeJwt(token);
  const userId = payload?.sub;

  if (!userId) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 400,
    });
  }

  const finalBody = {
    ...body,
    userId,
  };

  const upstream = await fetch(
    `${process.env.CORE_API_BASE_URL!}/v1/action-plans/${id}/due-date`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(finalBody),
    }
  );

  const text = await upstream.text();

  return new Response(text, {
    status: upstream.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
