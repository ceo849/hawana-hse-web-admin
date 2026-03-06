// app/dashboard/action-plans/[id]/page.tsx
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { api } from "@/lib/core-api";

type ActionPlanStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "VERIFIED";

type ActionPlan = {
  id: string;
  title: string;
  description?: string | null;
  status: ActionPlanStatus;
  dueDate?: string | null;
  safetyReportId?: string | null;
  assignedToUserId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

type UserLite = {
  id: string;
  fullName?: string | null;
  email?: string | null;
};

type PageProps = {
  params: { id: string } | Promise<{ id: string }>;
  searchParams?: { err?: string } | Promise<{ err?: string }>;
};

// ---------------- Helpers ----------------

function normalizeId(raw: unknown): string {
  return String(raw ?? "").trim();
}

function actionPlanPath(id: string) {
  return `/dashboard/action-plans/${encodeURIComponent(id)}`;
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
  return `${yyyy}-${mm}-${dd}`; // YYYY-MM-DD
}

function formatDateDisplay(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(); // عرض محلي للمستخدم
}

async function readApiErrorText(r: Response): Promise<string> {
  // نحاول JSON أولاً ثم fallback نص
  try {
    const j = await r.json();
    if (j && typeof j === "object") {
      const msg =
        (j.message && String(j.message)) ||
        (j.error && String(j.error)) ||
        (j.statusCode && `statusCode=${j.statusCode}`) ||
        "";
      const path = j.path ? ` path=${String(j.path)}` : "";
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

// ---------------- Page ----------------

export default async function ActionPlanPage({ params, searchParams }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const id = normalizeId(resolvedParams?.id);

  if (!id) redirect("/dashboard/action-plans");

  // Auth (JWT from cookies)
  const token = await requireAccessToken();

  // -------- Server Actions --------
  async function changeStatus(formData: FormData) {
    "use server";

    const tokenInner = await requireAccessToken();
    const nextStatus = normalizeId(formData.get("nextStatus"));
    if (!nextStatus) redirect(actionPlanPath(id));

    // (اختياري) Harden: لا تسمح بأي قيمة غير الستاتس المعروفة
    const allowed: ActionPlanStatus[] = ["OPEN", "IN_PROGRESS", "COMPLETED", "VERIFIED"];
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
    const dueDateRaw = normalizeId(formData.get("dueDate")); // YYYY-MM-DD أو ""

    const payload = {
      dueDate: dueDateRaw ? new Date(`${dueDateRaw}T00:00:00.000Z`).toISOString() : null,
    };

    // ✅ المسار الصحيح حسب الـ backend: /due-date
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

  // -------- Load Action Plan --------
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
        <a href="/dashboard/action-plans">← Back</a>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 16 }}>Action Plan</h1>
        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: "#f7f7f7",
            borderRadius: 12,
            overflowX: "auto",
          }}
        >{`Failed to load action plan (${res.status})\n${detail}`}</pre>
      </div>
    );
  }

  const ap = (await res.json()) as ActionPlan;

  // -------- Load Users (optional) --------
  let users: UserLite[] = [];
  try {
    const u = await fetch(api(`/v1/users`), {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (u.ok) users = (await u.json()) as UserLite[];
  } catch {
    // ignore
  }

  const assignedUser = ap.assignedToUserId ? users.find((x) => x.id === ap.assignedToUserId) : undefined;

  const nextStatuses = allowedNextStatuses(ap.status);
  const err = normalizeId(resolvedSearchParams?.err);

  const dueDateLocked = ap.status === "VERIFIED"; // ✅ backend يمنع تعديل verified

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <a href="/dashboard/action-plans">← Back</a>

      <h1 style={{ fontSize: 44, fontWeight: 900, marginTop: 16 }}>{ap.title}</h1>

      {err ? (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #f3c2c2",
            background: "#fff5f5",
            color: "#7a1c1c",
            fontSize: 13,
            whiteSpace: "pre-wrap",
          }}
        >
          {err}
        </div>
      ) : null}

      <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
        <div>
          <b>Status:</b> {ap.status}
        </div>

        <div>
          <b>Assigned To:</b>{" "}
          {assignedUser
            ? `${assignedUser.fullName ?? "—"} — ${assignedUser.email ?? "—"}`
            : ap.assignedToUserId
            ? ap.assignedToUserId
            : "—"}
        </div>
      </div>

      {/* Change Status */}
      <div style={{ marginTop: 18 }}>
        <b>Change Status</b>

        {nextStatuses.length === 0 ? (
          <div style={{ marginTop: 8, fontSize: 13, color: "#555" }}>No allowed transitions</div>
        ) : (
          <form action={changeStatus} style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center" }}>
            <select
              name="nextStatus"
              defaultValue={nextStatuses[0]}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
                minWidth: 180,
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
                borderRadius: 12,
                border: "1px solid #111",
                background: "#111",
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Update
            </button>
          </form>
        )}
      </div>

      {/* Due Date */}
      <div style={{ marginTop: 18 }}>
        <b>Due Date:</b> {formatDateDisplay(ap.dueDate)}

        <div style={{ marginTop: 10 }}>
          <form action={updateDueDate} style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
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
              }}
            />

            <button
              type="submit"
              disabled={dueDateLocked}
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                border: "1px solid #111",
                background: dueDateLocked ? "#777" : "#111",
                color: "#fff",
                fontWeight: 800,
                cursor: dueDateLocked ? "not-allowed" : "pointer",
                opacity: dueDateLocked ? 0.7 : 1,
              }}
            >
              Save Due Date
            </button>

            <span style={{ fontSize: 12, color: "#666" }}>
              {dueDateLocked ? "(Locked: VERIFIED plan)" : "(سيتم حفظ التاريخ أو مسحه لو تركته فارغًا)"}
            </span>
          </form>
        </div>
      </div>

      {/* Description */}
      <div style={{ marginTop: 18 }}>
        <b>Description</b>
        <p style={{ marginTop: 8, lineHeight: 1.6 }}>{ap.description?.trim() ? ap.description : "No description"}</p>
      </div>

      {/* Meta */}
      <div style={{ marginTop: 20, fontSize: 12, color: "#555" }}>
        <div>ID: {ap.id}</div>
        <div>Safety Report: {ap.safetyReportId ?? "—"}</div>
        <div>Created: {formatDateDisplay(ap.createdAt)}</div>
        <div>Updated: {formatDateDisplay(ap.updatedAt)}</div>
      </div>
    </div>
  );
}