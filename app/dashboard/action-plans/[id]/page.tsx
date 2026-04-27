// app/dashboard/action-plans/[id]/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import PageHeader from "@/components/ui/page-header";
import ErrorState from "@/components/ui/error-state";

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
};

type PageProps = {
  params: { id: string } | Promise<{ id: string }>;
  searchParams?: { err?: string } | Promise<{ err?: string }>;
};

function normalizeId(raw: unknown): string {
  return String(raw ?? "").trim();
}

function actionPlanEditPath(id: string) {
  return `/dashboard/action-plans/${encodeURIComponent(id)}/edit`;
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
    <div style={metric}>
      <div style={metricLabel}>{label}</div>
      <div style={metricValue}>{value}</div>
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

  let res: Response;

  try {
    res = await serverAppFetch(
      `/api/action-plans/${encodeURIComponent(id)}`,
      token,
      { cache: "no-store" }
    );
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") {
      redirect("/login");
    }

    console.error("Action Plan Fetch Error:", err);

    return (
      <div style={container}>
        <PageHeader
          title="Action Plan Overview"
          subtitle="Plan insight and control"
        />
        <ErrorState message="Failed to load action plan (network/server error)" />
      </div>
    );
  }

  if (res.status === 401) redirect("/login");

  if (!res.ok) {
    return (
      <div style={container}>
        <PageHeader
          title="Action Plan Overview"
          subtitle="Plan insight and control"
        />
        <ErrorState message="Failed to load action plan" />
      </div>
    );
  }

  const ap = (await res.json()) as ActionPlan;

  const nextStatuses = allowedNextStatuses(ap.status);
  const err = normalizeId(resolvedSearchParams?.err);
  const statusStyle = getStatusStyle(ap.status);

  return (
    <div style={container}>
      <PageHeader
        title="Action Plan Overview"
        subtitle="Plan insight and control"
      />

      {err && <ErrorState message={err} />}

      <div style={{ marginBottom: 16 }}>
        <span style={{ padding: "6px 10px", borderRadius: 999, ...statusStyle }}>
          {ap.status}
        </span>
      </div>

      <div style={card}>
        <div><b>ID:</b> {ap.id}</div>
        <div><b>Title:</b> {ap.title}</div>
        <div><b>Assigned:</b> {formatAssignedUser(ap.assignedTo, ap.assignedToUserId)}</div>
        <div><b>Due:</b> {formatDateDisplay(ap.dueDate)}</div>
      </div>

      <div style={metricsGrid}>
        {metricCard("Status", ap.status)}
        {metricCard("Due Date", formatDateDisplay(ap.dueDate))}
        {metricCard("Next Steps", nextStatuses.length)}
      </div>

      <div style={actionsRow}>
        <Link href={actionPlanEditPath(ap.id)} style={primaryLink}>
          Edit
        </Link>

        <Link href="/dashboard/action-plans" style={secondaryLink}>
          Back
        </Link>
      </div>
    </div>
  );
}

/* ================= STANDARD ================= */

const container: React.CSSProperties = {
  padding: 24,
  fontFamily: "system-ui",
  maxWidth: 760,
  margin: "0 auto",
};

const card: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 16,
  background: "#fff",
  display: "grid",
  gap: 8,
};

const metricsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: 10,
  marginTop: 16,
};

const metric: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 12,
};

const metricLabel: React.CSSProperties = {
  fontSize: 12,
  color: "#6b7280",
};

const metricValue: React.CSSProperties = {
  fontWeight: 800,
};

const actionsRow: React.CSSProperties = {
  marginTop: 20,
  display: "flex",
  gap: 10,
};

const primaryLink: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 10,
  background: "#111",
  color: "#fff",
  textDecoration: "none",
};

const secondaryLink: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  textDecoration: "none",
  color: "#111",
};