export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
import StatsCard from "@/components/ui/stats-card";
import { requireAccessToken } from "@/lib/server-auth";
import { decodeJwtPayload } from "@/src/auth/jwt";
import { serverSafeFetch } from "@/src/lib/server-safe-fetch";

export default async function AdminPage() {
  const token = await requireAccessToken();
  const payload = decodeJwtPayload(token);
  const role = String(payload?.role ?? "UNKNOWN").toUpperCase();

  // 🔐 RBAC
  if (role !== "OWNER") {
    redirect("/dashboard");
  }

  // ✅ SSR flow الصحيح
  const [u, r, p] = await Promise.all([
    serverSafeFetch("/users?page=1&limit=1", token),
    serverSafeFetch("/safety-reports?page=1&limit=1", token),
    serverSafeFetch("/action-plans?page=1&limit=1", token),
  ]);

  let users = 0;
  let reports = 0;
  let plans = 0;

  // USERS
  if (u.ok) {
    const j = await u.json();
    users = j?.meta?.total ?? 0;
  }

  // REPORTS
  if (r.ok) {
    const j = await r.json();
    reports = j?.meta?.total ?? 0;
  }

  // PLANS
  if (p.ok) {
    const j = await p.json();
    plans = j?.meta?.total ?? 0;
  }

  return (
    <div style={container}>
      <PageHeader
        title="Platform Admin"
        subtitle="System overview"
      />

      <div style={grid}>
        <StatsCard label="Users" value={users} />
        <StatsCard label="Reports" value={reports} />
      </div>

      <div style={grid}>
        <StatsCard label="Plans" value={plans} />
      </div>
    </div>
  );
}

const container: React.CSSProperties = {
  padding: 24,
  fontFamily: "system-ui",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
};