import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
import StatsCard from "@/components/ui/stats-card";
import { requireAccessToken } from "@/lib/server-auth";
import { api } from "@/lib/core-api";
import { decodeJwtPayload } from "@/src/auth/jwt";

type CompanyDto = {
  id: string;
};

type UserDto = {
  id: string;
};

type SiteProjectDto = {
  id: string;
};

type SafetyReportDto = {
  id: string;
};

type ActionPlanDto = {
  id: string;
};

type PlatformMetrics = {
  companies: number;
  users: number;
  sites: number;
  safetyReports: number;
  actionPlans: number;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function pickArray<T>(
  value: unknown,
  guard: (item: unknown) => item is T,
): T[] {
  if (Array.isArray(value)) {
    return value.filter(guard);
  }

  if (isObject(value) && Array.isArray(value.data)) {
    return value.data.filter(guard);
  }

  return [];
}

function isCompanyDto(value: unknown): value is CompanyDto {
  return isObject(value) && typeof value.id === "string";
}

function isUserDto(value: unknown): value is UserDto {
  return isObject(value) && typeof value.id === "string";
}

function isSiteProjectDto(value: unknown): value is SiteProjectDto {
  return isObject(value) && typeof value.id === "string";
}

function isSafetyReportDto(value: unknown): value is SafetyReportDto {
  return isObject(value) && typeof value.id === "string";
}

function isActionPlanDto(value: unknown): value is ActionPlanDto {
  return isObject(value) && typeof value.id === "string";
}

async function safeJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export default async function AdminPage() {
  const token = await requireAccessToken();
  const payload = decodeJwtPayload(token);
  const role = String(payload?.role ?? "UNKNOWN").toUpperCase();

  if (role !== "OWNER") {
    redirect("/dashboard");
  }

  let metrics: PlatformMetrics | null = null;
  let fallbackMode = false;

  try {
    const r = await fetch(api("/platform/metrics"), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (r.status === 401) {
      redirect("/login");
    }

    if (r.ok) {
      const json = (await r.json()) as unknown;

      if (
        isObject(json) &&
        typeof json.companies === "number" &&
        typeof json.users === "number" &&
        typeof json.sites === "number" &&
        typeof json.safetyReports === "number" &&
        typeof json.actionPlans === "number"
      ) {
        metrics = {
          companies: json.companies,
          users: json.users,
          sites: json.sites,
          safetyReports: json.safetyReports,
          actionPlans: json.actionPlans,
        };
      }
    }
  } catch {
    // fallback below
  }

  if (!metrics) {
    fallbackMode = true;

    const [companiesRes, usersRes, sitesRes, safetyReportsRes, actionPlansRes] =
      await Promise.all([
        fetch(api("/companies?page=1&limit=100"), {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }),
        fetch(api("/users?page=1&limit=100"), {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }),
        fetch(api("/sites-projects"), {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }),
        fetch(api("/safety-reports?page=1&limit=100"), {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }),
        fetch(api("/action-plans"), {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }),
      ]);

    const statuses = [
      companiesRes.status,
      usersRes.status,
      sitesRes.status,
      safetyReportsRes.status,
      actionPlansRes.status,
    ];

    if (statuses.includes(401)) {
      redirect("/login");
    }

    const [
      companiesJson,
      usersJson,
      sitesJson,
      safetyReportsJson,
      actionPlansJson,
    ] = await Promise.all([
      safeJson(companiesRes),
      safeJson(usersRes),
      safeJson(sitesRes),
      safeJson(safetyReportsRes),
      safeJson(actionPlansRes),
    ]);

    metrics = {
      companies: pickArray(companiesJson, isCompanyDto).length,
      users: pickArray(usersJson, isUserDto).length,
      sites: pickArray(sitesJson, isSiteProjectDto).length,
      safetyReports: pickArray(safetyReportsJson, isSafetyReportDto).length,
      actionPlans: pickArray(actionPlansJson, isActionPlanDto).length,
    };
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <PageHeader
        title="Platform Admin"
        subtitle="Platform-wide observability first. Control actions remain limited and separate."
      />

      <div
        style={{
          marginBottom: 16,
          padding: 14,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          background: "#fff",
          fontSize: 13,
          color: "#444",
        }}
      >
        <div style={{ fontWeight: 700, color: "#111", marginBottom: 6 }}>
          Scope of this page
        </div>
        <div>
          This page is read-only platform insight. It summarizes tenant and
          operational volume across the platform without introducing platform
          control actions yet.
        </div>
        {fallbackMode ? (
          <div style={{ marginTop: 8, color: "#666" }}>
            Fallback mode active: platform metrics endpoint is not available yet,
            so counts are derived from existing modules.
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <StatsCard
          label="Companies"
          value={metrics.companies}
          helper="Total tenant companies"
          href="/dashboard/companies"
        />

        <StatsCard
          label="Users"
          value={metrics.users}
          helper="Total platform users"
          href="/dashboard/users"
        />

        <StatsCard
          label="Sites / Projects"
          value={metrics.sites}
          helper="Operational locations"
          href="/dashboard/sites-projects"
        />

        <StatsCard
          label="Safety Reports"
          value={metrics.safetyReports}
          helper="Total reports"
          href="/dashboard/safety-reports"
        />

        <StatsCard
          label="Action Plans"
          value={metrics.actionPlans}
          helper="Total action plans"
          href="/dashboard/action-plans"
        />
      </div>
    </div>
  );
}