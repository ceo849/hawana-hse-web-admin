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
        fontSize: 12,
        fontWeight: 700,
        background: bg,
        color,
        whiteSpace: "nowrap",
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
      <div style={container}>
        <PageHeader title="Safety Reports" subtitle="Operational reports" />
        <div style={errorBox}>
          Failed to load safety reports (network/server error)
        </div>
      </div>
    );
  }

  if (!res.ok) {
    return (
      <div style={container}>
        <PageHeader title="Safety Reports" subtitle="Operational reports" />
        <div style={errorBox}>Failed to load safety reports</div>
      </div>
    );
  }

  const json = await res.json();
  const parsed = parseReports(json);
  const items = parsed.data;
  const total = parsed.meta?.total ?? 0;

  return (
    <div style={container}>
      <PageHeader
        title="Safety Reports"
        subtitle="Operational reports"
        action={
          <Link href="/dashboard/safety-reports/new" style={headerAction}>
            + New Safety Report
          </Link>
        }
      />

      <section style={section}>
        <div style={sectionHeader}>
          <div style={sectionTitle}>Reports Register</div>
          <div style={sectionMeta}>Total: {total}</div>
        </div>

        {items.length === 0 ? (
          <div style={emptyBox}>No safety reports found.</div>
        ) : (
          <>
            <div className="desktop-only">
              <div style={tableCard}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: 600,
                  }}
                >
                  <thead>
                    <tr>
                      <th align="left" style={th}>
                        Title
                      </th>
                      <th align="left" style={th}>
                        Status
                      </th>
                      <th align="left" style={th}>
                        Site / Project
                      </th>
                      <th align="left" style={th}>
                        Created At
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((r) => (
                      <tr key={r.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                        <td style={td}>
                          <Link
                            href={`/dashboard/safety-reports/${r.id}`}
                            style={rowLink}
                          >
                            {r.title ?? "-"}
                          </Link>
                        </td>

                        <td style={td}>
                          <StatusBadge status={r.status} />
                        </td>

                        <td style={mutedCell}>{r.siteProjectId ?? "-"}</td>

                        <td style={mutedCell}>{r.createdAt ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mobile-only" style={{ display: "grid", gap: 10 }}>
              {items.map((r) => (
                <Link
                  key={r.id}
                  href={`/dashboard/safety-reports/${r.id}`}
                  style={reportCard}
                >
                  <div style={reportTitle}>{r.title ?? "-"}</div>

                  <div style={{ marginTop: 8 }}>
                    <StatusBadge status={r.status} />
                  </div>

                  <div style={reportMeta}>{r.siteProjectId ?? "-"}</div>

                  <div style={reportDate}>{r.createdAt ?? "-"}</div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

const container: React.CSSProperties = {
  padding: 16,
  fontFamily: "system-ui",
  maxWidth: 680,
  margin: "0 auto",
};

const section: React.CSSProperties = {
  marginTop: 18,
  display: "grid",
  gap: 10,
};

const sectionHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#6b7280",
};

const sectionMeta: React.CSSProperties = {
  fontSize: 12,
  color: "#9ca3af",
  whiteSpace: "nowrap",
};

const headerAction: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px 12px",
  borderRadius: 12,
  background: "#111827",
  color: "#ffffff",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 700,
};

const tableCard: React.CSSProperties = {
  overflowX: "auto",
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const th: React.CSSProperties = {
  padding: "10px 8px",
  fontSize: 12,
  color: "#6b7280",
  fontWeight: 700,
};

const td: React.CSSProperties = {
  padding: "10px 8px",
  whiteSpace: "nowrap",
  fontSize: 13,
};

const mutedCell: React.CSSProperties = {
  ...td,
  color: "#6b7280",
  maxWidth: 180,
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const rowLink: React.CSSProperties = {
  color: "#111827",
  fontWeight: 700,
  textDecoration: "none",
};

const reportCard: React.CSSProperties = {
  display: "block",
  padding: 14,
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  textDecoration: "none",
  color: "inherit",
  background: "#ffffff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const reportTitle: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 15,
  color: "#111827",
};

const reportMeta: React.CSSProperties = {
  marginTop: 10,
  paddingTop: 10,
  borderTop: "1px solid #f3f4f6",
  fontSize: 12,
  color: "#6b7280",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const reportDate: React.CSSProperties = {
  marginTop: 4,
  fontSize: 12,
  color: "#9ca3af",
};

const emptyBox: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  background: "#ffffff",
  padding: 14,
  color: "#6b7280",
  fontSize: 13,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const errorBox: React.CSSProperties = {
  color: "#991b1b",
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: 12,
  padding: 12,
  marginTop: 12,
  fontSize: 13,
};