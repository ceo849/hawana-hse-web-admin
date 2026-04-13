import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
import StatsCard from "@/components/ui/stats-card";
import { requireAccessToken } from "@/lib/server-auth";
import { decodeJwtPayload } from "@/src/auth/jwt";

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

export default async function AdminPage() {
  const token = await requireAccessToken();
  const payload = decodeJwtPayload(token);
  const role = String(payload?.role ?? "UNKNOWN").toUpperCase();

  if (role !== "OWNER") {
    redirect("/dashboard");
  }

  const CORE_API =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:3001";

  let metrics: PlatformMetrics | null = null;
  let fallbackMode = false;

  // ✅ DIRECT CALL (بدون proxy)
  try {
    const r = await fetch(`${CORE_API}/v1/platform/metrics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (r.status === 401) redirect("/login");

    if (r.ok) {
      const json = await r.json();

      if (
        isObject(json) &&
        typeof json.companies === "number" &&
        typeof json.users === "number" &&
        typeof json.sites === "number" &&
        typeof json.safetyReports === "number" &&
        typeof json.actionPlans === "number"
      ) {
        metrics = json as PlatformMetrics;
      }
    }
  } catch {}

  // fallback
  if (!metrics) {
    fallbackMode = true;

    try {
      const [
        companiesRes,
        usersRes,
        sitesRes,
        reportsRes,
        plansRes,
      ] = await Promise.all([
        fetch(`${CORE_API}/v1/companies?page=1&limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${CORE_API}/v1/users?page=1&limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${CORE_API}/v1/sites-projects`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${CORE_API}/v1/safety-reports?page=1&limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${CORE_API}/v1/action-plans`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (
        [
          companiesRes,
          usersRes,
          sitesRes,
          reportsRes,
          plansRes,
        ].some((r) => r.status === 401)
      ) {
        redirect("/login");
      }

      const [
        companiesJson,
        usersJson,
        sitesJson,
        reportsJson,
        plansJson,
      ] = await Promise.all([
        companiesRes.json(),
        usersRes.json(),
        sitesRes.json(),
        reportsRes.json(),
        plansRes.json(),
      ]);

      const pick = (v: any) =>
        Array.isArray(v?.data) ? v.data.length : Array.isArray(v) ? v.length : 0;

      metrics = {
        companies: pick(companiesJson),
        users: pick(usersJson),
        sites: pick(sitesJson),
        safetyReports: pick(reportsJson),
        actionPlans: pick(plansJson),
      };
    } catch {
      metrics = {
        companies: 0,
        users: 0,
        sites: 0,
        safetyReports: 0,
        actionPlans: 0,
      };
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <PageHeader
        title="Platform Admin"
        subtitle="Platform-wide observability"
      />

      {fallbackMode && (
        <div style={{ marginBottom: 10, color: "#666" }}>
          Fallback mode active
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        <StatsCard label="Companies" value={metrics.companies} />
        <StatsCard label="Users" value={metrics.users} />
        <StatsCard label="Sites" value={metrics.sites} />
        <StatsCard label="Reports" value={metrics.safetyReports} />
        <StatsCard label="Plans" value={metrics.actionPlans} />
      </div>
    </div>
  );
}