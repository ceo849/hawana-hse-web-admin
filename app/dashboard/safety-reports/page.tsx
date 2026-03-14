import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
import { decodeJwtPayload } from "@/src/auth/jwt";
import { serverAppFetch } from "@/src/lib/server-app-fetch";

type Role = "OWNER" | "ADMIN" | "MANAGER" | "WORKER" | "VIEWER" | "UNKNOWN";

type SafetyReport = {
  id: string;
  title: string | null;
  description: string | null;
  status: string | null;
  createdAt: string | null;
};

type SafetyReportsMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type SafetyReportsResponse = {
  data: SafetyReport[];
  meta?: SafetyReportsMeta;
};

type SearchParams = {
  page?: string;
  limit?: string;
  status?: string;
};

function isSafetyReport(value: unknown): value is SafetyReport {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    (typeof candidate.title === "string" || candidate.title === null) &&
    (typeof candidate.description === "string" ||
      candidate.description === null) &&
    (typeof candidate.status === "string" || candidate.status === null) &&
    (typeof candidate.createdAt === "string" || candidate.createdAt === null)
  );
}

function parseSafetyReportsResponse(
  value: unknown,
  fallbackPage: number,
  fallbackLimit: number,
): SafetyReportsResponse {
  if (Array.isArray(value)) {
    const data = value.filter(isSafetyReport);

    return {
      data,
      meta: {
        total: data.length,
        page: fallbackPage,
        limit: fallbackLimit,
        totalPages: 1,
      },
    };
  }

  if (typeof value !== "object" || value === null) {
    return {
      data: [],
      meta: {
        total: 0,
        page: fallbackPage,
        limit: fallbackLimit,
        totalPages: 1,
      },
    };
  }

  const candidate = value as Record<string, unknown>;
  const data = Array.isArray(candidate.data)
    ? candidate.data.filter(isSafetyReport)
    : [];

  const metaRaw =
    typeof candidate.meta === "object" && candidate.meta !== null
      ? (candidate.meta as Record<string, unknown>)
      : null;

  return {
    data,
    meta: {
      total:
        typeof metaRaw?.total === "number" ? metaRaw.total : data.length,
      page: typeof metaRaw?.page === "number" ? metaRaw.page : fallbackPage,
      limit:
        typeof metaRaw?.limit === "number" ? metaRaw.limit : fallbackLimit,
      totalPages:
        typeof metaRaw?.totalPages === "number" ? metaRaw.totalPages : 1,
    },
  };
}

function toInt(v: unknown, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function normalizeStatus(value?: string) {
  const v = String(value ?? "").trim().toUpperCase();

  if (v === "OPEN" || v === "IN_PROGRESS" || v === "CLOSED") {
    return v;
  }

  return "";
}

function getSafetyReportStatusStyle(status?: string | null) {
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

  if (normalized === "CLOSED") {
    return {
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #86efac",
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

function buildDashboardSafetyReportsUrl(
  page: number,
  limit: number,
  status: string,
) {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(limit));
  if (status) params.set("status", status);

  return `/dashboard/safety-reports?${params.toString()}`;
}

export default async function SafetyReportsPage(props: {
  searchParams?: Promise<SearchParams> | SearchParams;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  const payload = decodeJwtPayload(token);
  const currentRole: Role = (payload?.role as Role) ?? "UNKNOWN";
  const canCreateSafetyReports =
    currentRole !== "VIEWER" && currentRole !== "UNKNOWN";

  const sp: SearchParams = props.searchParams
    ? await Promise.resolve(props.searchParams)
    : {};

  const page = toInt(sp.page ?? "1", 1);
  const limit = Math.min(Math.max(toInt(sp.limit ?? "20", 20), 1), 100);
  const selectedStatus = normalizeStatus(sp.status);

  let parsed: SafetyReportsResponse;

  try {
    const raw = await serverAppFetch(
      `/api/safety-reports?page=${page}&limit=${limit}`,
    );
    parsed = parseSafetyReportsResponse(raw, page, limit);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown safety reports fetch error";

    if (message.includes("401")) {
      redirect("/login");
    }

    return (
      <div style={{ fontFamily: "system-ui", padding: 24 }}>
        <PageHeader
          title="Safety Reports"
          subtitle="Review, filter, and manage operational safety reports"
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
        >{`Failed to load safety reports
${message}`}</pre>
      </div>
    );
  }

  const items = parsed.data;

  const filteredItems = selectedStatus
    ? items.filter(
        (r) => String(r.status ?? "").toUpperCase() === selectedStatus,
      )
    : items;

  const meta = parsed.meta ?? {
    total: filteredItems.length,
    page,
    limit,
    totalPages: 1,
  };

  const prevPage = Math.max(1, meta.page - 1);
  const nextPage = Math.min(Math.max(meta.totalPages, 1), meta.page + 1);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <PageHeader
        title="Safety Reports"
        subtitle="Review, filter, and manage operational safety reports"
        action={
          canCreateSafetyReports ? (
            <Link
              href="/dashboard/safety-reports/new"
              style={{
                display: "inline-block",
                padding: "10px 16px",
                borderRadius: 10,
                background: "#111",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              + New Safety Report
            </Link>
          ) : undefined
        }
      />

      <form
        method="GET"
        action="/dashboard/safety-reports"
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
          <option value="CLOSED">CLOSED</option>
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
          href="/dashboard/safety-reports"
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
        Total safety reports: <strong>{filteredItems.length}</strong>
        <span style={{ marginLeft: 12 }}>
          Page <strong>{meta.page}</strong> /{" "}
          <strong>{Math.max(meta.totalPages, 1)}</strong>
        </span>
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
          This page is for safety report administration actions. Detailed report
          insight and edit controls remain inside the individual report page.
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
            minWidth: 1180,
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
                Safety Report
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
                Created At
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 14,
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                }}
              >
                Report ID
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
            {filteredItems.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: 24,
                    color: "#555",
                  }}
                >
                  {selectedStatus
                    ? `No safety reports match status: ${selectedStatus}`
                    : "No safety reports found."}
                </td>
              </tr>
            ) : (
              filteredItems.map((r) => {
                const created = formatDate(r.createdAt);
                const status = (r.status ?? "UNKNOWN").toUpperCase();
                const statusStyle = getSafetyReportStatusStyle(status);

                return (
                  <tr key={r.id}>
                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid #eee",
                        verticalAlign: "top",
                      }}
                    >
                      <Link
                        href={`/dashboard/safety-reports/${r.id}`}
                        style={{
                          color: "#111",
                          fontWeight: 800,
                          textDecoration: "none",
                        }}
                      >
                        {r.title ?? "Untitled"}
                      </Link>

                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 13,
                          color: "#666",
                        }}
                      >
                        {r.description ?? "-"}
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
                        {status}
                      </span>
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
                      {created}
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
                      {r.id}
                    </td>

                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid #eee",
                        verticalAlign: "top",
                      }}
                    >
                      <Link
                        href={`/dashboard/safety-reports/${r.id}`}
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
            href={buildDashboardSafetyReportsUrl(prevPage, limit, selectedStatus)}
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
            href={buildDashboardSafetyReportsUrl(nextPage, limit, selectedStatus)}
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