import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import PageHeader from "@/components/ui/page-header";
import StatsCard from "@/components/ui/stats-card";
import ActionButton from "@/components/ui/action-button";

export default async function DashboardPage() {
  const token = await requireAccessToken();

  const CORE_API =
    (process.env.NEXT_PUBLIC_API_BASE_URL ??
      "http://localhost:3001").replace(/\/$/, "");

  let usersCount = 0;
  let reports: any[] = [];
  let reportsCount = 0;
  let plansCount = 0;

  // ✅ ADDITIVE: dashboard source of truth
  let dashboardUsers = 0;
  let dashboardCompanies = 0;
  let dashboardPlans = 0;

  try {
    const [usersRes, reportsRes, plansRes] = await Promise.all([
      fetch(`${CORE_API}/v1/users?page=1&limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
      fetch(`${CORE_API}/v1/safety-reports?page=1&limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
      fetch(`${CORE_API}/v1/action-plans?page=1&limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
    ]);

    // 🔐 Auth check
    if (
      usersRes.status === 401 &&
      reportsRes.status === 401 &&
      plansRes.status === 401
    ) {
      redirect("/login");
    }

    // USERS
    if (usersRes.ok) {
      const usersJson = await usersRes.json();
      usersCount = Array.isArray(usersJson?.data)
        ? usersJson.data.length
        : 0;
    } else if (usersRes.status === 403) {
      usersCount = 0;
    }

    // REPORTS
    if (reportsRes.ok) {
      const reportsJson = await reportsRes.json();
      reports = Array.isArray(reportsJson?.data)
        ? reportsJson.data
        : [];
      reportsCount = reports.length;
    } else if (reportsRes.status === 403) {
      // ✅ ADDITIVE: billing block awareness
      reportsCount = 0;
    }

    // PLANS
    if (plansRes.ok) {
      const plansJson = await plansRes.json();
      plansCount = Array.isArray(plansJson?.data)
        ? plansJson.data.length
        : 0;
    }

  } catch (err) {
    console.error("Dashboard Error:", err);
  }

  // ✅ ADDITIVE: unified dashboard API
  try {
    const dashboardRes = await fetch(`${CORE_API}/v1/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (dashboardRes.status === 401) {
      redirect("/login");
    }

    if (dashboardRes.ok) {
      const data = await dashboardRes.json();
      dashboardUsers = data.users ?? 0;
      dashboardCompanies = data.companies ?? 0;
      dashboardPlans = data.actionPlans ?? 0;
    }
  } catch (err) {
    console.error("Dashboard API Error:", err);
  }

  const openCount = reports.filter((r) => r.status === "OPEN").length;
  const inProgressCount = reports.filter(
    (r) => r.status === "IN_PROGRESS"
  ).length;
  const closedCount = reports.filter(
    (r) => r.status === "CLOSED"
  ).length;

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
        {/* ✅ ADDITIVE: trusted values */}
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