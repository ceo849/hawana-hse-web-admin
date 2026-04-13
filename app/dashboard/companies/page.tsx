import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
import { decodeJwtPayload } from "@/src/auth/jwt";
import { serverAppFetch } from "@/src/lib/server-app-fetch";

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

  let json: CompaniesResponse;

  try {
    const raw = await serverAppFetch(
      `/api/companies?page=${page}&limit=${limit}` +
        (search ? `&search=${encodeURIComponent(search)}` : ""),
    );

    json = parseCompaniesResponse(raw, page, limit);
  } catch (error) {
    if (error instanceof Error && error.message.includes("401")) {
      redirect("/login");
    }

    return (
      <div style={{ fontFamily: "system-ui", padding: 24 }}>
        <PageHeader
          title="Companies Administration"
          subtitle="Tenant company administration"
        />
        <pre>Failed to load companies</pre>
      </div>
    );
  }

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
              <th style={{ padding: 14, textAlign: "left" }}>Company</th>
              <th style={{ padding: 14, textAlign: "left" }}>Country</th>
              <th style={{ padding: 14, textAlign: "left" }}>Industry</th>
              <th style={{ padding: 14, textAlign: "left" }}>Company ID</th>
              <th style={{ padding: 14, textAlign: "left" }}>Created At</th>
            </tr>
          </thead>

          <tbody>
            {companies.map((c) => (
              <tr key={c.id}>
                <td style={{ padding: 14 }}>
                  <Link href={`/dashboard/companies/${c.id}`}>
                    {c.name}
                  </Link>
                </td>
                <td style={{ padding: 14 }}>{c.country ?? "-"}</td>
                <td style={{ padding: 14 }}>{c.industry ?? "-"}</td>
                <td style={{ padding: 14 }}>{c.id}</td>
                <td style={{ padding: 14 }}>
                  {formatDate(c.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <Link href={buildDashboardCompaniesUrl(prevPage)}>Previous</Link>
        <Link href={buildDashboardCompaniesUrl(nextPage)}>Next</Link>
      </div>
    </div>
  );
}