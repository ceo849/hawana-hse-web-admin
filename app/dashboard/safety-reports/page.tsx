// app/dashboard/safety-reports/page.tsx

export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";

import { requireAccessToken } from "@/lib/server-auth";
import PageHeader from "@/components/ui/page-header";
import ErrorState from "@/components/ui/error-state";
import EmptyState from "@/components/ui/empty-state";
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
  if (Array.isArray(value)) {
    return {
      data: value.filter(isSafetyReport),
      meta: { total: value.length },
    };
  }

  if (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { data?: unknown }).data)
  ) {
    const raw = value as {
      data: unknown[];
      meta?: { total?: unknown };
    };

    return {
      data: raw.data.filter(isSafetyReport),
      meta: {
        total:
          typeof raw.meta?.total === "number"
            ? raw.meta.total
            : raw.data.length,
      },
    };
  }

  return { data: [], meta: { total: 0 } };
}

// ✅ UI Mapping (NO BUSINESS LOGIC)
const STATUS_UI_MAP: Record<string, { bg: string; color: string }> = {
  OPEN: { bg: "#fef3c7", color: "#92400e" },
  IN_PROGRESS: { bg: "#dbeafe", color: "#1e40af" },
  COMPLETED: { bg: "#dcfce7", color: "#166534" },
  VERIFIED: { bg: "#dcfce7", color: "#166534" },
  CLOSED: { bg: "#dcfce7", color: "#166534" },
};

function StatusBadge({ status }: { status: string | null }) {
  const s = status ?? "UNKNOWN";

  const ui = STATUS_UI_MAP[s] ?? {
    bg: "#e5e7eb",
    color: "#111827",
  };

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: 12,
        fontWeight: 700,
        background: ui.bg,
        color: ui.color,
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
          <EmptyState message="No safety reports found." />
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {items.map((r) => (
              <Link
                key={r.id}
                href={`/dashboard/safety-reports/${r.id}`}
                style={card}
              >
                <div style={cardTop}>
                  <div style={title}>{r.title ?? "-"}</div>
                  <StatusBadge status={r.status} />
                </div>

                <div style={meta}>
                  Site: {r.siteProjectId ?? "-"}
                </div>

                <div style={date}>
                  {r.createdAt ?? "-"}
                </div>
              </Link>
            ))}
          </div>
        )}
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
  marginTop: 18,
  display: "grid",
  gap: 10,
};

const sectionHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#6b7280",
};

const sectionMeta: React.CSSProperties = {
  fontSize: 12,
  color: "#9ca3af",
};

const headerAction: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 12,
  background: "#111827",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 700,
};

const card: React.CSSProperties = {
  display: "block",
  padding: 14,
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  background: "#fff",
  textDecoration: "none",
  color: "inherit",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const cardTop: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
};

const title: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 15,
};

const meta: React.CSSProperties = {
  marginTop: 10,
  fontSize: 12,
  color: "#6b7280",
};

const date: React.CSSProperties = {
  marginTop: 4,
  fontSize: 12,
  color: "#9ca3af",
};