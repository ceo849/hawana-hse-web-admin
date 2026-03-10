// app/dashboard/action-plans/[id]/page.tsx
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
    case "VERIFIED":
    default:
      return [];
  }
}

function toDateInputValue(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatDateDisplay(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function getActionPlanStatusStyle(status?: string | null) {
  const normalized = String(status ?? "").toUpperCase();

  if (normalized === "OPEN") {
    return {
      background: "#f3f4f6",
      color: "#111827",
      border: "1px solid #d1d5db",
    };
  }

  if (normalized === "IN_PROGRESS") {
    return {
      background: "#dbeafe",
      color: "#1d4ed8",
      border: "1px solid #93c5fd",
    };
  }

  if (normalized === "COMPLETED") {
    return {
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #86efac",
    };
  }

  if (normalized === "VERIFIED") {
    return {
      background: "#dcfce7",
      color: "#14532d",
      border: "1px solid #4ade80",
    };
  }

  return {
    background: "#f3f4f6",
    color: "#111827",
    border: "1px solid #d1d5db",
  };
}

function formatAssignedUser(
  user?: AssignedUserLite | null,
  fallbackId?: string | null,
) {
  if (user?.fullName || user?.email) {
    return `${user.fullName ?? "—"} — ${user.email ?? "—"}`;
  }

  if (fallbackId) return fallbackId;
  return "—";
}

async function readApiErrorText(r: Response): Promise<string> {
  try {
    const j = await r.json();
    if (j && typeof j === "object") {
      const msg =
        (j.message && String(j.message)) ||
        (j.error && String(j.error)) ||
        (j.statusCode && `statusCode=${j.statusCode}`) ||
        "";
      const path = (j as { path?: unknown }).path
        ? ` path=${String((j as { path?: unknown }).path)}`
        : "";
      return `${msg}${path}`.trim() || JSON.stringify(j);
    }
  } catch {
    // ignore
  }

  try {
    return (await r.text()).trim();
  } catch {
    return "";
  }
}

function errRedirect(id: string, label: string, status: number, detail: string) {
  const clean = `${label} (${status}) ${detail}`.trim();
  redirect(`${actionPlanPath(id)}?err=${encodeURIComponent(clean)}`);
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
  const canOperateWorkflow = currentRole !== "VIEWER" && currentRole !== "UNKNOWN";

  async function changeStatus(formData: FormData) {
    "use server";

    const tokenInner = await requireAccessToken();
    const nextStatus = normalizeId(formData.get("nextStatus"));
    if (!nextStatus) redirect(actionPlanPath(id));

    const allowed: ActionPlanStatus[] = [
      "OPEN",
      "IN_PROGRESS",
      "COMPLETED",
      "VERIFIED",
    ];

    if (!allowed.includes(nextStatus as ActionPlanStatus)) {
      errRedirect(id, "Invalid status value", 400, `status=${nextStatus}`);
    }

    const r = await fetch(api(`/v1/action-plans/${id}/status`), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenInner}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: nextStatus }),
      cache: "no-store",
    });

    if (r.status === 401) redirect("/login");

    if (!r.ok) {
      const detail = await readApiErrorText(r);
      errRedirect(id, "Status update failed", r.status, detail);
    }

    redirect(actionPlanPath(id));
  }

  async function updateDueDate(formData: FormData) {
    "use server";

    const tokenInner = await requireAccessToken();
    const dueDateRaw = normalizeId(formData.get("dueDate"));

    const payload = {
      dueDate: dueDateRaw
        ? new Date(`${dueDateRaw}T00:00:00.000Z`).toISOString()
        : null,
    };

    const r = await fetch(api(`/v1/action-plans/${id}/due-date`), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenInner}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (r.status === 401) redirect("/login");

    if (!r.ok) {
      const detail = await readApiErrorText(r);
      errRedirect(id, "Due date update failed", r.status, detail);
    }

    redirect(actionPlanPath(id));
  }

  const res = await fetch(api(`/v1/action-plans/${id}`), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 401) redirect("/login");

  if (!res.ok) {
    const detail = await readApiErrorText(res);
    return (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        <PageHeader
          title="Action Plan"
          subtitle="View details, update workflow status, and manage due date"
        />

        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: "#f7f7f7",
            borderRadius: 12,
            overflowX: "auto",
            whiteSpace: "pre-wrap",
          }}
        >{`Failed to load action plan (${res.status})\n${detail}`}</pre>

        <div style={{ marginTop: 14 }}>
          <a href="/dashboard/action-plans" style={{ textDecoration: "underline" }}>
            Back to Action Plans
          </a>
        </div>
      </div>
    );
  }

  const ap = (await res.json()) as ActionPlan;
  const nextStatuses = allowedNextStatuses(ap.status);
  const err = normalizeId(resolvedSearchParams?.err);
  const dueDateLocked = ap.status === "VERIFIED" || !canOperateWorkflow;
  const statusStyle = getActionPlanStatusStyle(ap.status);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 860 }}>
      <PageHeader
        title={ap.title}
        subtitle="View details, update workflow status, and manage due date"
        action={
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href="/dashboard/action-plans"
              style={{
                display: "inline-block",
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "#fff",
                color: "#111",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Back
            </a>
          </div>
        }
      />

      {err ? (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #fecaca",
            background: "#fef2f2",
            color: "#991b1b",
            fontSize: 13,
            whiteSpace: "pre-wrap",
          }}
        >
          {err}
        </div>
      ) : null}

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            display: "inline-block",
            padding: "6px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 800,
            ...statusStyle,
          }}
        >
          {ap.status}
        </span>

        {!canOperateWorkflow ? (
          <span
            style={{
              fontSize: 12,
              color: "#6b7280",
              padding: "6px 10px",
              borderRadius: 999,
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
              fontWeight: 700,
            }}
          >
            Read only
          </span>
        ) : null}
      </div>

      <div
        style={{
          marginBottom: 16,
          padding: 16,
          border: "1px solid #eee",
          borderRadius: 12,
          background: "#fff",
        }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <div>
            <b>Assigned To:</b>{" "}
            {formatAssignedUser(ap.assignedTo, ap.assignedToUserId)}
          </div>

          <div>
            <b>Safety Report:</b>{" "}
            {ap.safetyReportId ? (
              <a
                href={safetyReportPath(ap.safetyReportId)}
                style={{ textDecoration: "underline" }}
              >
                {ap.safetyReportId}
              </a>
            ) : (
              "—"
            )}
          </div>

          <div>
            <b>Action Plan ID:</b> {ap.id}
          </div>

          <div>
            <b>Created:</b> {formatDateDisplay(ap.createdAt)}
          </div>

          <div>
            <b>Updated:</b> {formatDateDisplay(ap.updatedAt)}
          </div>
        </div>
      </div>

      <div
        style={{
          marginBottom: 16,
          padding: 16,
          border: "1px solid #eee",
          borderRadius: 12,
          background: "#fff",
        }}
      >
        <div style={{ fontWeight: 800, marginBottom: 10 }}>Change Status</div>

        {!canOperateWorkflow ? (
          <div style={{ fontSize: 13, color: "#555" }}>
            Status transitions are hidden for read-only roles.
          </div>
        ) : nextStatuses.length === 0 ? (
          <div style={{ fontSize: 13, color: "#555" }}>No allowed transitions</div>
        ) : (
          <form
            action={changeStatus}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <select
              name="nextStatus"
              defaultValue={nextStatuses[0]}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
                minWidth: 180,
                background: "#fff",
              }}
            >
              {nextStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button
              type="submit"
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #111",
                background: "#111",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Update Status
            </button>
          </form>
        )}
      </div>

      <div
        style={{
          marginBottom: 16,
          padding: 16,
          border: "1px solid #eee",
          borderRadius: 12,
          background: "#fff",
        }}
      >
        <div style={{ fontWeight: 800, marginBottom: 10 }}>
          Due Date: {formatDateDisplay(ap.dueDate)}
        </div>

        <form
          action={updateDueDate}
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            type="date"
            name="dueDate"
            defaultValue={toDateInputValue(ap.dueDate)}
            disabled={dueDateLocked}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              minWidth: 220,
              opacity: dueDateLocked ? 0.6 : 1,
              background: "#fff",
            }}
          />

          <button
            type="submit"
            disabled={dueDateLocked}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #111",
              background: dueDateLocked ? "#777" : "#111",
              color: "#fff",
              fontWeight: 700,
              cursor: dueDateLocked ? "not-allowed" : "pointer",
              opacity: dueDateLocked ? 0.7 : 1,
            }}
          >
            Save Due Date
          </button>

          <span style={{ fontSize: 12, color: "#666" }}>
            {ap.status === "VERIFIED"
              ? "(Locked: VERIFIED plan)"
              : !canOperateWorkflow
                ? "(Locked: read-only role)"
                : "(Leave empty to clear the due date)"}
          </span>
        </form>
      </div>

      <div
        style={{
          padding: 16,
          border: "1px solid #eee",
          borderRadius: 12,
          background: "#fff",
        }}
      >
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Description</div>
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          {ap.description?.trim() ? ap.description : "No description"}
        </p>
      </div>
    </div>
  );
}