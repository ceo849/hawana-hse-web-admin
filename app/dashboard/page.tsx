import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

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

function cardStyle() {
  return {
    display: "block",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 18,
    background: "#fff",
    textDecoration: "none",
    color: "#111",
  } as const;
}

type DashboardCardProps = {
  label: string;
  value: number;
  helper: string;
  href: string;
};

function DashboardCard({
  label,
  value,
  helper,
  href,
}: DashboardCardProps) {
  return (
    <a href={href} style={cardStyle()}>
      <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
        {label}
      </div>

      <div style={{ fontSize: 34, fontWeight: 900 }}>{value}</div>

      <div style={{ marginTop: 10, fontSize: 14, color: "#333" }}>
        {helper}
      </div>
    </a>
  );
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${host}`;

  let safetyReports: SafetyReport[] = [];
  let actionPlans: ActionPlan[] = [];

  try {
    const [srRes, apRes] = await Promise.all([
      fetch(`${origin}/api/safety-reports?page=1&limit=100`, {
        method: "GET",
        cache: "no-store",
        headers: {
          cookie: cookieStore.toString(),
        },
      }),
      fetch(`${origin}/api/action-plans`, {
        method: "GET",
        cache: "no-store",
        headers: {
          cookie: cookieStore.toString(),
        },
      }),
    ]);

    if (srRes.status === 401 || apRes.status === 401) {
      redirect("/login");
    }

    const srJson = (await srRes.json()) as unknown;
    const apJson = (await apRes.json()) as unknown;

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
  } catch {
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
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 34, fontWeight: 900, margin: 0 }}>
          Dashboard
        </h1>

        <div style={{ marginTop: 8, color: "#555", fontSize: 14 }}>
          HSE operational overview
        </div>
      </div>

      <div
        style={{
          marginBottom: 28,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <a
          href="/dashboard/safety-reports/new"
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            background: "#111",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          + Safety Report
        </a>

        <a
          href="/dashboard/action-plans/new"
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            background: "#111",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          + Action Plan
        </a>

        <a
          href="/dashboard/sites-projects/new"
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            background: "#111",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          + Site / Project
        </a>

        <a
          href="/dashboard/users/new"
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            background: "#111",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          + User
        </a>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        <DashboardCard
          label="Safety Reports"
          value={safetyReports.length}
          helper="Total reports"
          href="/dashboard/safety-reports"
        />

        <DashboardCard
          label="Open Reports"
          value={openReports}
          helper="Waiting for action"
          href="/dashboard/safety-reports?status=OPEN"
        />

        <DashboardCard
          label="Reports In Progress"
          value={inProgressReports}
          helper="Under treatment"
          href="/dashboard/safety-reports?status=IN_PROGRESS"
        />

        <DashboardCard
          label="Closed Reports"
          value={closedReports}
          helper="Resolved reports"
          href="/dashboard/safety-reports?status=CLOSED"
        />

        <DashboardCard
          label="Action Plans"
          value={actionPlans.length}
          helper="Total plans"
          href="/dashboard/action-plans"
        />

        <DashboardCard
          label="Open Action Plans"
          value={openPlans}
          helper="Not started yet"
          href="/dashboard/action-plans?status=OPEN"
        />

        <DashboardCard
          label="In Progress Plans"
          value={inProgressPlans}
          helper="Execution active"
          href="/dashboard/action-plans?status=IN_PROGRESS"
        />

        <DashboardCard
          label="Completed Plans"
          value={completedPlans}
          helper="Waiting for verification"
          href="/dashboard/action-plans?status=COMPLETED"
        />

        <DashboardCard
          label="Verified Plans"
          value={verifiedPlans}
          helper="Fully closed"
          href="/dashboard/action-plans?status=VERIFIED"
        />

        <DashboardCard
          label="Overdue Plans"
          value={overduePlans}
          helper="Past due date"
          href="/dashboard/action-plans"
        />
      </div>
    </div>
  );
}