import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { api } from "@/lib/core-api";
import PageHeader from "@/components/ui/page-header";
import { decodeJwtPayload } from "@/src/auth/jwt";

type Role = "OWNER" | "ADMIN" | "MANAGER" | "WORKER" | "VIEWER" | "UNKNOWN";
type ActionPlanStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "VERIFIED";

type AssignedUserLite = {
  id: string;
  fullName?: string | null;
  email?: string | null;
};

type ActionPlan = {
  id: string;
  title: string;
  description?: string | null;
  status: ActionPlanStatus;
  dueDate?: string | null;
  safetyReportId?: string | null;
  assignedToUserId?: string | null;
  assignedTo?: AssignedUserLite | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

type PageProps = {
  params: { id: string } | Promise<{ id: string }>;
  searchParams?: { err?: string } | Promise<{ err?: string }>;
};

function normalizeId(raw: unknown): string {
  return String(raw ?? "").trim();
}

function actionPlanPath(id: string) {
  return `/dashboard/action-plans/${encodeURIComponent(id)}`;
}

function actionPlanEditPath(id: string) {
  return `/dashboard/action-plans/${encodeURIComponent(id)}/edit`;
}

function safetyReportPath(id: string) {
  return `/dashboard/safety-reports/${encodeURIComponent(id)}`;
}

function allowedNextStatuses(current: ActionPlanStatus): ActionPlanStatus[] {
  switch (current) {
    case "OPEN":
      return ["IN_PROGRESS"];
    case "IN_PROGRESS":
      return ["COMPLETED"];
    case "COMPLETED":
      return ["VERIFIED"];
    default:
      return [];
  }
}

function toDateInputValue(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function formatDateDisplay(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB").format(d);
}

function getStatusStyle(status?: string | null) {
  const s = String(status ?? "").toUpperCase();

  if (s === "OPEN") return { background: "#f3f4f6", color: "#111" };
  if (s === "IN_PROGRESS") return { background: "#dbeafe", color: "#1d4ed8" };
  if (s === "COMPLETED") return { background: "#dcfce7", color: "#166534" };
  if (s === "VERIFIED") return { background: "#bbf7d0", color: "#14532d" };

  return { background: "#f3f4f6", color: "#111" };
}

function formatAssignedUser(
  user?: AssignedUserLite | null,
  fallbackId?: string | null,
) {
  if (user?.fullName || user?.email) {
    return `${user.fullName ?? "—"} — ${user.email ?? "—"}`;
  }
  return fallbackId ?? "—";
}

function metricCard(label: string, value: string | number) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        background: "#fff",
        padding: 16,
      }}
    >
      <div style={{ fontSize: 12, color: "#6b7280" }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

export default async function ActionPlanPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const id = normalizeId(resolvedParams?.id);

  if (!id) redirect("/dashboard/action-plans");

  const token = await requireAccessToken();
  const payload = decodeJwtPayload(token);
  const currentRole: Role = (payload?.role as Role) ?? "UNKNOWN";

  const canOperateWorkflow =
    currentRole !== "VIEWER" && currentRole !== "UNKNOWN";

  const res = await fetch(api(`/action-plans/${id}`), {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) redirect("/dashboard/action-plans");

  const ap = (await res.json()) as ActionPlan;
  const nextStatuses = allowedNextStatuses(ap.status);
  const err = normalizeId(resolvedSearchParams?.err);
  const statusStyle = getStatusStyle(ap.status);

  return (
    <div
      style={{
        padding: 16,
        maxWidth: 720,
        margin: "0 auto",
        fontFamily: "system-ui",
      }}
    >
      <PageHeader
        title="Action Plan Overview"
        subtitle="Plan insight and control"
      />

      {err && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #fecaca",
            background: "#fef2f2",
            color: "#991b1b",
            fontSize: 13,
          }}
        >
          {err}
        </div>
      )}

      {/* Status */}
      <div style={{ marginBottom: 16 }}>
        <span
          style={{
            padding: "6px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            ...statusStyle,
          }}
        >
          {ap.status}
        </span>
      </div>

      {/* Info */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          padding: 16,
          background: "#fff",
          marginBottom: 16,
        }}
      >
        <div><b>ID:</b> {ap.id}</div>
        <div><b>Title:</b> {ap.title}</div>
        <div><b>Assigned:</b> {formatAssignedUser(ap.assignedTo, ap.assignedToUserId)}</div>
        <div><b>Due:</b> {formatDateDisplay(ap.dueDate)}</div>
      </div>

      {/* Metrics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {metricCard("Status", ap.status)}
        {metricCard("Due Date", formatDateDisplay(ap.dueDate))}
        {metricCard("Next Steps", nextStatuses.length)}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <Link
          href={actionPlanEditPath(ap.id)}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            background: "#111",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Edit
        </Link>

        <Link
          href="/dashboard/action-plans"
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "#fff",
            color: "#111",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Back
        </Link>
      </div>
    </div>
  );
}