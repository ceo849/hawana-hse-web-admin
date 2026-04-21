export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import PageHeader from "@/components/ui/page-header";
import StatsCard from "@/components/ui/stats-card";
import ActionButton from "@/components/ui/action-button";
import { serverAppFetch } from "@/src/lib/server-app-fetch";

export default async function DashboardPage() {
  await requireAccessToken();

  let usersRes: Response;
  let reportsRes: Response;
  let plansRes: Response;
  let dashboardRes: Response;

  try {
    [usersRes, reportsRes, plansRes, dashboardRes] = await Promise.all([
      serverAppFetch("/api/users?page=1&limit=100", { cache: "no-store" }),
      serverAppFetch("/api/safety-reports?page=1&limit=100", {
        cache: "no-store",
      }),
      serverAppFetch("/api/action-plans?page=1&limit=100", {
        cache: "no-store",
      }),
      serverAppFetch("/api/dashboard", { cache: "no-store" }),
    ]);
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

  let usersCount = 0;
  let reports: any[] = [];
  let reportsCount = 0;
  let plansCount = 0;

  let dashboardUsers = 0;
  let dashboardCompanies = 0;
  let dashboardPlans = 0;

  if (usersRes.ok) {
    const usersJson = await usersRes.json();
    usersCount = Array.isArray(usersJson?.data) ? usersJson.data.length : 0;
  }

  if (reportsRes.ok) {
    const reportsJson = await reportsRes.json();
    reports = Array.isArray(reportsJson?.data) ? reportsJson.data : [];
    reportsCount = reports.length;
  }

  if (plansRes.ok) {
    const plansJson = await plansRes.json();
    plansCount = Array.isArray(plansJson?.data) ? plansJson.data.length : 0;
  }

  if (dashboardRes.ok) {
    const data = await dashboardRes.json();
    dashboardUsers = data.users ?? usersCount;
    dashboardCompanies = data.companies ?? 0;
    dashboardPlans = data.actionPlans ?? plansCount;
  }

  const openCount = reports.filter((r) => r.status === "OPEN").length;
  const inProgressCount = reports.filter(
    (r) => r.status === "IN_PROGRESS"
  ).length;
  const closedCount = reports.filter((r) => r.status === "CLOSED").length;

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
        <StatsCard label="Companies" value={dashboardCompanies} />
        <StatsCard label="Users" value={dashboardUsers} />
        <StatsCard label="Reports" value={reportsCount} />
        <StatsCard label="Action Plans" value={dashboardPlans} />
      </div>

      <div style={sectionTitle}>HSE Operations</div>

      <div style={grid}>
        <StatsCard label="Open" value={openCount} />
        <StatsCard label="In Progress" value={inProgressCount} />
        <StatsCard label="Closed" value={closedCount} />
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