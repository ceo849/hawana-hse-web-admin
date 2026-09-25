export const dynamic = "force-dynamic";

import { headers, cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { requireAccessToken } from "@/lib/server-auth";
import { decodeJwtPayload } from "@/src/auth/jwt";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import PageHeader from "@/components/ui/page-header";
import ErrorState from "@/components/ui/error-state";

type PageProps = {
  params: { id: string } | Promise<{ id: string }>;
  searchParams?: { err?: string } | Promise<{ err?: string }>;
};

type UserLite = {
  id: string;
  email?: string | null;
  fullName?: string | null;
  role?: string | null;
};

type SafetyReportLite = {
  id: string;
  title?: string | null;
  status?: string | null;
};

function normalize(value: unknown) {
  return String(value ?? "").trim();
}

function isUserLite(value: unknown): value is UserLite {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    (typeof candidate.email === "string" || candidate.email == null) &&
    (typeof candidate.fullName === "string" || candidate.fullName == null) &&
    (typeof candidate.role === "string" || candidate.role == null)
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

function parseSafetyReport(value: unknown): SafetyReportLite | null {
  const candidate =
    typeof value === "object" &&
    value !== null &&
    "data" in value
      ? (value as { data?: unknown }).data
      : value;

  if (typeof candidate !== "object" || candidate === null) {
    return null;
  }

  const record = candidate as Record<string, unknown>;

  if (typeof record.id !== "string") {
    return null;
  }

  return {
    id: record.id,
    title:
      typeof record.title === "string" || record.title == null
        ? (record.title as string | null | undefined)
        : null,
    status:
      typeof record.status === "string" || record.status == null
        ? (record.status as string | null | undefined)
        : null,
  };
}

function userLabel(user: UserLite) {
  const name = normalize(user.fullName);
  const email = normalize(user.email);

  if (name && email) return `${name} — ${email}`;
  if (name) return name;

  return email || user.id;
}

function isNextRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export default async function ReopenSafetyReportPage({
  params,
  searchParams,
}: PageProps) {
  headers();
  cookies();

  const resolvedParams = await Promise.resolve(params);
  const resolvedSearch = await Promise.resolve(searchParams ?? {});

  const id = normalize(resolvedParams?.id);
  const err = normalize(resolvedSearch?.err);

  if (!id) {
    redirect("/dashboard/safety-reports");
  }

  const token = await requireAccessToken();
  const jwt = decodeJwtPayload(token);
  const role = normalize(jwt?.role).toUpperCase();

  const canReopen =
    role === "OWNER" ||
    role === "ADMIN" ||
    role === "MANAGER";

  if (!canReopen) {
    return (
      <div style={container}>
        <PageHeader
          title="Reopen Safety Report"
          subtitle="Governed reopen with a new Action Plan"
        />
        <ErrorState message="You do not have permission to reopen this safety report." />
        <Link
          href={`/dashboard/safety-reports/${encodeURIComponent(id)}`}
          style={secondaryLink}
        >
          Back to Safety Report
        </Link>
      </div>
    );
  }

  let report: SafetyReportLite | null = null;

  try {
    const response = await serverAppFetch(
      `/api/safety-reports/${encodeURIComponent(id)}`,
      token,
      { cache: "no-store" }
    );

    if (response.status === 401) {
      redirect("/login");
    }

    if (response.ok) {
      const data = await response.json().catch(() => null);
      report = parseSafetyReport(data);
    }
  } catch (error: any) {
    if (isNextRedirectError(error)) {
      throw error;
    }

    if (error?.message === "SESSION_EXPIRED") {
      redirect("/login");
    }

    console.error("Safety Report Reopen Preflight Error:", error);
  }

  if (!report) {
    return (
      <div style={container}>
        <PageHeader
          title="Reopen Safety Report"
          subtitle="Governed reopen with a new Action Plan"
        />
        <ErrorState message="Unable to load the safety report." />
        <Link href="/dashboard/safety-reports" style={secondaryLink}>
          Back to Safety Reports
        </Link>
      </div>
    );
  }

  if (normalize(report.status).toUpperCase() !== "CLOSED") {
    return (
      <div style={container}>
        <PageHeader
          title="Reopen Safety Report"
          subtitle="Governed reopen with a new Action Plan"
        />
        <ErrorState message="Only a closed safety report can be reopened." />
        <Link
          href={`/dashboard/safety-reports/${encodeURIComponent(id)}`}
          style={secondaryLink}
        >
          Back to Safety Report
        </Link>
      </div>
    );
  }

  let users: UserLite[] = [];

  try {
    const response = await serverAppFetch("/api/users", token, {
      cache: "no-store",
    });

    if (response.status === 401) {
      redirect("/login");
    }

    if (response.ok) {
      const data = await response.json().catch(() => null);
      users = parseUsers(data);
    }
  } catch (error: any) {
    if (isNextRedirectError(error)) {
      throw error;
    }

    if (error?.message === "SESSION_EXPIRED") {
      redirect("/login");
    }

    console.error("Users Fetch Error:", error);
    users = [];
  }

  async function reopenSafetyReport(formData: FormData) {
    "use server";

    const reason = normalize(formData.get("reason"));
    const title = normalize(formData.get("title"));
    const description = normalize(formData.get("description"));
    const assignedToUserId = normalize(formData.get("assignedToUserId"));
    const dueDateRaw = normalize(formData.get("dueDate"));

    const base =
      `/dashboard/safety-reports/${encodeURIComponent(id)}/reopen`;

    if (!reason) {
      redirect(
        `${base}?err=${encodeURIComponent("Reopen reason is required")}`
      );
    }

    if (!title) {
      redirect(
        `${base}?err=${encodeURIComponent("Action Plan title is required")}`
      );
    }

    const payload: Record<string, unknown> = {
      reason,
      title,
    };

    if (description) {
      payload.description = description;
    }

    if (assignedToUserId) {
      payload.assignedToUserId = assignedToUserId;
    }

    if (dueDateRaw) {
      payload.dueDate =
        new Date(`${dueDateRaw}T00:00:00.000Z`).toISOString();
    }

    let response: Response;

    try {
      const tokenInner = await requireAccessToken();

      response = await serverAppFetch(
        `/api/safety-reports/${encodeURIComponent(id)}/reopen`,
        tokenInner,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
    } catch (error: any) {
      if (isNextRedirectError(error)) {
        throw error;
      }

      if (error?.message === "SESSION_EXPIRED") {
        redirect("/login");
      }

      console.error("Governed Safety Report Reopen Error:", error);

      redirect(
        `${base}?err=${encodeURIComponent(
          "Network/server error while reopening safety report"
        )}`
      );
    }

    if (response.status === 401) {
      redirect("/login");
    }

    if (!response.ok) {
      let message = "Unable to reopen safety report";

      if (response.status === 400) {
        message =
          "The safety report could not be reopened. Confirm it is still closed and the required fields are valid.";
      } else if (response.status === 403) {
        message =
          "You do not have permission to reopen this safety report.";
      } else if (response.status === 404) {
        message = "Safety report not found.";
      }

      redirect(`${base}?err=${encodeURIComponent(message)}`);
    }

    redirect(
      `/dashboard/safety-reports/${encodeURIComponent(id)}`
    );
  }

  return (
    <div style={container}>
      <PageHeader
        title="Reopen Safety Report"
        subtitle="Create a governed corrective Action Plan and reopen the closed report"
      />

      {err && <ErrorState message={err} />}

      <div style={infoBox}>
        <div>
          <b>Safety Report:</b> {report.title || report.id}
        </div>
        <div>
          <b>Current Status:</b> CLOSED
        </div>
      </div>

      <form action={reopenSafetyReport} style={form}>
        <div style={card}>
          <div>
            <label style={label}>Reopen Reason</label>
            <textarea
              name="reason"
              required
              rows={4}
              placeholder="Explain why this closed report must be reopened"
              style={input}
            />
          </div>

          <div>
            <label style={label}>New Action Plan Title</label>
            <input
              name="title"
              required
              placeholder="Enter corrective action title"
              style={input}
            />
          </div>

          <div>
            <label style={label}>Assigned To</label>

            {users.length > 0 ? (
              <select
                name="assignedToUserId"
                defaultValue=""
                style={input}
              >
                <option value="">— Not assigned —</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {userLabel(user)}
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
            <label style={label}>Due Date</label>
            <input
              name="dueDate"
              type="date"
              style={input}
            />
          </div>

          <div>
            <label style={label}>Description</label>
            <textarea
              name="description"
              rows={4}
              placeholder="Describe the corrective action"
              style={input}
            />
          </div>
        </div>

        <div style={actionsRow}>
          <button type="submit" style={primaryButton}>
            Reopen with Action Plan
          </button>

          <Link
            href={`/dashboard/safety-reports/${encodeURIComponent(id)}`}
            style={secondaryLink}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

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
  display: "grid",
  gap: 16,
  padding: 16,
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
};

const infoBox: React.CSSProperties = {
  display: "grid",
  gap: 6,
  marginBottom: 16,
  padding: 14,
  background: "#f8fafc",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
};

const label: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontWeight: 600,
};

const input: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 12px",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  font: "inherit",
};

const actionsRow: React.CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  flexWrap: "wrap",
};

const primaryButton: React.CSSProperties = {
  padding: "10px 16px",
  border: 0,
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
  background: "#111",
  color: "#fff",
};

const secondaryLink: React.CSSProperties = {
  display: "inline-block",
  padding: "9px 14px",
  border: "1px solid #cbd5e1",
  borderRadius: 8,
  textDecoration: "none",
};
