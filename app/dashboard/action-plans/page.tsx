// app/dashboard/action-plans/page.tsx

export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";

import { requireAccessToken } from "@/lib/server-auth";
import PageHeader from "@/components/ui/page-header";
import ErrorState from "@/components/ui/error-state";
import EmptyState from "@/components/ui/empty-state";
import { decodeJwtPayload } from "@/src/auth/jwt";
import { serverAppFetch } from "@/src/lib/server-app-fetch";

// ✅ FIX: rename import to avoid conflict
import { parseActionPlans as parseActionPlansExternal } from "@/src/lib/parsers/action-plans.parser";

type Role =
  | "OWNER"
  | "ADMIN"
  | "MANAGER"
  | "WORKER"
  | "VIEWER"
  | "UNKNOWN";

type ActionPlan = {
  id: string;
  title: string;
  description: string | null;
  status: string;
};

type ActionPlansResponse = {
  data: ActionPlan[];
  meta?: {
    total?: number;
  };
};

function isActionPlan(v: unknown): v is ActionPlan {
  if (typeof v !== "object" || v === null) return false;

  const c = v as Record<string, unknown>;

  return (
    typeof c.id === "string" &&
    typeof c.title === "string" &&
    (typeof c.description === "string" || c.description === null) &&
    typeof c.status === "string"
  );
}

function parseActionPlans(value: unknown): ActionPlansResponse {
  if (Array.isArray(value)) {
    return {
      data: value.filter(isActionPlan),
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
      data: raw.data.filter(isActionPlan),
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

// ✅ UI Mapping (Status)
const STATUS_UI_MAP: Record<string, { bg: string; color: string }> = {
  OPEN: { bg: "#fef3c7", color: "#92400e" },
  IN_PROGRESS: { bg: "#dbeafe", color: "#1e40af" },
  COMPLETED: { bg: "#dcfce7", color: "#166534" },
  VERIFIED: { bg: "#bbf7d0", color: "#14532d" },
};

function StatusBadge({ status }: { status: string }) {
  const ui = STATUS_UI_MAP[status] ?? {
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
      {status}
    </span>
  );
}

// ✅ UI Capability Map (NO BUSINESS LOGIC)
const ROLE_UI_CAPABILITIES: Record<Role, { canCreate: boolean }> = {
  OWNER: { canCreate: true },
  ADMIN: { canCreate: true },
  MANAGER: { canCreate: true },
  WORKER: { canCreate: false },
  VIEWER: { canCreate: false },
  UNKNOWN: { canCreate: false },
};

export default async function ActionPlansPage() {
  headers();
  cookies();

  const token = await requireAccessToken();

  const payload = decodeJwtPayload(token);
  const role: Role = (payload?.role as Role) ?? "UNKNOWN";

  const canShowCreateAction =
    ROLE_UI_CAPABILITIES[role]?.canCreate ?? false;

  let res: Response;

  try {
    res = await serverAppFetch(
      "/api/action-plans?page=1&limit=20",
      token,
      { cache: "no-store" }
    );
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") {
      redirect("/login");
    }

    console.error("Action Plans Fetch Error:", err);

    return (
      <div style={container}>
        <PageHeader
          title="Action Plans"
          subtitle="Track execution"
        />
        <ErrorState message="Failed to load action plans (network/server error)" />
      </div>
    );
  }

  if (res.status === 401) {
    redirect("/login");
  }

  if (!res.ok) {
    return (
      <div style={container}>
        <PageHeader
          title="Action Plans"
          subtitle="Track execution"
        />
        <ErrorState message="Failed to load action plans" />
      </div>
    );
  }

  const json = await res.json();

  // ✅ USE external parser safely
  const parsed = parseActionPlansExternal(json);

  const items = parsed.data;
  const total = parsed.meta?.total ?? 0;

  return (
    <div style={container}>
      <PageHeader
        title="Action Plans"
        subtitle="Track execution"
        action={
          canShowCreateAction ? (
            <Link href="/dashboard/action-plans/new" style={headerAction}>
              + New Action Plan
            </Link>
          ) : undefined
        }
      />

      {items.length === 0 && (
        <div style={hintBox}>
          Create Action Plans from Safety Reports for proper linking.
        </div>
      )}

      <section style={section}>
        <div style={sectionHeader}>
          <div style={sectionTitle}>Execution List</div>
          <div style={sectionMeta}>Total: {total}</div>
        </div>

        {items.length === 0 ? (
          <EmptyState message="No action plans found." />
        ) : (
          <>
            <div className="desktop-only">
              <div style={tableCard}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: 550,
                  }}
                >
                  <tbody>
                    {items.map((i) => (
                      <tr key={i.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                        <td style={titleCell}>{i.title}</td>
                        <td style={td}>
                          <StatusBadge status={i.status} />
                        </td>
                        <td style={mutedCell}>{i.description ?? "-"}</td>
                        <td style={td}>
                          <Link
                            href={`/dashboard/action-plans/${i.id}`}
                            style={rowLink}
                          >
                            Open
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mobile-only" style={{ display: "grid", gap: 10 }}>
              {items.map((i) => (
                <Link
                  key={i.id}
                  href={`/dashboard/action-plans/${i.id}`}
                  style={card}
                >
                  <div style={cardTitle}>{i.title}</div>
                  <div style={cardDesc}>{i.description ?? "-"}</div>
                  <div style={{ marginTop: 8 }}>
                    <StatusBadge status={i.status} />
                  </div>
                </Link>
              ))}
            </div>
          </>
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
  alignItems: "center",
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
  fontSize: 13,
};

const tableCard: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  overflowX: "auto" as const,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const td: React.CSSProperties = {
  padding: 10,
  fontSize: 13,
};

const titleCell: React.CSSProperties = {
  ...td,
  fontWeight: 700,
};

const mutedCell: React.CSSProperties = {
  ...td,
  color: "#6b7280",
};

const rowLink: React.CSSProperties = {
  color: "#111827",
  fontWeight: 700,
  textDecoration: "none",
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

const cardTitle: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 15,
};

const cardDesc: React.CSSProperties = {
  fontSize: 13,
  color: "#6b7280",
  marginTop: 6,
};

const hintBox: React.CSSProperties = {
  marginTop: 10,
  padding: 10,
  borderRadius: 10,
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  fontSize: 12,
  color: "#6b7280",
};