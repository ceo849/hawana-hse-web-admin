export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAccessToken } from "@/lib/server-auth";
import PageHeader from "@/components/ui/page-header";
import { decodeJwtPayload } from "@/src/auth/jwt";
import { serverAppFetch } from "@/src/lib/server-app-fetch";

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

function parse(value: unknown): ActionPlan[] {
  if (Array.isArray(value)) return value.filter(isActionPlan);

  if (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as any).data)
  ) {
    return (value as any).data.filter(isActionPlan);
  }

  return [];
}

function StatusBadge({ status }: { status: string }) {
  let bg = "#e5e7eb";
  let color = "#111827";

  if (status === "OPEN") {
    bg = "#fef3c7";
    color = "#92400e";
  } else if (status === "IN_PROGRESS") {
    bg = "#dbeafe";
    color = "#1e40af";
  } else if (status === "COMPLETED") {
    bg = "#dcfce7";
    color = "#166534";
  } else if (status === "VERIFIED") {
    bg = "#bbf7d0";
    color = "#14532d";
  }

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: 12,
        fontWeight: 600,
        background: bg,
        color,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

export default async function ActionPlansPage() {
  const token = await requireAccessToken();

  const payload = decodeJwtPayload(token);
  const role: Role = (payload?.role as Role) ?? "UNKNOWN";

  const canManage =
    role === "OWNER" || role === "ADMIN" || role === "MANAGER";

  let res;

  try {
    res = await serverAppFetch(
      "/api/action-plans?page=1&limit=20",
      { cache: "no-store" }
    );
  } catch (err) {
    console.error("Action Plans Fetch Error:", err);

    return (
      <div style={{ padding: 16 }}>
        <PageHeader
          title="Action Plans"
          subtitle="Track execution and workflow"
        />
        <div style={{ color: "red", marginTop: 12 }}>
          Failed to load action plans (network/server error)
        </div>
      </div>
    );
  }

  if (!res.ok) {
    return (
      <div style={{ padding: 16 }}>
        <PageHeader
          title="Action Plans"
          subtitle="Track execution and workflow"
        />
        <div style={{ color: "red", marginTop: 12 }}>
          Failed to load action plans
        </div>
      </div>
    );
  }

  const json = await res.json();
  const items = parse(json);

  return (
    <div style={{ padding: 16, fontFamily: "system-ui" }}>
      <PageHeader
        title="Action Plans"
        subtitle="Track execution and workflow"
        action={
          canManage ? (
            <Link href="/dashboard/action-plans/new">
              + New Action Plan
            </Link>
          ) : undefined
        }
      />

      <div style={{ marginBottom: 12 }}>Total: {items.length}</div>

      <div className="desktop-only">
        <div style={{ overflowX: "auto" }}>
          <table style={{ minWidth: 550, width: "100%" }}>
            <tbody>
              {items.map((i) => (
                <tr key={i.id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: 8, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {i.title}
                  </td>
                  <td style={{ padding: 8 }}>
                    <StatusBadge status={i.status} />
                  </td>
                  <td style={{ padding: 8, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {i.description ?? "-"}
                  </td>
                  <td style={{ padding: 8, whiteSpace: "nowrap" }}>
                    <Link href={`/dashboard/action-plans/${i.id}`}>
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mobile-only" style={{ marginTop: 12 }}>
        {items.map((i) => (
          <Link
            key={i.id}
            href={`/dashboard/action-plans/${i.id}`}
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
              {i.title}
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>
              {i.description ?? "-"}
            </div>
            <div style={{ marginBottom: 4 }}>
              <StatusBadge status={i.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}