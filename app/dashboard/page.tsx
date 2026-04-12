import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
import StatsCard from "@/components/ui/stats-card";
import ActionButton from "@/components/ui/action-button";
import { decodeJwtPayload } from "@/src/auth/jwt";

type Role = "OWNER" | "ADMIN" | "MANAGER" | "WORKER" | "VIEWER" | "UNKNOWN";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  const payload = decodeJwtPayload(token);
  const role: Role = (payload?.role as Role) ?? "UNKNOWN";

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Users
  let usersCount = 0;
  try {
    const res = await fetch(`${baseUrl}/v1/users`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json();
    usersCount = Array.isArray(data?.data) ? data.data.length : 0;
  } catch {}

  // Reports
  let reports: any[] = [];
  let reportsCount = 0;

  try {
    const res = await fetch(`${baseUrl}/v1/safety-reports`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const data = await res.json();
    reports = Array.isArray(data?.data) ? data.data : [];
    reportsCount = reports.length;
  } catch {}

  // Plans
  let plansCount = 0;
  try {
    const res = await fetch(`${baseUrl}/v1/action-plans`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const data = await res.json();
    plansCount = Array.isArray(data) ? data.length : 0;
  } catch {}

  // HSE (Reports Based)
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
        <ActionButton href="/dashboard/safety-reports/new">+ Safety Report</ActionButton>
        <ActionButton href="/dashboard/action-plans/new">+ Action Plan</ActionButton>
        <ActionButton href="/dashboard/sites-projects/new">+ Site / Project</ActionButton>
        <ActionButton href="/dashboard/users/new">+ User</ActionButton>
      </div>

      {/* Metrics */}
      <div style={sectionTitle}>Platform Metrics</div>

      <div style={gridStyle}>
        <Link href="/dashboard/companies" style={cardStyle}>
          <StatsCard label="Companies" value={1} />
        </Link>

        <Link href="/dashboard/users" style={cardStyle}>
          <StatsCard label="Users" value={usersCount} />
        </Link>

        <Link href="/dashboard/sites-projects" style={cardStyle}>
          <StatsCard label="Sites / Projects" value={3} />
        </Link>

        <Link href="/dashboard/safety-reports" style={cardStyle}>
          <StatsCard label="Reports" value={reportsCount} />
        </Link>

        <Link href="/dashboard/action-plans" style={cardStyle}>
          <StatsCard label="Action Plans" value={plansCount} />
        </Link>
      </div>

      {/* HSE */}
      <div style={sectionTitle}>
        HSE Operations (Reports Based)
      </div>

      <div style={gridStyle}>
        <Link href="/dashboard/safety-reports?status=OPEN" style={cardStyle}>
          <StatsCard label="Open" value={openCount} />
        </Link>

        <Link href="/dashboard/safety-reports?status=IN_PROGRESS" style={cardStyle}>
          <StatsCard label="In Progress" value={inProgressCount} />
        </Link>

        <Link href="/dashboard/safety-reports?status=CLOSED" style={cardStyle}>
          <StatsCard label="Closed" value={closedCount} />
        </Link>
      </div>
    </div>
  );
}

// ✅ Responsive Grid (احترافي)
const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: 10,
};

// ✅ Section Title موحد
const sectionTitle: React.CSSProperties = {
  marginTop: 20,
  marginBottom: 6,
  fontWeight: 600,
  fontSize: 13,
  color: "#6b7280",
};

// ✅ Card wrapper
const cardStyle: React.CSSProperties = {
  textDecoration: "none",
  display: "block",
  cursor: "pointer",
  transition: "all 0.2s ease",
};