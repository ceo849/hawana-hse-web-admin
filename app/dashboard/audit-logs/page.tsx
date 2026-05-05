export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import AuditLogsClient from "./_components/AuditLogsClient";
import PageHeader from "@/components/ui/page-header";
import ErrorState from "@/components/ui/error-state";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";

/* ===================== */
/* STYLES */
/* ===================== */

const container: React.CSSProperties = {
  padding: 16,
  maxWidth: 900,
  margin: "0 auto",
};

const filtersCard: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 12,
  marginBottom: 12,
};

const filtersGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: 8,
};

const input: React.CSSProperties = {
  padding: "8px 10px",
  height: 36,
  borderRadius: 8,
  border: "1px solid #e5e7eb",
};

const inputWide: React.CSSProperties = { ...input };

const applyBtn: React.CSSProperties = {
  height: 36,
  padding: "0 16px",
  borderRadius: 8,
  background: "#111827",
  color: "#fff",
  border: "none",
  justifySelf: "start",
};

/* ===================== */
/* TYPES */
/* ===================== */

type AuditLog = {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  actorUserId: string;
  createdAt: string;
  oldData?: any;
  newData?: any;
};

type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type ResponseDto = {
  data: AuditLog[];
  meta: Meta;
};

/* ===================== */
/* PAGE */
/* ===================== */

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    action?: string;
    entity?: string;
    q?: string;
    from?: string;
    to?: string;
    sort?: string;
    order?: string;
    // ❌ removed logId
  };
}) {
  const token = await requireAccessToken();

  const page = Math.max(1, Number(searchParams?.page ?? "1") || 1);

  const actionFilter = searchParams?.action ?? "";
  const entityFilter = searchParams?.entity ?? "";
  const q = searchParams?.q ?? "";
  const from = searchParams?.from ?? "";
  const to = searchParams?.to ?? "";

  const sort = searchParams?.sort ?? "createdAt";
  const order = searchParams?.order ?? "desc";

  let res: Response;

  try {
    res = await serverAppFetch(
      `/api/audit-logs?page=${page}&limit=20&action=${actionFilter}&entity=${entityFilter}&q=${encodeURIComponent(
        q
      )}&from=${from}&to=${to}`,
      token,
      { cache: "no-store" }
    );
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") redirect("/login");

    return (
      <div style={container}>
        <PageHeader title="Audit Logs" subtitle="System activity tracking" />
        <ErrorState message="Failed to load audit logs" />
      </div>
    );
  }

  if (res.status === 401) redirect("/login");

  if (!res.ok) {
    return (
      <div style={container}>
        <PageHeader title="Audit Logs" subtitle="System activity tracking" />
        <ErrorState message="Failed to load audit logs" />
      </div>
    );
  }

  const json: ResponseDto = await res.json();
  let logs = json.data ?? [];
  const meta = json.meta ?? { page: 1, limit: 0, total: 0, totalPages: 1 };

  logs = [...logs].sort((a, b) => {
    if (sort === "createdAt") {
      return order === "asc"
        ? new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime();
    }
    return 0;
  });

  return (
    <div style={container}>
      <PageHeader
        title="Audit Logs"
        subtitle="System activity tracking"
      />

      <div style={filtersCard}>
        <form method="GET" style={filtersGrid}>
          <input style={inputWide} type="text" name="q" defaultValue={q} />
          <input style={input} type="date" name="from" defaultValue={from} />
          <input style={input} type="date" name="to" defaultValue={to} />
          <select style={input} name="action" defaultValue={actionFilter}>
            <option value="">All</option>
            <option value="USER_UPDATED">Updated</option>
            <option value="USER_CREATED">Created</option>
            <option value="USER_DELETED">Deleted</option>
          </select>
          <select style={input} name="entity" defaultValue={entityFilter}>
            <option value="">All</option>
            <option value="User">User</option>
          </select>
          <button style={applyBtn} type="submit">
            Apply
          </button>
        </form>
      </div>

      <AuditLogsClient
        logs={logs}
        meta={meta}
        page={page}
        q={q}
        from={from}
        to={to}
        actionFilter={actionFilter}
        entityFilter={entityFilter}
        sort={sort}
        order={order}
        // ❌ removed selectedLog
      />
    </div>
  );
}