import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import PageHeader from "@/components/ui/page-header";
import ErrorState from "@/components/ui/error-state"; // ✅ ADD

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
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 16 }}>
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

  let res: Response;

  try {
    res = await serverAppFetch(
      `/api/action-plans/${encodeURIComponent(id)}`,
      token,
      { cache: "no-store" }
    );
  } catch (err: any) {
    // ✅ ADD
    if (err?.message === "SESSION_EXPIRED") {
      redirect("/login");
    }

    console.error("Action Plan Fetch Error:", err);

    return (
      <div style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
        <PageHeader
          title="Action Plan Overview"
          subtitle="Plan insight and control"
        />

        <ErrorState message="Failed to load action plan (network/server error)" />
      </div>
    );
  }

  // ✅ ADD (already exists logically, but kept consistent)
  if (res.status === 401) redirect("/login");

  if (!res.ok) {
    return (
      <div style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
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
    <div style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
      <PageHeader
        title="Action Plan Overview"
        subtitle="Plan insight and control"
      />

      {err && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            border: "1px solid #fecaca",
            background: "#fef2f2",
          }}
        >
          {err}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <span style={{ padding: "6px 10px", borderRadius: 999, ...statusStyle }}>
          {ap.status}
        </span>
      </div>

      <div style={{ border: "1px solid #e5e7eb", padding: 16, marginBottom: 16 }}>
        <div><b>ID:</b> {ap.id}</div>
        <div><b>Title:</b> {ap.title}</div>
        <div><b>Assigned:</b> {formatAssignedUser(ap.assignedTo, ap.assignedToUserId)}</div>
        <div><b>Due:</b> {formatDateDisplay(ap.dueDate)}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {metricCard("Status", ap.status)}
        {metricCard("Due Date", formatDateDisplay(ap.dueDate))}
        {metricCard("Next Steps", nextStatuses.length)}
      </div>

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <Link href={actionPlanEditPath(ap.id)}>Edit</Link>
        <Link href="/dashboard/action-plans">Back</Link>
      </div>
    </div>
  );
}