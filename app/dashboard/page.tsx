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

  let safetyReports: SafetyReport[] = [];
  let actionPlans: ActionPlan[] = [];

  try {
    const [srJson, apJson] = await Promise.all([
      serverAppFetch("/api/safety-reports?page=1&limit=100"),
      serverAppFetch("/api/action-plans"),
    ]);

    safetyReports =
      Array.isArray(srJson)
        ? (srJson as SafetyReport[])
        : Array.isArray((srJson as { data?: unknown[] })?.data)
          ? (((srJson as { data: unknown[] }).data ?? []) as SafetyReport[])
          : [];

    actionPlans =
      Array.isArray(apJson)
        ? (apJson as ActionPlan[])
        : Array.isArray((apJson as { data?: unknown[] })?.data)
          ? (((apJson as { data: unknown[] }).data ?? []) as ActionPlan[])
          : [];
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown dashboard fetch error";

    if (message.includes("401")) {
      redirect("/login");
    }

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
        subtitle="HSE operational overview"
        action={
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {canCreateSafetyReports ? (
              <ActionButton href="/dashboard/safety-reports/new">
                + Safety Report
              </ActionButton>
            ) : null}

            {canCreateActionPlans ? (
              <ActionButton href="/dashboard/action-plans/new">
                + Action Plan
              </ActionButton>
            ) : null}

            {canCreateSites ? (
              <ActionButton href="/dashboard/sites-projects/new">
                + Site / Project
              </ActionButton>
            ) : null}

            {canCreateUsers ? (
              <ActionButton href="/dashboard/users/new">
                + User
              </ActionButton>
            ) : null}
          </div>
        }
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        <StatsCard
          label="Safety Reports"
          value={safetyReports.length}
          helper="Total reports"
          href="/dashboard/safety-reports"
        />

        <StatsCard
          label="Open Reports"
          value={openReports}
          helper="Waiting for action"
          href="/dashboard/safety-reports?status=OPEN"
        />

        <StatsCard
          label="Reports In Progress"
          value={inProgressReports}
          helper="Under treatment"
          href="/dashboard/safety-reports?status=IN_PROGRESS"
        />

        <StatsCard
          label="Closed Reports"
          value={closedReports}
          helper="Resolved reports"
          href="/dashboard/safety-reports?status=CLOSED"
        />

        <StatsCard
          label="Action Plans"
          value={actionPlans.length}
          helper="Total plans"
          href="/dashboard/action-plans"
        />

        <StatsCard
          label="Open Action Plans"
          value={openPlans}
          helper="Not started yet"
          href="/dashboard/action-plans?status=OPEN"
        />

        <StatsCard
          label="In Progress Plans"
          value={inProgressPlans}
          helper="Execution active"
          href="/dashboard/action-plans?status=IN_PROGRESS"
        />

        <StatsCard
          label="Completed Plans"
          value={completedPlans}
          helper="Waiting for verification"
          href="/dashboard/action-plans?status=COMPLETED"
        />

        <StatsCard
          label="Verified Plans"
          value={verifiedPlans}
          helper="Fully closed"
          href="/dashboard/action-plans?status=VERIFIED"
        />

        <StatsCard
          label="Overdue Plans"
          value={overduePlans}
          helper="Past due date"
          href="/dashboard/action-plans"
        />
      </div>
    </div>
  );
}