import Link from "next/link";
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

function getStatusStyle(status: string) {
  const s = status.toUpperCase();

  if (s === "VERIFIED") {
    return style("#dcfce7", "#166534", "#86efac");
  }

  if (s === "COMPLETED") {
    return style("#e0f2fe", "#075985", "#7dd3fc");
  }

  if (s === "IN_PROGRESS") {
    return style("#dbeafe", "#1d4ed8", "#93c5fd");
  }

  return style("#f3f4f6", "#111827", "#d1d5db");
}

function style(bg: string, color: string, border: string) {
  return {
    background: bg,
    color,
    border: `1px solid ${border}`,
    padding: "4px 8px",
    borderRadius: 8,
    fontSize: 12,
  };
}

export default async function ActionPlansPage() {
  const token = await requireAccessToken();

  const payload = decodeJwtPayload(token);
  const role: Role = (payload?.role as Role) ?? "UNKNOWN";

  const canManage =
    role === "OWNER" || role === "ADMIN" || role === "MANAGER";

  const CORE_API =
    (process.env.NEXT_PUBLIC_API_BASE_URL ??
      "http://localhost:3001").replace(/\/$/, "");

  const res = await fetch(
    `${CORE_API}/v1/action-plans?page=1&limit=20`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (res.status === 401) redirect("/login");

  if (!res.ok) {
    return <div>Failed to load action plans</div>;
  }

  const json = await res.json();
  const items = parse(json);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <PageHeader
        title="Action Plans"
        subtitle="Track execution and workflow"
        action={
          canManage ? (
            <Link href="/dashboard/action-plans/new" prefetch={false}>
              + New Action Plan
            </Link>
          ) : undefined
        }
      />

      <div style={{ marginBottom: 12 }}>
        Total: {items.length}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
            <th style={th}>Title</th>
            <th style={th}>Status</th>
            <th style={th}>Description</th>
            <th style={th}></th>
          </tr>
        </thead>

        <tbody>
          {items.map((i) => {
            const s = getStatusStyle(i.status);

            return (
              <tr key={i.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={td}>{i.title}</td>

                <td style={td}>
                  <span style={s}>{i.status}</span>
                </td>

                <td style={td}>{i.description ?? "-"}</td>

                <td style={td}>
                  <Link
                    href={`/dashboard/action-plans/${i.id}`}
                    prefetch={false}
                  >
                    Open
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = {
  padding: "10px 8px",
  fontSize: 13,
  color: "#6b7280",
};

const td: React.CSSProperties = {
  padding: "10px 8px",
};