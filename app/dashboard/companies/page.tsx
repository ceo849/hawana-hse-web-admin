import Link from "next/link";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
import { decodeJwtPayload } from "@/src/auth/jwt";

type Role = "OWNER" | "ADMIN" | "MANAGER" | "WORKER" | "VIEWER" | "UNKNOWN";

type CompanyDto = {
  id: string;
  name: string;
  country: string | null;
  industry: string | null;
  createdAt: string;
  updatedAt: string;
};

type CompaniesMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type CompaniesResponse = {
  data: CompanyDto[];
  meta?: CompaniesMeta;
};

function isCompanyDto(value: unknown): value is CompanyDto {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    (typeof candidate.country === "string" || candidate.country === null) &&
    (typeof candidate.industry === "string" || candidate.industry === null) &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string"
  );
}

function parseCompaniesResponse(
  value: unknown,
  fallbackPage: number,
  fallbackLimit: number,
): CompaniesResponse {
  if (Array.isArray(value)) {
    const data = value.filter(isCompanyDto);

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
    ? candidate.data.filter(isCompanyDto)
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

function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function buildDashboardCompaniesUrl(page: number) {
  return `/dashboard/companies?page=${page}`;
}

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams:
    | Promise<{ page?: string; search?: string }>
    | { page?: string; search?: string };
}) {
  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : {};

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  const payload = decodeJwtPayload(token);
  const currentRole: Role = (payload?.role as Role) ?? "UNKNOWN";
  const canManageCompanies = currentRole === "OWNER";

  const page = Math.max(1, Number(resolvedSearchParams.page ?? "1") || 1);
  const search = resolvedSearchParams.search ?? "";
  const limit = 10;

  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${host}`;

  const url =
    `${origin}/api/companies?page=${page}&limit=${limit}` +
    (search ? `&search=${encodeURIComponent(search)}` : "");

  const r = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: {
      cookie: cookieStore.toString(),
    },
  });

  if (r.status === 401) redirect("/login");

  if (!r.ok) {
    const text = await r.text().catch(() => "");

    return (
      <div style={{ fontFamily: "system-ui", padding: 24 }}>
        <PageHeader
          title="Companies Administration"
          subtitle="Tenant company administration"
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
        >{`Failed to load companies
${text}`}</pre>
      </div>
    );
  }

  const rawJson = (await r.json()) as unknown;
  const json = parseCompaniesResponse(rawJson, page, limit);

  const companies = json.data;
  const meta = json.meta ?? {
    page,
    limit,
    total: companies.length,
    totalPages: 1,
  };

  const prevPage = Math.max(1, meta.page - 1);
  const nextPage = Math.min(Math.max(meta.totalPages, 1), meta.page + 1);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <PageHeader
        title="Companies Administration"
        subtitle="Control actions for tenant companies. Detail insight remains inside each company page."
        action={
          canManageCompanies ? (
            <Link
              href="/dashboard/companies/new"
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
              + New Company
            </Link>
          ) : undefined
        }
      />

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
        Total companies: <strong>{meta.total}</strong>
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
          This page is for company administration actions. Company detail
          insight and edit controls remain inside the individual company page.
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
            minWidth: 980,
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th
                style={{
                  padding: 14,
                  textAlign: "left",
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                }}
              >
                Company
              </th>
              <th
                style={{
                  padding: 14,
                  textAlign: "left",
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                }}
              >
                Country
              </th>
              <th
                style={{
                  padding: 14,
                  textAlign: "left",
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                }}
              >
                Industry
              </th>
              <th
                style={{
                  padding: 14,
                  textAlign: "left",
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                }}
              >
                Company ID
              </th>
              <th
                style={{
                  padding: 14,
                  textAlign: "left",
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                }}
              >
                Created At
              </th>
              <th
                style={{
                  padding: 14,
                  textAlign: "left",
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                  width: 150,
                }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: 24,
                    color: "#555",
                  }}
                >
                  No companies found.
                </td>
              </tr>
            ) : (
              companies.map((c) => (
                <tr key={c.id}>
                  <td
                    style={{
                      padding: 14,
                      borderBottom: "1px solid #eee",
                      verticalAlign: "top",
                    }}
                  >
                    <Link
                      href={`/dashboard/companies/${c.id}`}
                      style={{
                        color: "#111",
                        fontWeight: 800,
                        textDecoration: "none",
                      }}
                    >
                      {c.name}
                    </Link>
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
                    {c.country ?? "-"}
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
                    {c.industry ?? "-"}
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
                    {c.id}
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
                    {formatDate(c.createdAt)}
                  </td>

                  <td
                    style={{
                      padding: 14,
                      borderBottom: "1px solid #eee",
                      verticalAlign: "top",
                    }}
                  >
                    <Link
                      href={`/dashboard/companies/${c.id}`}
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
              ))
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
            href={buildDashboardCompaniesUrl(prevPage)}
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
            href={buildDashboardCompaniesUrl(nextPage)}
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