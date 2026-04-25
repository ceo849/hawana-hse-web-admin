export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import PageHeader from "@/components/ui/page-header";
import { serverAppFetch } from "@/src/lib/server-app-fetch";

type SafetyReport = {
  id: string;
  title: string | null;
  description: string | null;
  status: string | null;
  createdAt: string | null;
  siteProjectId?: string | null;
};

type SafetyReportsResponse = {
  data: SafetyReport[];
  meta?: {
    total?: number;
  };
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

function parseReports(value: unknown): SafetyReportsResponse {
  if (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { data?: unknown }).data)
  ) {
    const raw = value as {
      data: unknown[];
      meta?: {
        total?: unknown;
      };
    };

    return {
      data: raw.data.filter(isSafetyReport),
      meta: {
        total:
          typeof raw.meta?.total === "number" ? raw.meta.total : undefined,
      },
    };
  }

  return { data: [], meta: { total: undefined } };
}

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
  } else if (s === "CLOSED") {
    bg = "#dcfce7";
    color = "#166534";
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

export default async function SafetyReportsPage() {
  await requireAccessToken();

  let res: Response;

  try {
    res = await serverAppFetch("/api/safety-reports?page=1&limit=20", {
      cache: "no-store",
    });
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") {
      redirect("/login");
    }

    console.error("Safety Reports Fetch Error:", err);

    return (
      <div style={{ fontFamily: "system-ui", padding: 16 }}>
        <PageHeader title="Safety Reports" subtitle="Operational reports" />
        <div style={{ color: "red", marginTop: 12 }}>
          Failed to load safety reports (network/server error)
        </div>
      </div>
    );
  }

  if (!res.ok) {
    return (
      <div style={{ fontFamily: "system-ui", padding: 16 }}>
        <PageHeader title="Safety Reports" subtitle="Operational reports" />
        <div style={{ color: "red", marginTop: 12 }}>
          Failed to load safety reports
        </div>
      </div>
    );
  }

  const json = await res.json();
  const parsed = parseReports(json);
  const items = parsed.data;
  const total = parsed.meta?.total ?? 0;

  return (
    <div style={{ fontFamily: "system-ui", padding: 16 }}>
      <PageHeader
        title="Safety Reports"
        subtitle="Operational reports"
        action={
          <Link href="/dashboard/safety-reports/new">
            + New Safety Report
          </Link>
        }
      />

      <div style={{ marginBottom: 12 }}>Total: {total}</div>

      {items.length === 0 ? (
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            background: "#ffffff",
            padding: 16,
            color: "#6b7280",
          }}
        >
          No safety reports found.
        </div>
      ) : (
        <>
          <div className="desktop-only">
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 600,
                }}
              >
                <thead>
                  <tr>
                    <th align="left" style={{ padding: "8px 12px" }}>
                      Title
                    </th>
                    <th align="left" style={{ padding: "8px 12px" }}>
                      Status
                    </th>
                    <th align="left" style={{ padding: "8px 12px" }}>
                      Site / Project
                    </th>
                    <th align="left" style={{ padding: "8px 12px" }}>
                      Created At
                    </th>
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
                        {r.siteProjectId ?? "-"}
                      </td>

                      <td style={{ padding: "8px 12px" }}>
                        {r.createdAt ?? "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mobile-only" style={{ marginTop: 12 }}>
            {items.map((r) => (
              <Link
                key={r.id}
                href={`/dashboard/safety-reports/${r.id}`}
                style={{
                  display: "block",
                  padding: 16,
                  borderRadius: 14,
                  border: "1px solid #e5e7eb",
                  marginBottom: 12,
                  textDecoration: "none",
                  color: "inherit",
                  background: "#ffffff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 6 }}>
                  {r.title ?? "-"}
                </div>

                <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <StatusBadge status={r.status} />
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    marginBottom: 4,
                  }}
                >
                  {r.siteProjectId ?? "-"}
                </div>

                <div style={{ fontSize: 12, color: "#9ca3af" }}>
                  {r.createdAt ?? "-"}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}