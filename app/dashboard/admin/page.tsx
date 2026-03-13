import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
import StatsCard from "@/components/ui/stats-card";
import { requireAccessToken } from "@/lib/server-auth";
import { api } from "@/lib/core-api";
import { decodeJwtPayload } from "@/src/auth/jwt";

type PlatformMetrics = {
  companies: number;
  users: number;
  sites: number;
  safetyReports: number;
  actionPlans: number;
};

function isPlatformMetrics(value: unknown): value is PlatformMetrics {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.companies === "number" &&
    typeof candidate.users === "number" &&
    typeof candidate.sites === "number" &&
    typeof candidate.safetyReports === "number" &&
    typeof candidate.actionPlans === "number"
  );
}

export default async function AdminPage() {
  const token = await requireAccessToken();
  const payload = decodeJwtPayload(token);
  const role = String(payload?.role ?? "UNKNOWN").toUpperCase();

  if (role !== "OWNER") {
    redirect("/dashboard");
  }

  const r = await fetch(api("/platform/metrics"), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (r.status === 401) {
    redirect("/login");
  }

  if (!r.ok) {
    const text = await r.text().catch(() => "");

    return (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        <PageHeader
          title="Platform Admin"
          subtitle="Platform-wide observability and administration"
        />

        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: "#f7f7f7",
            borderRadius: 12,
            overflowX: "auto",
            whiteSpace: "pre-wrap",
          }}
        >{`Failed to load platform metrics (${r.status})
${text}`}</pre>
      </div>
    );
  }

  const json = (await r.json()) as unknown;

  if (!isPlatformMetrics(json)) {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        <PageHeader
          title="Platform Admin"
          subtitle="Platform-wide observability and administration"
        />

        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: "#f7f7f7",
            borderRadius: 12,
            overflowX: "auto",
            whiteSpace: "pre-wrap",
          }}
        >
          Unexpected platform metrics response
        </pre>
      </div>
    );
  }

  const metrics = json;

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <PageHeader
        title="Platform Admin"
        subtitle="Platform-wide observability first. Control actions remain limited and separate."
      />

      <div
        style={{
          marginBottom: 16,
          padding: 14,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          background: "#fff",
          fontSize: 13,
          color: "#444",
        }}
      >
        <div style={{ fontWeight: 700, color: "#111", marginBottom: 6 }}>
          Scope of this page
        </div>
        <div>
          This page is read-only platform insight. It summarizes tenant and
          operational volume across the platform without introducing platform
          control actions yet.
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <StatsCard
          label="Companies"
          value={metrics.companies}
          helper="Total tenant companies"
          href="/dashboard/companies"
        />

        <StatsCard
          label="Users"
          value={metrics.users}
          helper="Total platform users"
          href="/dashboard/users"
        />

        <StatsCard
          label="Sites / Projects"
          value={metrics.sites}
          helper="Operational locations"
          href="/dashboard/sites-projects"
        />

        <StatsCard
          label="Safety Reports"
          value={metrics.safetyReports}
          helper="Total reports"
          href="/dashboard/safety-reports"
        />

        <StatsCard
          label="Action Plans"
          value={metrics.actionPlans}
          helper="Total action plans"
          href="/dashboard/action-plans"
        />
      </div>
    </div>
  );
}