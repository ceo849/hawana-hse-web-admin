export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAccessToken } from "@/lib/server-auth";
import PageHeader from "@/components/ui/page-header";
import { decodeJwtPayload } from "@/src/auth/jwt";
import { serverSafeFetch } from "@/src/lib/server-safe-fetch";

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

export default async function ActionPlansPage() {
  const token = await requireAccessToken();

  const payload = decodeJwtPayload(token);
  const role: Role = (payload?.role as Role) ?? "UNKNOWN";

  const canManage =
    role === "OWNER" || role === "ADMIN" || role === "MANAGER";

  // ✅ الالتزام بالـ SSR Flow
  const res = await serverSafeFetch(
    "/action-plans?page=1&limit=20",
    token,
    { cache: "no-store" }
  );

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
            <Link href="/dashboard/action-plans/new">
              + New Action Plan
            </Link>
          ) : undefined
        }
      />

      <div>Total: {items.length}</div>

      <table>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>{i.title}</td>
              <td>{i.status}</td>
              <td>{i.description ?? "-"}</td>
              <td>
                <Link href={`/dashboard/action-plans/${i.id}`}>
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}