// app/dashboard/page.tsx

export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import { requireAccessToken } from "@/lib/server-auth";
import PageHeader from "@/components/ui/page-header";
import StatsCard from "@/components/ui/stats-card";
import ActionButton from "@/components/ui/action-button";
import ErrorState from "@/components/ui/error-state";
import { serverAppFetch } from "@/src/lib/server-app-fetch";

type DashboardDto = {
  users?: number;
  companies?: number;
  actionPlans?: number;
  reports?: number;
  reportStats?: {
    open?: number;
    inProgress?: number;
    closed?: number;
  };
};

const USE_NEW_DASHBOARD = false;

export default async function DashboardPage() {
  headers();
  cookies();

  await requireAccessToken();

  let dashboard: DashboardDto = {};

  try {
    if (!USE_NEW_DASHBOARD) {
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
    }

    if (USE_NEW_DASHBOARD) {
      const [
        usersRes,
        companiesRes,
        actionPlansRes,
        reportsRes,
      ] = await Promise.all([
        serverAppFetch("/api/users?limit=1", { cache: "no-store" }),
        serverAppFetch("/api/companies?limit=1", { cache: "no-store" }),
        serverAppFetch("/api/action-plans?limit=1", { cache: "no-store" }),
        serverAppFetch("/api/safety-reports?limit=1", { cache: "no-store" }),
      ]);

      if (
        usersRes.status === 401 ||
        companiesRes.status === 401 ||
        actionPlansRes.status === 401 ||
        reportsRes.status === 401
      ) {
        redirect("/login");
      }

      const usersJson = usersRes.ok ? await usersRes.json() : null;
      const companiesJson = companiesRes.ok ? await companiesRes.json() : null;
      const actionPlansJson = actionPlansRes.ok
        ? await actionPlansRes.json()
        : null;
      const reportsJson = reportsRes.ok
        ? await reportsRes.json()
        : null;

      dashboard = {
        users: usersJson?.meta?.total ?? 0,
        companies: companiesJson?.meta?.total ?? 0,
        actionPlans: actionPlansJson?.meta?.total ?? 0,
        reports: reportsJson?.meta?.total ?? 0,
        reportStats: {
          open:
            reportsJson?.data?.filter((r: any) => r.status === "OPEN").length ??
            0,
          inProgress:
            reportsJson?.data?.filter(
              (r: any) => r.status === "IN_PROGRESS"
            ).length ?? 0,
          closed:
            reportsJson?.data?.filter((r: any) => r.status === "CLOSED").length ??
            0,
        },
      };
    }
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") {
      redirect("/login");
    }

    console.error("FINAL ERROR:", err);

    return (
      <div style={container}>
        <PageHeader
          title="Dashboard"
          subtitle="Platform and HSE operational overview"
        />
        <ErrorState message="Failed to load dashboard data (network/server error)" />
      </div>
    );
  }

  return (
    <div style={container}>
      <PageHeader
        title="Dashboard"
        subtitle="Platform and HSE operational overview"
      />

      <section style={section}>
        <div style={sectionTitle}>Quick Actions</div>

        <div style={grid}>
          <ActionButton href="/dashboard/safety-reports/new">
            + Safety Report
          </ActionButton>

          <ActionButton href="/dashboard/safety-reports">
            + Action Plan (from Report)
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
      </section>

      <section style={section}>
        <div style={sectionTitle}>Platform Metrics</div>

        <div style={grid}>
          <StatsCard label="Companies" value={dashboard.companies ?? 0} />
          <StatsCard label="Users" value={dashboard.users ?? 0} />
          <StatsCard label="Reports" value={dashboard.reports ?? 0} />
          <StatsCard label="Action Plans" value={dashboard.actionPlans ?? 0} />
        </div>
      </section>

      <section style={section}>
        <div style={sectionTitle}>HSE Operations</div>

        <div style={grid}>
          <StatsCard label="Open" value={dashboard.reportStats?.open ?? 0} />
          <StatsCard
            label="In Progress"
            value={dashboard.reportStats?.inProgress ?? 0}
          />
          <StatsCard label="Closed" value={dashboard.reportStats?.closed ?? 0} />
        </div>
      </section>
    </div>
  );
}

/* styles */
const container: React.CSSProperties = {
  padding: 16,
  fontFamily: "system-ui",
  maxWidth: 680,
  margin: "0 auto",
};

const section: React.CSSProperties = {
  marginTop: 20,
  display: "grid",
  gap: 10,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: 10,
  alignItems: "stretch",
};

const sectionTitle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 13,
  color: "#6b7280",
  letterSpacing: "-0.01em",
};