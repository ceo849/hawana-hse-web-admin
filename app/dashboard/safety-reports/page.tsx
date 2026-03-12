// app/dashboard/safety-reports/page.tsx
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

type SafetyReportsResponse = {
  data: SafetyReport[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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

function parseSafetyReportsResponse(value: unknown): SafetyReportsResponse {
  if (Array.isArray(value)) {
    return {
      data: value.filter(isSafetyReport),
      meta: undefined,
    };
  }

  if (typeof value !== "object" || value === null) {
    return { data: [], meta: undefined };
  }

  const candidate = value as Record<string, unknown>;
  const data = Array.isArray(candidate.data)
    ? candidate.data.filter(isSafetyReport)
    : [];

  const metaRaw =
    typeof candidate.meta === "object" && candidate.meta !== null
      ? (candidate.meta as Record<string, unknown>)
      : null;

  const meta = metaRaw
    ? {
        total:
          typeof metaRaw.total === "number" ? metaRaw.total : data.length,
        page: typeof metaRaw.page === "number" ? metaRaw.page : 1,
        limit: typeof metaRaw.limit === "number" ? metaRaw.limit : 20,
        totalPages:
          typeof metaRaw.totalPages === "number" ? metaRaw.totalPages : 1,
      }
    : undefined;

  return { data, meta };
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

  let json: SafetyReportsResponse;

  try {
    json = parseSafetyReportsResponse(
      await serverAppFetch(`/api/safety-reports?page=${page}&limit=${limit}`),
    );
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

  const items = json.data;

  const filteredItems = selectedStatus
    ? items.filter(
        (r) => String(r.status ?? "").toUpperCase() === selectedStatus,
      )
    : items;

  const meta = json.meta ?? {
    total: filteredItems.length,
    page,
    limit,
    totalPages: 1,
  };

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <PageHeader
        title="Safety Reports"
        subtitle="Review, filter, and manage operational safety reports"
        action={
          canCreateSafetyReports ? (
            <a
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
            </a>
          ) : undefined
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

        <a
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
        Total safety reports: <strong>{filteredItems.length}</strong>
        <span style={{ marginLeft: 12 }}>
          Page <strong>{meta.page}</strong> / <strong>{meta.totalPages}</strong>
        </span>
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
                      <a
                        href={`/dashboard/safety-reports/${r.id}`}
                        style={{
                          color: "#111",
                          fontWeight: 800,
                          textDecoration: "none",
                        }}
                      >
                        {r.title ?? "Untitled"}
                      </a>

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
                      <a
                        href={`/dashboard/safety-reports/${r.id}`}
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