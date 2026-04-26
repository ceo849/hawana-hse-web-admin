// app/dashboard/safety-reports/page.tsx

export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import PageHeader from "@/components/ui/page-header";
import ErrorState from "@/components/ui/error-state";
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
  } else if (s === "VERIFIED" || s === "CLOSED") {
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
    if (err?.message === "SESSION_EXPIRED") redirect("/login");

    console.error("Safety Reports Fetch Error:", err);

    return (
      <div style={container}>
        <PageHeader title="Safety Reports" subtitle="Operational reports" />
        <ErrorState message="Failed to load safety reports (network/server error)" />
      </div>
    );
  }

  if (res.status === 401) redirect("/login");

  if (!res.ok) {
    return (
      <div style={container}>
        <PageHeader title="Safety Reports" subtitle="Operational reports" />
        <ErrorState message="Failed to load safety reports" />
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
            <div style={tableCard}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {items.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <Link href={`/dashboard/safety-reports/${r.id}`}>
                          {r.title ?? "-"}
                        </Link>
                      </td>
                      <td>
                        <StatusBadge status={r.status} />
                      </td>
                      <td>{r.siteProjectId ?? "-"}</td>
                      <td>{r.createdAt ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

/* ================= STYLES ================= */

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
  justifyContent: "space-between",
};

const sectionTitle: React.CSSProperties = {
  fontWeight: 700,
};

const sectionMeta: React.CSSProperties = {
  fontSize: 12,
  color: "#999",
};

const headerAction: React.CSSProperties = {
  padding: "8px 12px",
  background: "#111",
  color: "#fff",
};

const tableCard: React.CSSProperties = {
  overflowX: "auto",
};

const emptyBox: React.CSSProperties = {
  padding: 12,
  border: "1px solid #eee",
};