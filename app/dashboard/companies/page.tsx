export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAccessToken } from "@/lib/server-auth";
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

function parseCompaniesResponse(value: unknown): CompaniesResponse {
  if (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { data?: unknown }).data)
  ) {
    const raw = value as CompaniesResponse;

    return {
      data: raw.data,
      meta: raw.meta,
    };
  }

  return {
    data: [],
    meta: undefined,
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
  const canShowCreateAction = currentRole === "OWNER";

  const page = Math.max(1, Number(resolvedSearchParams.page ?? "1") || 1);
  const search = resolvedSearchParams.search ?? "";
  const limit = 10;

  let res: Response;

  try {
    res = await serverAppFetch(
      `/api/companies?page=${page}&limit=${limit}` +
        (search ? `&search=${encodeURIComponent(search)}` : ""),
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
  const json = parseCompaniesResponse(raw);

  const companies = json.data;
  const meta = json.meta ?? {
    page,
    limit,
    total: 0,
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
          canShowCreateAction ? (
            <Link href="/dashboard/companies/new">+ New Company</Link>
          ) : undefined
        }
      />

      <div style={{ marginBottom: 12 }}>Total companies: {meta.total}</div>

      <div className="desktop-only">
        <div style={{ overflowX: "auto" }}>
          <table style={{ minWidth: 650, width: "100%" }}>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: 8, whiteSpace: "nowrap" }}>{c.name}</td>

                  <td style={{ padding: 8 }}>{c.country ?? "-"}</td>

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
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{c.name}</div>

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