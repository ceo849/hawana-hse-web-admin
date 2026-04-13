import Link from "next/link";
import { redirect } from "next/navigation";
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

function getStatusStyle(status: string) {
  const s = status.toUpperCase();

  if (s === "VERIFIED") {
    return {
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #86efac",
      padding: "4px 8px",
      borderRadius: 8,
      fontSize: 12,
    };
  }

  if (s === "COMPLETED") {
    return {
      background: "#e0f2fe",
      color: "#075985",
      border: "1px solid #7dd3fc",
      padding: "4px 8px",
      borderRadius: 8,
      fontSize: 12,
    };
  }

  if (s === "IN_PROGRESS") {
    return {
      background: "#dbeafe",
      color: "#1d4ed8",
      border: "1px solid #93c5fd",
      padding: "4px 8px",
      borderRadius: 8,
      fontSize: 12,
    };
  }

  return {
    background: "#f3f4f6",
    color: "#111827",
    border: "1px solid #d1d5db",
    padding: "4px 8px",
    borderRadius: 8,
    fontSize: 12,
  };
}

export default async function ActionPlansPage() {
  // ✅ FIX: بدل cookies()
  const token = await requireAccessToken();

  const payload = decodeJwtPayload(token);
  const role: Role = (payload?.role as Role) ?? "UNKNOWN";

  const canManage =
    role === "OWNER" || role === "ADMIN" || role === "MANAGER";

  const res = await serverAppFetch(
    "/action-plans?page=1&limit=20",
    token,
    { cache: "no-store" } // تثبيت إضافي
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

      <div style={{ marginBottom: 12 }}>Total: {items.length}</div>

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
            const style = getStatusStyle(i.status);

            return (
              <tr key={i.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={td}>{i.title}</td>

                <td style={td}>
                  <span style={style}>{i.status}</span>
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