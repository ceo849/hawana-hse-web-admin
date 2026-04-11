import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
import StatsCard from "@/components/ui/stats-card";
import ActionButton from "@/components/ui/action-button";
import { decodeJwtPayload } from "@/src/auth/jwt";
import { serverAppFetch } from "@/src/lib/server-app-fetch";

type Role = "OWNER" | "ADMIN" | "MANAGER" | "WORKER" | "VIEWER" | "UNKNOWN";

type SafetyReport = {
  id: string;
  status?: string | null;
};

type ActionPlan = {
  id: string;
  status?: string | null;
  dueDate?: string | null;
};

type PlatformMetrics = {
  companies: number;
  users: number;
  sites: number;
  safetyReports: number;
  actionPlans: number;
};

function countByStatus<T extends { status?: string | null }>(
  items: T[],
  expected: string,
) {
  return items.filter(
    (item) => String(item.status ?? "").toUpperCase() === expected,
  ).length;
}

function isOverdue(dueDate?: string | null) {
  if (!dueDate) return false;

  const d = new Date(dueDate);
  if (Number.isNaN(d.getTime())) return false;

  return d.getTime() < Date.now();
}

function parseArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { data?: unknown[] }).data)
  ) {
    return ((value as { data: unknown[] }).data ?? []) as T[];
  }

  return [];
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = decodeJwtPayload(token);
  const currentRole: Role = (payload?.role as Role) ?? "UNKNOWN";

  const canCreateSafetyReports =
    currentRole !== "VIEWER" && currentRole !== "UNKNOWN";
  const canCreateActionPlans =
    currentRole !== "VIEWER" && currentRole !== "UNKNOWN";
  const canCreateSites =
    currentRole === "OWNER" ||
    currentRole === "ADMIN" ||
    currentRole === "MANAGER";
  const canCreateUsers = currentRole === "OWNER" || currentRole === "ADMIN";
  const canViewPlatformMetrics = currentRole === "OWNER";

  let platformMetrics: PlatformMetrics = {
    companies: 0,
    users: 0,
    sites: 0,
    safetyReports: 0,
    actionPlans: 0,
  };

  let safetyReports: SafetyReport[] = [];
  let actionPlans: ActionPlan[] = [];

  try {
    const requests: Promise<unknown>[] = [
      serverAppFetch("/api/safety-reports?page=1&limit=100"),
      serverAppFetch("/api/action-plans"),
      serverAppFetch("/api/users"),
      serverAppFetch("/api/companies"),
      serverAppFetch("/api/sites-projects"),
    ];

    const results = await Promise.allSettled(requests);

    const safeResults = results.map((r) =>
      r.status === "fulfilled" ? r.value : null,
    );

    safetyReports = parseArray<SafetyReport>(safeResults[0]);
    actionPlans = parseArray<ActionPlan>(safeResults[1]);

    const users = parseArray(safeResults[2]);
    const companies = parseArray(safeResults[3]);
    const sites = parseArray(safeResults[4]);

    platformMetrics = {
      companies: companies.length,
      users: users.length,
      sites: sites.length,
      safetyReports: safetyReports.length,
      actionPlans: actionPlans.length,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown dashboard fetch error";

    console.error("Dashboard Fetch Error:", {
      message,
      role: currentRole,
    });

    if (
      message.includes("401") ||
      message.toLowerCase().includes("unauthorized")
    ) {
      redirect("/login");
    }

    platformMetrics = {
      companies: 0,
      users: 0,
      sites: 0,
      safetyReports: 0,
      actionPlans: 0,
    };
    safetyReports = [];
    actionPlans = [];
  }

  const openReports = countByStatus(safetyReports, "OPEN");
  const inProgressReports = countByStatus(safetyReports, "IN_PROGRESS");
  const closedReports = countByStatus(safetyReports, "CLOSED");

  const openPlans = countByStatus(actionPlans, "OPEN");
  const inProgressPlans = countByStatus(actionPlans, "IN_PROGRESS");
  const completedPlans = countByStatus(actionPlans, "COMPLETED");
  const verifiedPlans = countByStatus(actionPlans, "VERIFIED");

  const overduePlans = actionPlans.filter(
    (ap) =>
      isOverdue(ap.dueDate) &&
      !["COMPLETED", "VERIFIED"].includes(
        String(ap.status ?? "").toUpperCase(),
      ),
  ).length;

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <PageHeader
        title="Dashboard"
        subtitle="Platform and HSE operational overview"
        action={
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {canCreateSafetyReports && (
              <ActionButton href="/dashboard/safety-reports/new">
                + Safety Report
              </ActionButton>
            )}

            {canCreateActionPlans && (
              <ActionButton href="/dashboard/action-plans/new">
                + Action Plan
              </ActionButton>
            )}

            {canCreateSites && (
              <ActionButton href="/dashboard/sites-projects/new">
                + Site / Project
              </ActionButton>
            )}

            {canCreateUsers && (
              <ActionButton href="/dashboard/users/new">
                + User
              </ActionButton>
            )}
          </div>
        }
      />

      {canViewPlatformMetrics && (
        <>
          <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 700 }}>
            Platform Metrics
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              marginBottom: 24,
            }}
          >
            <StatsCard label="Companies" value={platformMetrics.companies} />
            <StatsCard label="Users" value={platformMetrics.users} />
            <StatsCard label="Sites / Projects" value={platformMetrics.sites} />
            <StatsCard label="Safety Reports" value={platformMetrics.safetyReports} />
            <StatsCard label="Action Plans" value={platformMetrics.actionPlans} />
          </div>
        </>
      )}

      <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 700 }}>
        HSE Operations
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        <StatsCard label="Open Reports" value={openReports} />
        <StatsCard label="Reports In Progress" value={inProgressReports} />
        <StatsCard label="Closed Reports" value={closedReports} />
        <StatsCard label="Open Action Plans" value={openPlans} />
        <StatsCard label="In Progress Plans" value={inProgressPlans} />
        <StatsCard label="Completed Plans" value={completedPlans} />
        <StatsCard label="Verified Plans" value={verifiedPlans} />
        <StatsCard label="Overdue Plans" value={overduePlans} />
      </div>
    </div>
  );
}