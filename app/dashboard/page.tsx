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

  if (!token) {
    redirect("/login");
  }

  const payload = decodeJwtPayload(token);
  const role: Role = (payload?.role as Role) ?? "UNKNOWN";

  return (
    <div
      style={{
        padding: 16,
        fontFamily: "system-ui",
        maxWidth: 680,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Platform and HSE operational overview"
      />

      {/* Quick Actions */}
      <div
        style={{
          marginTop: 16,
          marginBottom: 8,
          fontWeight: 600,
          fontSize: 13,
          color: "#6b7280",
        }}
      >
        Quick Actions
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
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
      <div
        style={{
          marginTop: 24,
          marginBottom: 8,
          fontWeight: 600,
          fontSize: 13,
          color: "#6b7280",
        }}
      >
        Platform Metrics
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <StatsCard label="Companies" value={1} />
        <StatsCard label="Users" value={7} />
        <StatsCard label="Sites" value={3} />
        <StatsCard label="Reports" value={3} />

        <div style={{ gridColumn: "span 2" }}>
          <StatsCard label="Plans" value={3} />
        </div>
      </div>

      {/* HSE Operations */}
      <div
        style={{
          marginTop: 24,
          marginBottom: 8,
          fontWeight: 600,
          fontSize: 13,
          color: "#6b7280",
        }}
      >
        HSE Operations
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: 12,
        }}
      >
        <StatsCard label="Open" value={0} />

        <div style={{ gridColumn: "span 1" }}>
          <StatsCard label="In Progress" value={1} />
        </div>

        <StatsCard label="Closed" value={2} />
        <StatsCard label="Completed" value={1} />

        <StatsCard label="Verified" value={2} />
        <StatsCard label="Overdue" value={0} />
      </div>
    </div>
  );
}