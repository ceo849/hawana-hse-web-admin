
import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
import StatsCard from "@/components/ui/stats-card";
import { requireAccessToken } from "@/lib/server-auth";
import { decodeJwtPayload } from "@/src/auth/jwt";
import { serverAppFetch } from "@/src/lib/server-app-fetch";

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

  let metrics: PlatformMetrics = {
    companies: 0,
    users: 0,
    sites: 0,
    safetyReports: 0,
    actionPlans: 0,
  };

  const res = await serverAppFetch("/platform/metrics", token);

  // ✅ خارج أي try
  if (res.status === 401) {
    redirect("/login");
  }

  if (res.ok) {
    const json = await res.json();

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

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <PageHeader
        title="Platform Admin"
        subtitle="Platform-wide observability"
      />

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