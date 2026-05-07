// app/api/health/route.ts

import { NextResponse } from "next/server";
import http from "http";

export async function GET() {
  try {
    const CORE_API = process.env.CORE_API_BASE_URL!;

    if (!CORE_API) {
      return NextResponse.json(
        { ok: false, message: "CORE_API_BASE_URL missing" },
        { status: 500 }
      );
    }

    const url = new URL(`${CORE_API}/v1/health`);

    const data = await new Promise<any>((resolve, reject) => {
      const req = http.request(
        {
          hostname: url.hostname,
          port: url.port,
          path: url.pathname,
          method: "GET",
          timeout: 5000,
        },
        (res) => {
          let body = "";

          res.on("data", (chunk) => {
            body += chunk;
          });

          res.on("end", () => {
            try {
              resolve(JSON.parse(body));
            } catch {
              resolve({});
            }
          });
        }
      );

      req.on("error", reject);

      req.on("timeout", () => {
        req.destroy(new Error("Request timeout"));
      });

      req.end();
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("[HEALTH_PROXY_ERROR]", error);

    return NextResponse.json(
      {
        ok: false,
        message: error?.message || "Health route error",
      },
      { status: 500 }
    );
  }
}