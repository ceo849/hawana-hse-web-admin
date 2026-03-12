// app/dashboard/action-plans/new/page.tsx
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { api } from "@/lib/core-api";
import PageHeader from "@/components/ui/page-header";

type PageProps = {
  searchParams?:
    | { safetyReportId?: string; err?: string }
    | Promise<{ safetyReportId?: string; err?: string }>;
};

type UserLite = {
  id: string;
  email?: string | null;
  fullName?: string | null;
  role?: string | null;
};

function isUserLite(value: unknown): value is UserLite {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    (typeof candidate.email === "string" ||
      candidate.email === null ||
      candidate.email === undefined) &&
    (typeof candidate.fullName === "string" ||
      candidate.fullName === null ||
      candidate.fullName === undefined) &&
    (typeof candidate.role === "string" ||
      candidate.role === null ||
      candidate.role === undefined)
  );
}

function parseUsers(value: unknown): UserLite[] {
  if (Array.isArray(value)) {
    return value.filter(isUserLite);
  }

  if (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { data?: unknown }).data)
  ) {
    return ((value as { data: unknown[] }).data).filter(isUserLite);
  }

  return [];
}

function userLabel(u: UserLite) {
  const name = (u.fullName ?? "").trim();
  const email = (u.email ?? "").trim();
  if (name && email) return `${name} — ${email}`;
  if (name) return name;
  return email || u.id;
}

export default async function NewActionPlanPage({ searchParams }: PageProps) {
  const token = await requireAccessToken();

  const sp = await Promise.resolve(searchParams ?? {});
  const safetyReportId = String(sp?.safetyReportId ?? "").trim();
  const err = String(sp?.err ?? "").trim();

  let users: UserLite[] = [];
  try {
    const r = await fetch(api("/users"), {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (r.status === 401) redirect("/login");

    if (r.ok) {
      const data = (await r.json()) as unknown;
      users = parseUsers(data);
    }
  } catch {
    users = [];
  }

  async function createActionPlan(formData: FormData) {
    "use server";

    const tokenInner = await requireAccessToken();

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const srId = String(formData.get("safetyReportId") ?? "").trim();
    const dueDateRaw = String(formData.get("dueDate") ?? "").trim();
    const assignedToUserId = String(
      formData.get("assignedToUserId") ?? "",
    ).trim();

    const effectiveSafetyReportId = srId || safetyReportId;
    const base = `/dashboard/action-plans/new?safetyReportId=${encodeURIComponent(
      effectiveSafetyReportId,
    )}`;

    if (!title) {
      redirect(`${base}&err=${encodeURIComponent("Title is required")}`);
    }

    if (!effectiveSafetyReportId) {
      redirect(
        `${base}&err=${encodeURIComponent("Safety Report ID is required")}`,
      );
    }

    const payload: Record<string, unknown> = {
      title,
      description,
      safetyReportId: effectiveSafetyReportId,
    };

    if (dueDateRaw) {
      payload.dueDate = new Date(`${dueDateRaw}T00:00:00.000Z`).toISOString();
    }

    if (assignedToUserId) {
      payload.assignedToUserId = assignedToUserId;
    }

    const res = await fetch(api("/action-plans"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenInner}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      redirect(
        `${base}&err=${encodeURIComponent(
          `Failed to create Action Plan (${res.status}) ${text}`,
        )}`,
      );
    }

    redirect("/dashboard/action-plans");
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 760 }}>
      <PageHeader
        title="Create Action Plan"
        subtitle="Create a corrective action and link it to the related safety report"
      />

      {err ? (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 10,
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
            whiteSpace: "pre-wrap",
          }}
        >
          {err}
        </div>
      ) : null}

      <form action={createActionPlan} style={{ display: "grid", gap: 16 }}>
        <input type="hidden" name="safetyReportId" value={safetyReportId} />

        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 12,
            background: "#fff",
            padding: 16,
            display: "grid",
            gap: 14,
          }}
        >
          <div>
            <label
              htmlFor="title"
              style={{ display: "block", marginBottom: 6, fontWeight: 700 }}
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              placeholder="Enter action plan title"
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="safetyReportIdDisplay"
              style={{ display: "block", marginBottom: 6, fontWeight: 700 }}
            >
              Safety Report ID
            </label>
            <input
              id="safetyReportIdDisplay"
              value={safetyReportId}
              placeholder="Safety Report ID"
              readOnly
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "#f7f7f7",
              }}
            />
            <div style={{ marginTop: 6, fontSize: 12, color: "#666" }}>
              Safety Report ID is passed automatically from the Safety Report
              page.
            </div>
          </div>

          <div>
            <label
              htmlFor="assignedToUserId"
              style={{ display: "block", marginBottom: 6, fontWeight: 700 }}
            >
              Assigned To
            </label>

            {users.length > 0 ? (
              <select
                id="assignedToUserId"
                name="assignedToUserId"
                defaultValue=""
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: "#fff",
                }}
              >
                <option value="">— Not assigned —</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {userLabel(u)}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id="assignedToUserId"
                name="assignedToUserId"
                placeholder="User ID responsible for this action"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                }}
              />
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              style={{ display: "block", marginBottom: 6, fontWeight: 700 }}
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Enter action plan description"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
                resize: "vertical",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="dueDate"
              style={{ display: "block", marginBottom: 6, fontWeight: 700 }}
            >
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              name="dueDate"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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
            Create Action Plan
          </button>

          <a
            href="/dashboard/action-plans"
            style={{
              display: "inline-block",
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "#fff",
              textDecoration: "none",
              color: "#111",
              fontWeight: 600,
            }}
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}