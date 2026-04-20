export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAccessToken } from "@/lib/server-auth";
import PageHeader from "@/components/ui/page-header";
import { decodeJwtPayload } from "@/src/auth/jwt";
import { serverSafeFetch } from "@/src/lib/server-safe-fetch";

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

// ===== Guards =====
function isCompanyDto(value: unknown): value is CompanyDto {
  if (typeof value !== "object" || value === null) return false;

  const c = value as Record<string, unknown>;

  return (
    typeof c.id === "string" &&
    typeof c.name === "string" &&
    (typeof c.country === "string" || c.country === null) &&
    (typeof c.industry === "string" || c.industry === null) &&
    typeof c.createdAt === "string" &&
    typeof c.updatedAt === "string"
  );
}

function parseCompaniesResponse(
  value: unknown,
  fallbackPage: number,
  fallbackLimit: number
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

  const c = value as Record<string, unknown>;

  const data = Array.isArray(c.data)
    ? c.data.filter(isCompanyDto)
    : [];

  const metaRaw =
    typeof c.meta === "object" && c.meta !== null
      ? (c.meta as Record<string, unknown>)
      : null;

  return {
    data,
    meta: {
      page:
        typeof metaRaw?.page === "number" ? metaRaw.page : fallbackPage,
      limit:
        typeof metaRaw?.limit === "number" ? metaRaw.limit : fallbackLimit,
      total:
        typeof metaRaw?.total === "number" ? metaRaw.total : data.length,
      totalPages:
        typeof metaRaw?.totalPages === "number"
          ? metaRaw.totalPages
          : 1,
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

// ===== Company Badge (Additive) =====
function IndustryBadge({ industry }: { industry: string | null }) {
  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: 12,
        fontWeight: 600,
        background: "#f3f4f6",
        color: "#111827",
        whiteSpace: "nowrap",
      }}
    >
      {industry ?? "-"}
    </span>
  );
}

// ===== PAGE =====
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

  const token = await requireAccessToken();

  const payload = decodeJwtPayload(token);
  const currentRole: Role = (payload?.role as Role) ?? "UNKNOWN";
  const canManageCompanies = currentRole === "OWNER";

  const page = Math.max(1, Number(resolvedSearchParams.page ?? "1") || 1);
  const search = resolvedSearchParams.search ?? "";
  const limit = 10;

  let res;

  try {
    res = await serverSafeFetch(
      `/companies?page=${page}&limit=${limit}` +
        (search ? `&search=${encodeURIComponent(search)}` : ""),
      token,
      { cache: "no-store" }
    );
  } catch (err) {
    console.error("Companies Fetch Error:", err);

    return (
      <div style={{ padding: 24 }}>
        <PageHeader title="Companies Administration" subtitle="Error" />
        <div style={{ color: "red", marginTop: 12 }}>
          Failed to load companies (network/server error)
        </div>
      </div>
    );
  }

  if (!res.ok) {
    return (
      <div style={{ padding: 24 }}>
        <PageHeader title="Companies Administration" subtitle="Error" />
        <div style={{ color: "red", marginTop: 12 }}>
          Failed to load companies
        </div>
      </div>
    );
  }

  const raw = await res.json();
  const json = parseCompaniesResponse(raw, page, limit);

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
    <div style={{ padding: 16, fontFamily: "system-ui" }}>
      <PageHeader
        title="Companies Administration"
        subtitle="Tenant company administration"
        action={
          canManageCompanies ? (
            <Link href="/dashboard/companies/new">+ New Company</Link>
          ) : undefined
        }
      />

      <div style={{ marginBottom: 12 }}>
        Total companies: {meta.total}
      </div>

      {/* ===== Desktop Table ===== */}
      <div className="desktop-only">
        <div style={{ overflowX: "auto" }}>
          <table style={{ minWidth: 650, width: "100%" }}>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: 8, whiteSpace: "nowrap" }}>
                    {c.name}
                  </td>

                  <td style={{ padding: 8 }}>
                    {c.country ?? "-"}
                  </td>

                  <td style={{ padding: 8 }}>
                    <IndustryBadge industry={c.industry} />
                  </td>

                  <td
                    style={{
                      padding: 8,
                      maxWidth: 160,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.id}
                  </td>

                  <td style={{ padding: 8, whiteSpace: "nowrap" }}>
                    {formatDate(c.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Mobile Cards ===== */}
      <div className="mobile-only" style={{ marginTop: 12 }}>
        {companies.map((c) => (
          <Link
            key={c.id}
            href={`/dashboard/companies/${c.id}`}
            style={{
              display: "block",
              padding: 16,
              borderRadius: 14,
              border: "1px solid #e5e7eb",
              marginBottom: 12,
              textDecoration: "none",
              color: "inherit",
              background: "#ffffff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 6 }}>
              {c.name}
            </div>

            <div
              style={{
                fontSize: 13,
                color: "#6b7280",
                marginBottom: 6,
              }}
            >
              {c.country ?? "-"}
            </div>

            <div style={{ marginBottom: 4 }}>
              <IndustryBadge industry={c.industry} />
            </div>

            <div style={{ fontSize: 12, color: "#9ca3af" }}>
              {formatDate(c.createdAt)}
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <Link href={buildDashboardCompaniesUrl(prevPage)}>Prev</Link> |{" "}
        <Link href={buildDashboardCompaniesUrl(nextPage)}>Next</Link>
      </div>
    </div>
  );
}