// app/dashboard/page.tsx

export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import PageHeader from "@/components/ui/page-header";
import StatsCard from "@/components/ui/stats-card";
import ActionButton from "@/components/ui/action-button";
import ErrorState from "@/components/ui/error-state";
import { serverAppFetch } from "@/src/lib/server-app-fetch";

type DashboardDto = {
  users?: number;
  companies?: number;
  actionPlans?: number;
  reports?: number;
  reportStats?: {
    open?: number;
    inProgress?: number;
    closed?: number;
  };
};

export default async function DashboardPage() {
  const token = await requireAccessToken(); // ✅ FIX

  let dashboard: DashboardDto = {};

  try {
    const dashboardRes = await serverAppFetch(
      "/api/dashboard",
      token, // ✅ FIX
      {
        cache: "no-store",
      }
    );

    if (dashboardRes.status === 401) {
      redirect("/login");
    }

    if (!dashboardRes.ok) {
      throw new Error("DASHBOARD_FETCH_FAILED");
    }

    dashboard = await dashboardRes.json();
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") {
      redirect("/login");
    }

    console.error("Dashboard Fetch Error:", err);

    return (
      <div style={container}>
        <PageHeader
          title="Dashboard"
          subtitle="Platform and HSE operational overview"
        />

        <ErrorState message="Failed to load dashboard data (network/server error)" />
      </div>
    );
  }

  return (
    <div style={container}>
      <PageHeader
        title="Dashboard"
        subtitle="Platform and HSE operational overview"
      />

      <section style={section}>
        <div style={sectionTitle}>Quick Actions</div>

        <div style={grid}>
          <ActionButton href="/dashboard/safety-reports/new">
            + Safety Report
          </ActionButton>
          <ActionButton href="/dashboard/action-plans/new">
            + Action Plan
          </ActionButton>
          <ActionButton href="/dashboard/sites-projects/new">
            + Site / Project
          </ActionButton>
          <ActionButton href="/dashboard/users/new">+ User</ActionButton>
        </div>
      </section>

      <section style={section}>
        <div style={sectionTitle}>Platform Metrics</div>

        <div style={grid}>
          <StatsCard label="Companies" value={dashboard.companies ?? 0} />
          <StatsCard label="Users" value={dashboard.users ?? 0} />
          <StatsCard label="Reports" value={dashboard.reports ?? 0} />
          <StatsCard label="Action Plans" value={dashboard.actionPlans ?? 0} />
        </div>
      </section>

      <section style={section}>
        <div style={sectionTitle}>HSE Operations</div>

        <div style={grid}>
          <StatsCard label="Open" value={dashboard.reportStats?.open ?? 0} />
          <StatsCard
            label="In Progress"
            value={dashboard.reportStats?.inProgress ?? 0}
          />
          <StatsCard label="Closed" value={dashboard.reportStats?.closed ?? 0} />
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
  marginTop: 20,
  display: "grid",
  gap: 10,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: 10,
};

const sectionTitle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 13,
  color: "#6b7280",
  letterSpacing: "-0.01em",
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