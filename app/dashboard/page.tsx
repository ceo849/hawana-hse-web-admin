// app/dashboard/page.tsx

import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
import StatsCard from "@/components/ui/stats-card";
import ActionButton from "@/components/ui/action-button";
import { decodeJwtPayload } from "@/src/auth/jwt";

type Role = "OWNER" | "ADMIN" | "MANAGER" | "WORKER" | "VIEWER" | "UNKNOWN";

// ✅ حل مشكلة fetch داخل Server Component
function getBaseUrl() {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  return "https://hawanaglobal.com";
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  const payload = decodeJwtPayload(token);
  const role: Role = (payload?.role as Role) ?? "UNKNOWN";

  const BASE_URL = getBaseUrl();

  // =========================
  // USERS
  // =========================
  let usersCount = 0;

  try {
    const res = await fetch(`${BASE_URL}/api/users`, {
      cache: "no-store",
      headers: {
        Cookie: `access_token=${token}`,
      },
    });

    const data = await res.json();
    usersCount = Array.isArray(data?.data) ? data.data.length : 0;
  } catch {}

  // =========================
  // REPORTS
  // =========================
  let reports: any[] = [];
  let reportsCount = 0;

  try {
    const res = await fetch(`${BASE_URL}/api/safety-reports`, {
      cache: "no-store",
      headers: {
        Cookie: `access_token=${token}`,
      },
    });

    const data = await res.json();
    reports = Array.isArray(data?.data) ? data.data : [];
    reportsCount = reports.length;
  } catch {}

  // =========================
  // ACTION PLANS
  // =========================
  let plansCount = 0;

  try {
    const res = await fetch(`${BASE_URL}/api/action-plans`, {
      cache: "no-store",
      headers: {
        Cookie: `access_token=${token}`,
      },
    });

    const data = await res.json();
    plansCount = Array.isArray(data?.data) ? data.data.length : 0;
  } catch {}

  // =========================
  // HSE STATUS
  // =========================
  const openCount = reports.filter((r) => r.status === "OPEN").length;
  const inProgressCount = reports.filter(
    (r) => r.status === "IN_PROGRESS"
  ).length;
  const closedCount = reports.filter((r) => r.status === "CLOSED").length;

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

      {/* Quick Actions */}
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

      {/* Platform Metrics */}
      <div style={sectionTitle}>Platform Metrics</div>

      <div style={gridStyle}>
        <StatsCard label="Companies" value={1} />
        <StatsCard label="Users" value={usersCount} />
        <StatsCard label="Reports" value={reportsCount} />
        <StatsCard label="Action Plans" value={plansCount} />
      </div>

      {/* HSE Operations */}
      <div style={sectionTitle}>HSE Operations</div>

      <div style={gridStyle}>
        <StatsCard label="Open" value={openCount} />
        <StatsCard label="In Progress" value={inProgressCount} />
        <StatsCard label="Closed" value={closedCount} />
      </div>
    </div>
  );
}

// =========================
// STYLES
// =========================
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