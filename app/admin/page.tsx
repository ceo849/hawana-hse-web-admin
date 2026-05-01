export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers"; // ✅ ADD

import { requireAccessToken } from "@/lib/server-auth";
import { decodeJwtPayload } from "@/src/auth/jwt";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import ErrorState from "@/components/ui/error-state";

export default async function AdminPage() {
  // ✅ CRITICAL FIX
  headers();
  cookies();

  const token = await requireAccessToken();

  const payload = decodeJwtPayload(token);
  const role = payload?.role ?? null;

  // OWNER only
  if (role !== "OWNER") {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>403 — Forbidden</h1>

        <p style={{ marginTop: 10 }}>
          This page is OWNER only.
        </p>

        <Link href="/dashboard" style={{ textDecoration: "underline" }}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // ✅ backend validation
  let res: Response;

  try {
    res = await serverAppFetch("/api/users?page=1&limit=1", {
      cache: "no-store",
    });
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") {
      redirect("/login");
    }

    console.error("Admin Page Fetch Error:", err);

    return (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        <ErrorState message="Failed to load admin panel (network/server error)" />
      </div>
    );
  }

  if (res.status === 401) {
    redirect("/login");
  }

  if (!res.ok) {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        <ErrorState message="Failed to load admin panel" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800 }}>
        Admin Panel — OWNER Only
      </h1>

      <p style={{ marginTop: 12 }}>
        Server-side role protection active.
      </p>
    </div>
  );
}