export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import PageHeader from "@/components/ui/page-header";
import StatsCard from "@/components/ui/stats-card";
import ActionButton from "@/components/ui/action-button";
import { serverAppFetch } from "@/src/lib/server-app-fetch";

type DashboardDto = {
  users?: number;
  companies?: number;
  actionPlans?: number;
};

export default async function DashboardPage() {
  await requireAccessToken();

  let dashboard: DashboardDto = {};

  try {
    const dashboardRes = await serverAppFetch("/api/dashboard", {
      cache: "no-store",
    });

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
        <div style={{ color: "red", marginTop: 12 }}>
          Failed to load dashboard data (network/server error)
        </div>
      </div>
    );
  }

  return (
    <div style={container}>
      <PageHeader
        title="Dashboard"
        subtitle="Platform and HSE operational overview"
      />

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
        <ActionButton href="/dashboard/users/new">
          + User
        </ActionButton>
      </div>

      <div style={sectionTitle}>Platform Metrics</div>

      <div style={grid}>
        <StatsCard label="Companies" value={dashboard.companies ?? 0} />
        <StatsCard label="Users" value={dashboard.users ?? 0} />
        <StatsCard label="Action Plans" value={dashboard.actionPlans ?? 0} />
      </div>

      <div style={sectionTitle}>HSE Operations</div>

      <div style={grid}>
        <StatsCard label="Reports" value={0} />
        <StatsCard label="Open" value={0} />
        <StatsCard label="In Progress" value={0} />
        <StatsCard label="Closed" value={0} />
      </div>
    </div>
  );
}

const container: React.CSSProperties = {
  padding: 16,
  fontFamily: "system-ui",
  maxWidth: 680,
  margin: "0 auto",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: 10,
};

const sectionTitle: React.CSSProperties = {
  marginTop: 20,
  marginBottom: 6,
  fontWeight: 600,
  fontSize: 13,
  color: "#6b7280",
};