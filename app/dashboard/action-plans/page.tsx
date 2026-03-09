// app/dashboard/action-plans/page.tsx
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import PageHeader from "@/components/ui/page-header";

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

type SearchParams = {
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

function parseActionPlans(value: unknown): ActionPlan[] {
  if (Array.isArray(value)) {
    return value.filter(isActionPlan);
  }

  if (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { data?: unknown }).data)
  ) {
    return ((value as { data: unknown[] }).data).filter(isActionPlan);
  }

  return [];
}

async function getAppOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "127.0.0.1:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
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

export default async function ActionPlansPage({ searchParams }: PageProps) {
  const origin = await getAppOrigin();

  const resolvedSearchParams: SearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : {};

  const selectedStatus = normalizeStatus(resolvedSearchParams.status);

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(`${origin}/api/action-plans`, {
    method: "GET",
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (res.status === 401) redirect("/login?next=/dashboard/action-plans");

  if (!res.ok) {
    const text = await res.text().catch(() => "");

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
        >{`Failed to load action plans (${res.status})
${text}`}</pre>
      </div>
    );
  }

  const json = (await res.json()) as unknown;
  const actionPlans = parseActionPlans(json);

  const filteredActionPlans = selectedStatus
    ? actionPlans.filter(
        (ap) => String(ap.status ?? "").toUpperCase() === selectedStatus,
      )
    : actionPlans;

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <PageHeader
        title="Action Plans"
        subtitle="Track execution, ownership, due dates, and workflow progress"
        action={
          <a
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
          </a>
        }
      />

      <form
        method="GET"
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 12,
          padding: 14,
          border: "1px solid #eee",
          borderRadius: 12,
          background: "#fafafa",
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

        <a
          href="/dashboard/action-plans"
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
        </a>
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
        Total action plans: <strong>{filteredActionPlans.length}</strong>
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
                      <a
                        href={`/dashboard/action-plans/${encodeURIComponent(ap.id)}`}
                        style={{
                          color: "#111",
                          fontWeight: 800,
                          textDecoration: "none",
                        }}
                      >
                        {ap.title}
                      </a>

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
                      <a
                        href={`/dashboard/action-plans/${encodeURIComponent(ap.id)}`}
                        style={{
                          textDecoration: "underline",
                          color: "#111",
                          fontWeight: 600,
                        }}
                      >
                        Open
                      </a>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}