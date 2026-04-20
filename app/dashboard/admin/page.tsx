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

  let u, r, p;

  // ✅ ADDITIVE: حماية parallel fetch
  try {
    [u, r, p] = await Promise.all([
      serverSafeFetch("/users?page=1&limit=1", token),
      serverSafeFetch("/safety-reports?page=1&limit=1", token),
      serverSafeFetch("/action-plans?page=1&limit=1", token),
    ]);
  } catch (err) {
    console.error("Admin Fetch Error:", err);

    return (
      <div style={container}>
        <PageHeader
          title="Platform Admin"
          subtitle="System overview"
        />
        <div style={{ color: "red", marginTop: 12 }}>
          Failed to load admin data (network/server error)
        </div>
      </div>
    );
  }

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

      {/* ===== Stats Grid ===== */}
      <div style={grid}>
        <StatsCard label="Users" value={users} />
        <StatsCard label="Reports" value={reports} />
        <StatsCard label="Plans" value={plans} />
      </div>
    </div>
  );
}

const container: React.CSSProperties = {
  padding: 16, // ✅ كان 24 → أصبح أخف للموبايل (Additive safe)
  fontFamily: "system-ui",
  maxWidth: 900, // ✅ يمنع التمدد الزائد
  margin: "0 auto", // ✅ Centered layout
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", // ✅ أفضل للموبايل
  gap: 12,
};