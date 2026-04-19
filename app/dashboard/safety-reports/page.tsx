// app/dashboard/safety-reports/page.tsx

import Link from "next/link";
import { requireAccessToken } from "@/lib/server-auth";
import PageHeader from "@/components/ui/page-header";
import { serverSafeFetch } from "@/src/lib/server-safe-fetch";

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

// ===== Parsers =====
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

// ===== Status Badge =====
function StatusBadge({ status }: { status: string | null }) {
  const s = status ?? "UNKNOWN";

  let bg = "#e5e7eb";
  let color = "#111827";

  if (s === "OPEN") {
    bg = "#fef3c7";
    color = "#92400e";
  } else if (s === "IN_PROGRESS") {
    bg = "#dbeafe";
    color = "#1e40af";
  } else if (s === "COMPLETED") {
    bg = "#dcfce7";
    color = "#166534";
  } else if (s === "VERIFIED") {
    bg = "#bbf7d0";
    color = "#14532d";
  }

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 600,
        background: bg,
        color,
      }}
    >
      {s}
    </span>
  );
}

// ===== PAGE =====
export default async function SafetyReportsPage() {
  const token = await requireAccessToken();

  let items: SafetyReport[] = [];
  let sitesMap: Record<string, string> = {};

  try {
    // ===== Reports =====
    const res = await serverSafeFetch(
      "/safety-reports?page=1&limit=20",
      token
    );

    if (res.ok) {
      const json = await res.json();
      items = parseReports(json);
    } else {
      console.error("Safety Reports Fetch Failed:", res.status);
    }

    // ===== Sites =====
    const sitesRes = await serverSafeFetch(
      "/sites-projects",
      token
    );

    if (sitesRes.ok) {
      const sitesJson = await sitesRes.json();
      const sites = parseSites(sitesJson);

      sitesMap = Object.fromEntries(
        sites.map((s) => [s.id, s.name ?? s.id])
      );
    } else {
      console.error("Sites Fetch Failed:", sitesRes.status);
    }
  } catch (err) {
    console.error("Safety Reports Error:", err);
  }

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <PageHeader title="Safety Reports" subtitle="Operational reports" />

      <div style={{ marginBottom: 12 }}>Total: {items.length}</div>

      {items.length === 0 ? (
        <div>No reports found</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th align="left" style={{ padding: "8px 12px" }}>Title</th>
              <th align="left" style={{ padding: "8px 12px" }}>Status</th>
              <th align="left" style={{ padding: "8px 12px" }}>Site</th>
              <th align="left" style={{ padding: "8px 12px" }}>Created At</th>
            </tr>
          </thead>

          <tbody>
            {items.map((r) => (
              <tr key={r.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                <td style={{ padding: "8px 12px" }}>
                  <Link href={`/dashboard/safety-reports/${r.id}`}>
                    {r.title ?? "-"}
                  </Link>
                </td>

                <td style={{ padding: "8px 12px" }}>
                  <StatusBadge status={r.status} />
                </td>

                <td style={{ padding: "8px 12px" }}>
                  {r.siteProjectId
                    ? sitesMap[r.siteProjectId] ?? r.siteProjectId
                    : "-"}
                </td>

                <td style={{ padding: "8px 12px" }}>
                  {r.createdAt ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}