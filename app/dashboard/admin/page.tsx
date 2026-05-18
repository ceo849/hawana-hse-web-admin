export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers"; // ✅ ADD

import PageHeader from "@/components/ui/page-header";
import StatsCard from "@/components/ui/stats-card";
import { requireAccessToken } from "@/lib/server-auth";
import { decodeJwtPayload } from "@/src/auth/jwt";
import { serverAppFetch } from "@/src/lib/server-app-fetch";

export default async function AdminPage() {
  // ✅ CRITICAL FIX (SSR cookies binding)
  headers();
  cookies();

  const token = await requireAccessToken();
  const payload = decodeJwtPayload(token);
  const role = String(payload?.role ?? "UNKNOWN").toUpperCase();

  if (role !== "OWNER") {
    redirect("/dashboard");
  }

  let u: Response;
  let r: Response;
  let p: Response;

  try {
    [u, r, p] = await Promise.all([
      serverAppFetch("/api/users?page=1&limit=1", {
        cache: "no-store",
      }),
      serverAppFetch("/api/safety-reports?page=1&limit=1", {
        cache: "no-store",
      }),
      serverAppFetch("/api/action-plans?limit=1", {
        cache: "no-store",
      }),
    ]);
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") {
      redirect("/login");
    }

    console.error("Admin Fetch Error:", err);

    return (
      <div style={container}>
        <PageHeader title="Platform Admin" subtitle="System overview" />
        <div style={errorBox}>
          Failed to load admin data (network/server error)
        </div>
      </div>
    );
  }

  let users = 0;
  let reports = 0;
  let plans = 0;

  if (u.ok) {
    const j = await u.json();
    users = j?.meta?.total ?? 0;
  }

  if (r.ok) {
    const j = await r.json();
    reports = j?.meta?.total ?? 0;
  }

  if (p.ok) {
    const j = await p.json();
    plans = j?.meta?.total ?? 0;
  }

  return (
    <div style={container}>
      <PageHeader title="Platform Admin" subtitle="System overview" />

      <section style={section}>
        <div style={sectionHeader}>
          <div>
            <div style={sectionTitle}>Platform Snapshot</div>
            <div style={sectionSubtitle}>
              Read-only operational overview for platform administration
            </div>
          </div>
        </div>

        <div style={grid}>
          <StatsCard label="Users" value={users} />
          <StatsCard label="Reports" value={reports} />
          <StatsCard label="Plans" value={plans} />
        </div>
      </section>

      <section style={section}>
        <div style={infoCard}>
          <div style={infoTitle}>Governance Mode</div>
          <div style={infoText}>
            Admin overview is read-only. Operational decisions remain enforced
            by the backend.
          </div>
        </div>
      </section>
    </div>
  );
}

const container: React.CSSProperties = {
  padding: 16,
  fontFamily: "system-ui",
  maxWidth: 680,
  margin: "0 auto",
};

const section: React.CSSProperties = {
  marginTop: 18,
  display: "grid",
  gap: 10,
};

const sectionHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#6b7280",
};

const sectionSubtitle: React.CSSProperties = {
  marginTop: 4,
  fontSize: 12,
  color: "#9ca3af",
  lineHeight: 1.4,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: 10,
};

const infoCard: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  padding: 14,
};

const infoTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  color: "#111827",
};

const infoText: React.CSSProperties = {
  marginTop: 6,
  fontSize: 12,
  color: "#6b7280",
  lineHeight: 1.5,
};

const errorBox: React.CSSProperties = {
  color: "#991b1b",
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: 12,
  padding: 12,
  marginTop: 12,
  fontSize: 13,
};