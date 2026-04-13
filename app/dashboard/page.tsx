export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
import StatsCard from "@/components/ui/stats-card";
import ActionButton from "@/components/ui/action-button";
import { decodeJwtPayload } from "@/src/auth/jwt";
import { serverAppFetch } from "@/src/lib/server-app-fetch";

type Role = "OWNER" | "ADMIN" | "MANAGER" | "WORKER" | "VIEWER" | "UNKNOWN";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  const payload = decodeJwtPayload(token);
  const role: Role = (payload?.role as Role) ?? "UNKNOWN";

  let usersCount = 0;
  let reports: any[] = [];
  let reportsCount = 0;
  let plansCount = 0;

  try {
    // USERS
    const usersRes = await serverAppFetch("/users?page=1&limit=100", token);
    if (usersRes.status === 401) redirect("/login");

    const usersJson = await usersRes.json();
    usersCount = Array.isArray(usersJson?.data)
      ? usersJson.data.length
      : 0;

    // REPORTS
    const reportsRes = await serverAppFetch(
      "/safety-reports?page=1&limit=100",
      token
    );
    if (reportsRes.status === 401) redirect("/login");

    const reportsJson = await reportsRes.json();
    reports = Array.isArray(reportsJson?.data)
      ? reportsJson.data
      : [];
    reportsCount = reports.length;

    // ACTION PLANS
    const plansRes = await serverAppFetch(
      "/action-plans?page=1&limit=100",
      token
    );
    if (plansRes.status === 401) redirect("/login");

    const plansJson = await plansRes.json();
    plansCount = Array.isArray(plansJson?.data)
      ? plansJson.data.length
      : 0;
  } catch (err) {
    console.error("Dashboard Error:", err);
  }

  const openCount = reports.filter((r) => r.status === "OPEN").length;
  const inProgressCount = reports.filter(
    (r) => r.status === "IN_PROGRESS"
  ).length;
  const closedCount = reports.filter(
    (r) => r.status === "CLOSED"
  ).length;

  return (
    <div
      style={{
        padding: 16,
        fontFamily: "system-ui",
        maxWidth: 680,
        margin: "0 auto",
      }}
    >
      <PageHeader
        title="Dashboard"
        subtitle="Platform and HSE operational overview"
      />

      <div style={sectionTitle}>Quick Actions</div>

      <div style={gridStyle}>
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

      <div style={gridStyle}>
        <StatsCard label="Companies" value={1} />
        <StatsCard label="Users" value={usersCount} />
        <StatsCard label="Reports" value={reportsCount} />
        <StatsCard label="Action Plans" value={plansCount} />
      </div>

      <div style={sectionTitle}>HSE Operations</div>

      <div style={gridStyle}>
        <StatsCard label="Open" value={openCount} />
        <StatsCard label="In Progress" value={inProgressCount} />
        <StatsCard label="Closed" value={closedCount} />
      </div>
    </div>
  );
}

const gridStyle: React.CSSProperties = {
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