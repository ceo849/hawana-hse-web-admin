// app/dashboard/action-plans/new/page.tsx

export const dynamic = "force-dynamic";

import { headers, cookies } from "next/headers"; // ✅ FIX

import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import PageHeader from "@/components/ui/page-header";
import ErrorState from "@/components/ui/error-state";

type PageProps = {
  searchParams?:
    | { safetyReportId?: string; reportId?: string; err?: string }
    | Promise<{ safetyReportId?: string; reportId?: string; err?: string }>;
};

type UserLite = {
  id: string;
  email?: string | null;
  fullName?: string | null;
  role?: string | null;
};

function isUserLite(value: unknown): value is UserLite {
  if (typeof value !== "object" || value === null) return false;

  const c = value as Record<string, unknown>;

  return (
    typeof c.id === "string" &&
    (typeof c.email === "string" || c.email == null) &&
    (typeof c.fullName === "string" || c.fullName == null) &&
    (typeof c.role === "string" || c.role == null)
  );
}

function parseUsers(value: unknown): UserLite[] {
  if (Array.isArray(value)) return value.filter(isUserLite);

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
  headers();
  cookies();

  const token = await requireAccessToken();

  const sp = await Promise.resolve(searchParams ?? {});

  const reportId = String(sp?.reportId ?? "").trim();
  const safetyReportId = String(sp?.safetyReportId ?? "").trim();
  const effectiveInitialReportId = reportId || safetyReportId;

  const err = String(sp?.err ?? "").trim();

  let users: UserLite[] = [];

  try {
    const r = await serverAppFetch("/api/users", token, {
      cache: "no-store",
    });

    if (r.status === 401) redirect("/login");

    if (r.ok) {
      const data = await r.json();
      users = parseUsers(data);
    }
  } catch (e: any) {
    if (e?.message === "SESSION_EXPIRED") redirect("/login");

    console.error("Users Fetch Error:", e);
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
      formData.get("assignedToUserId") ?? ""
    ).trim();

    const effectiveSafetyReportId = srId || effectiveInitialReportId;

    const base = `/dashboard/action-plans/new?reportId=${encodeURIComponent(
      effectiveSafetyReportId
    )}`;

    if (!title) {
      redirect(`${base}&err=${encodeURIComponent("Title is required")}`);
    }

    if (!effectiveSafetyReportId) {
      redirect(
        `${base}&err=${encodeURIComponent("Safety Report ID is required")}`
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

    const res = await serverAppFetch("/api/action-plans", tokenInner, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      redirect(
        `${base}&err=${encodeURIComponent(
          `Failed to create Action Plan (${res.status}) ${text}`
        )}`
      );
    }

    redirect("/dashboard/action-plans?success=created");
  }

  return (
    <div style={container}>
      <PageHeader
        title="Create Action Plan"
        subtitle="Create a corrective action and link it to the related safety report"
      />

      {err && <ErrorState message={err} />}

      <form action={createActionPlan} style={form}>
        <input
          type="hidden"
          name="safetyReportId"
          value={effectiveInitialReportId}
        />

        {effectiveInitialReportId && (
          <div style={infoBox}>
            Linked to Safety Report: {effectiveInitialReportId}
          </div>
        )}

        <div style={card}>
          <div>
            <label style={label}>Title</label>
            <input
              name="title"
              required
              placeholder="Enter action plan title"
              style={input}
            />
          </div>

          <div>
            <label style={label}>Assigned To</label>

            {users.length > 0 ? (
              <select name="assignedToUserId" defaultValue="" style={input}>
                <option value="">— Not assigned —</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {userLabel(u)}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name="assignedToUserId"
                placeholder="Enter user ID"
                style={input}
              />
            )}
          </div>

          <div>
            <label style={label}>Description</label>
            <textarea
              name="description"
              rows={4}
              placeholder="Describe the action plan"
              style={input}
            />
          </div>
        </div>

        <button type="submit" style={primaryBtn}>
          Create Action Plan
        </button>
      </form>
    </div>
  );
}

/* styles */

const container: React.CSSProperties = {
  padding: 24,
  fontFamily: "system-ui",
  maxWidth: 760,
};

const form: React.CSSProperties = {
  display: "grid",
  gap: 16,
};

const card: React.CSSProperties = {
  border: "1px solid #eee",
  borderRadius: 12,
  background: "#fff",
  padding: 16,
  display: "grid",
  gap: 14,
};

const label: React.CSSProperties = {
  marginBottom: 6,
  fontWeight: 700,
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
};

const primaryBtn: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  background: "#111",
  color: "#fff",
};

const infoBox: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
  fontSize: 13,
};