import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import PageHeader from "@/components/ui/page-header";
import { decodeJwtPayload } from "@/src/auth/jwt";
import { serverAppFetch } from "@/src/lib/server-app-fetch";

type Role = "OWNER" | "ADMIN" | "MANAGER" | "WORKER" | "VIEWER" | "UNKNOWN";

type AssignedUserLite = {
  id: string;
  fullName?: string | null;
  email?: string | null;
};

type ActionPlan = {
  id: string;
  title: string;
  description?: string | null;
  status?: string | null;
  safetyReportId?: string | null;
  assignedToUserId?: string | null;
  assignedTo?: AssignedUserLite | null;
  dueDate?: string | null;
  createdAt?: string | null;
};

type ActionPlansMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type ActionPlansResponse = {
  data: ActionPlan[];
  meta: ActionPlansMeta;
};

type SearchParams = {
  page?: string;
  limit?: string;
  status?: string;
};

type PageProps = {
  searchParams?: Promise<SearchParams> | SearchParams;
};

function isAssignedUserLite(value: unknown): value is AssignedUserLite {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    (typeof candidate.fullName === "string" ||
      candidate.fullName === null ||
      candidate.fullName === undefined) &&
    (typeof candidate.email === "string" ||
      candidate.email === null ||
      candidate.email === undefined)
  );
}

function isActionPlan(value: unknown): value is ActionPlan {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    (typeof candidate.description === "string" ||
      candidate.description === null ||
      candidate.description === undefined) &&
    (typeof candidate.status === "string" ||
      candidate.status === null ||
      candidate.status === undefined) &&
    (typeof candidate.safetyReportId === "string" ||
      candidate.safetyReportId === null ||
      candidate.safetyReportId === undefined) &&
    (typeof candidate.assignedToUserId === "string" ||
      candidate.assignedToUserId === null ||
      candidate.assignedToUserId === undefined) &&
    (typeof candidate.dueDate === "string" ||
      candidate.dueDate === null ||
      candidate.dueDate === undefined) &&
    (typeof candidate.createdAt === "string" ||
      candidate.createdAt === null ||
      candidate.createdAt === undefined) &&
    (candidate.assignedTo === undefined ||
      candidate.assignedTo === null ||
      isAssignedUserLite(candidate.assignedTo))
  );
}

function parseActionPlansResponse(
  value: unknown,
  fallbackPage: number,
  fallbackLimit: number,
): ActionPlansResponse {
  if (Array.isArray(value)) {
    const data = value.filter(isActionPlan);

    return {
      data,
      meta: {
        page: fallbackPage,
        limit: fallbackLimit,
        total: data.length,
        totalPages: 1,
      },
    };
  }

  if (typeof value !== "object" || value === null) {
    return {
      data: [],
      meta: {
        page: fallbackPage,
        limit: fallbackLimit,
        total: 0,
        totalPages: 1,
      },
    };
  }

  const candidate = value as Record<string, unknown>;

  const data = Array.isArray(candidate.data)
    ? candidate.data.filter(isActionPlan)
    : [];

  const metaRaw =
    typeof candidate.meta === "object" && candidate.meta !== null
      ? (candidate.meta as Record<string, unknown>)
      : null;

  return {
    data,
    meta: {
      page: typeof metaRaw?.page === "number" ? metaRaw.page : fallbackPage,
      limit: typeof metaRaw?.limit === "number" ? metaRaw.limit : fallbackLimit,
      total: typeof metaRaw?.total === "number" ? metaRaw.total : data.length,
      totalPages:
        typeof metaRaw?.totalPages === "number" ? metaRaw.totalPages : 1,
    },
  };
}

function normalizeStatus(value?: string) {
  const v = String(value ?? "").trim().toUpperCase();

  if (
    v === "OPEN" ||
    v === "IN_PROGRESS" ||
    v === "COMPLETED" ||
    v === "VERIFIED"
  ) {
    return v;
  }

  return "";
}

