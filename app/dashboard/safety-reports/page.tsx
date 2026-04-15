import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import PageHeader from "@/components/ui/page-header";
import { decodeJwtPayload } from "@/src/auth/jwt";

type Role =
  | "OWNER"
  | "ADMIN"
  | "MANAGER"
  | "WORKER"
  | "VIEWER"
  | "UNKNOWN";

type SafetyReport = {
  id: string;
  title: string | null;
  description: string | null;
  status: string | null;
  createdAt: string | null;
  siteProjectId?: string | null;
};

type SiteProject = {
  id: string;
  name: string | null;
};

function isSafetyReport(value: unknown): value is SafetyReport {
  if (typeof value !== "object" || value === null) return false;

  const c = value as Record<string, unknown>;

  return (
    typeof c.id === "string" &&
    (typeof c.title === "string" || c.title === null) &&
    (typeof c.description === "string" || c.description === null) &&
    (typeof c.status === "string" || c.status === null) &&
    (typeof c.createdAt === "string" || c.createdAt === null)
  );
}

function parseReports(value: unknown): SafetyReport[] {
  if (Array.isArray(value)) return value.filter(isSafetyReport);

  if (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as any).data)
  ) {
    return (value as any).data.filter(isSafetyReport);
  }

  return [];
}

function parseSites(value: unknown): SiteProject[] {
  if (Array.isArray(value)) return value as SiteProject[];

  if (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as any).data)
  ) {
    return (value as any).data as SiteProject[];
  }

  return [];
}

export default async function SafetyReportsPage() {
  const token = await requireAccessToken();

  const payload = decodeJwtPayload(token);
  const role: Role = (payload?.role as Role) ?? "UNKNOWN";

  const CORE_API =
    (process.env.NEXT_PUBLIC_API_BASE_URL ??
      "http://localhost:3001").replace(/\/$/, "");

  let items: SafetyReport[] = [];
  let sitesMap: Record<string, string> = {};

  // ===== Fetch Reports =====
  const reportsRes = await fetch(
    `${CORE_API}/v1/safety-reports?page=1&limit=20`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (reportsRes.status === 401) redirect("/login");

  if (!reportsRes.ok) {
    if (reportsRes.status === 403) {
      return (
        <div style={{ fontFamily: "system-ui", padding: 24 }}>
          <PageHeader title="Safety Reports" subtitle="Operational reports" />
          <div style={{ color: "#b91c1c", marginTop: 12 }}>
            Access restricted — subscription inactive
          </div>
        </div>
      );
    }

    return <div>Failed to load safety reports</div>;
  }

  const reportsJson = await reportsRes.json();
  items = parseReports(reportsJson);

  // ===== Fetch Sites (Additive) =====
  const sitesRes = await fetch(`${CORE_API}/v1/sites-projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (sitesRes.ok) {
    const sitesJson = await sitesRes.json();
    const sites = parseSites(sitesJson);

    sitesMap = Object.fromEntries(
      sites.map((s) => [s.id, s.name ?? s.id])
    );
  }

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <PageHeader title="Safety Reports" subtitle="Operational reports" />

      <div style={{ marginBottom: 12 }}>Total: {items.length}</div>

      <table style={{ width: "100%" }}>
        <tbody>
          {items.map((r) => (
            <tr key={r.id}>
              <td>{r.title ?? "-"}</td>
              <td>{r.status ?? "-"}</td>

              {/* ✅ Show Site Name instead of ID */}
              <td>
                {r.siteProjectId
                  ? sitesMap[r.siteProjectId] ?? r.siteProjectId
                  : "-"}
              </td>

              <td>{r.createdAt ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}