function toInt(value: unknown, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function getStatusStyle(status?: string | null) {
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

function formatDate(value?: string | null) {
  if (!value) return "-";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function formatAssignedTo(
  assignedTo?: AssignedUserLite | null,
  assignedToUserId?: string | null,
) {
  if (assignedTo?.fullName && assignedTo?.email) {
    return `${assignedTo.fullName} — ${assignedTo.email}`;
  }

  if (assignedTo?.fullName) {
    return assignedTo.fullName;
  }

  if (assignedTo?.email) {
    return assignedTo.email;
  }

  if (assignedToUserId) {
    return assignedToUserId;
  }

  return "—";
}

function buildDashboardActionPlansUrl(
  page: number,
  limit: number,
  status: string,
) {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(limit));

  if (status) {
    params.set("status", status);
  }

  return `/dashboard/action-plans?${params.toString()}`;
}

export default async function ActionPlansPage({ searchParams }: PageProps) {
  const resolvedSearchParams: SearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : {};

  const page = toInt(resolvedSearchParams.page ?? "1", 1);
  const limit = Math.min(Math.max(toInt(resolvedSearchParams.limit ?? "20", 20), 1), 100);
  const selectedStatus = normalizeStatus(resolvedSearchParams.status);

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  const payload = decodeJwtPayload(token);
  const currentRole: Role = (payload?.role as Role) ?? "UNKNOWN";
  const canCreateActionPlans =
    currentRole !== "VIEWER" && currentRole !== "UNKNOWN";

  let parsed: ActionPlansResponse;

  try {
    const raw = await serverAppFetch(
      `/api/action-plans?page=${page}&limit=${limit}`,
    );
    parsed = parseActionPlansResponse(raw, page, limit);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown action plans fetch error";

    if (message.includes("401")) {
      redirect("/login");
    }

    return (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        <PageHeader
          title="Action Plans"
          subtitle="Track execution, ownership, due dates, and workflow progress"
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
        >{`Failed to load action plans
${message}`}</pre>
      </div>
    );
  }

  const filteredActionPlans = selectedStatus
    ? parsed.data.filter(
        (ap) => String(ap.status ?? "").toUpperCase() === selectedStatus,
      )
    : parsed.data;

  const meta: ActionPlansMeta = {
    page: parsed.meta.page,
    limit: parsed.meta.limit,
    total: selectedStatus ? filteredActionPlans.length : parsed.meta.total,
    totalPages: selectedStatus ? 1 : Math.max(parsed.meta.totalPages, 1),
  };

  const prevPage = Math.max(1, meta.page - 1);
  const nextPage = Math.min(Math.max(meta.totalPages, 1), meta.page + 1);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <PageHeader
        title="Action Plans"
        subtitle="Track execution, ownership, due dates, and workflow progress"
        action={
          canCreateActionPlans ? (
            <Link
              href="/dashboard/action-plans/new"
              style={{
                display: "inline-block",
                padding: "10px 16px",
                background: "#111",
                color: "#fff",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              + New Action Plan
            </Link>
          ) : undefined
        }
      />

      <form
        method="GET"
        action="/dashboard/action-plans"
        style={{
          marginBottom: 16,
          padding: 14,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          background: "#fff",
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <label style={{ fontWeight: 700 }}>Status</label>

        <select
          name="status"
          defaultValue={selectedStatus}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            minWidth: 180,
            background: "#fff",
          }}
        >
          <option value="">All statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="VERIFIED">VERIFIED</option>
        </select>

        <input type="hidden" name="page" value="1" />
        <input type="hidden" name="limit" value={String(limit)} />

        <button
          type="submit"
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #111",
            background: "#111",
            color: "#fff",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          Apply
        </button>

        <Link
          href={`/dashboard/action-plans?page=1&limit=${limit}`}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "#fff",
            color: "#111",
            fontWeight: 700,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Reset
        </Link>
      </form>

      <div
        style={{
          marginBottom: 12,
          padding: "12px 14px",
          border: "1px solid #eee",
          borderRadius: 12,
          background: "#fafafa",
          fontSize: 14,
          color: "#444",
        }}
      >
        Total action plans: <strong>{meta.total}</strong>
      </div>

      <div
        style={{
          marginBottom: 16,
          padding: 14,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          background: "#fff",
          fontSize: 13,
          color: "#444",
        }}
      >
        <div style={{ fontWeight: 700, color: "#111", marginBottom: 6 }}>
          Scope of this page
        </div>
        <div>
          This page is for action plan administration actions. Detailed workflow
          insight and edit controls remain inside the individual action plan page.
        </div>
      </div>

      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 12,
          overflowX: "auto",
          background: "#fff",
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: 1280,
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: 14,
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                }}
              >
                Action Plan
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 14,
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                }}
              >
                Status
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 14,
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                }}
              >
                Assigned To
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 14,
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                }}
              >
                Due Date
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 14,
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                }}
              >
                Safety Report ID
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 14,
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                }}
              >
                Action Plan ID
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 14,
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                }}
              >
                Created At
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 14,
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                  width: 120,
                }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredActionPlans.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    padding: 24,
                    color: "#555",
                  }}
                >
                  {selectedStatus
                    ? `No action plans match status: ${selectedStatus}`
                    : "No action plans found."}
                </td>
              </tr>
            ) : (
              filteredActionPlans.map((ap) => {
                const statusStyle = getStatusStyle(ap.status);

                return (
                  <tr key={ap.id}>
                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid #eee",
                        verticalAlign: "top",
                      }}
                    >
                      <Link
                        href={`/dashboard/action-plans/${encodeURIComponent(ap.id)}`}
                        style={{
                          color: "#111",
                          fontWeight: 800,
                          textDecoration: "none",
                        }}
                      >
                        {ap.title}
                      </Link>

                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 13,
                          color: "#666",
                        }}
                      >
                        {ap.description?.trim() || "-"}
                      </div>
                    </td>

                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid #eee",
                        verticalAlign: "top",
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
                        {String(ap.status ?? "—").toUpperCase()}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid #eee",
                        verticalAlign: "top",
                        fontSize: 14,
                        color: "#444",
                      }}
                    >
                      {formatAssignedTo(ap.assignedTo, ap.assignedToUserId)}
                    </td>

                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid #eee",
                        verticalAlign: "top",
                        fontSize: 13,
                        color: "#444",
                      }}
                    >
                      {formatDate(ap.dueDate)}
                    </td>

                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid #eee",
                        verticalAlign: "top",
                        fontFamily: "monospace",
                        fontSize: 12,
                        color: "#444",
                        wordBreak: "break-all",
                      }}
                    >
                      {ap.safetyReportId ?? "-"}
                    </td>

                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid #eee",
                        verticalAlign: "top",
                        fontFamily: "monospace",
                        fontSize: 12,
                        color: "#444",
                        wordBreak: "break-all",
                      }}
                    >
                      {ap.id}
                    </td>

                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid #eee",
                        verticalAlign: "top",
                        fontSize: 13,
                        color: "#444",
                      }}
                    >
                      {formatDate(ap.createdAt)}
                    </td>

                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid #eee",
                        verticalAlign: "top",
                      }}
                    >
                      <Link
                        href={`/dashboard/action-plans/${encodeURIComponent(ap.id)}`}
                        style={{
                          textDecoration: "underline",
                          color: "#111",
                          fontWeight: 600,
                        }}
                      >
                        Open detail
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: 13, color: "#555" }}>
          Page <strong>{meta.page}</strong> of{" "}
          <strong>{Math.max(meta.totalPages, 1)}</strong>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <Link
            href={buildDashboardActionPlansUrl(prevPage, limit, selectedStatus)}
            style={{
              pointerEvents: meta.page <= 1 ? "none" : "auto",
              opacity: meta.page <= 1 ? 0.5 : 1,
              display: "inline-block",
              padding: "10px 16px",
              border: "1px solid #ddd",
              borderRadius: 10,
              textDecoration: "none",
              color: "#111",
              background: "#fff",
              fontWeight: 600,
            }}
          >
            Previous
          </Link>

          <Link
            href={buildDashboardActionPlansUrl(nextPage, limit, selectedStatus)}
            style={{
              pointerEvents:
                meta.page >= Math.max(meta.totalPages, 1) ? "none" : "auto",
              opacity: meta.page >= Math.max(meta.totalPages, 1) ? 0.5 : 1,
              display: "inline-block",
              padding: "10px 16px",
              border: "1px solid #ddd",
              borderRadius: 10,
              textDecoration: "none",
              color: "#111",
              background: "#fff",
              fontWeight: 600,
            }}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}