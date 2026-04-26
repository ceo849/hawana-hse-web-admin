// app/dashboard/companies/page.tsx

export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import PageHeader from "@/components/ui/page-header";
import ErrorState from "@/components/ui/error-state";
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
  return <span style={badgeStyle}>{industry ?? "-"}</span>;
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
      token,
      { cache: "no-store" }
    );
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") {
      redirect("/login");
    }

    console.error("Companies Fetch Error:", err);

    return (
      <div style={container}>
        <PageHeader title="Companies" subtitle="Tenant company administration" />
        <ErrorState message="Failed to load companies (network/server error)" />
      </div>
    );
  }

  if (res.status === 401) redirect("/login");

  if (!res.ok) {
    return (
      <div style={container}>
        <PageHeader title="Companies" subtitle="Tenant company administration" />
        <ErrorState message="Failed to load companies" />
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
    <div style={container}>
      <PageHeader
        title="Companies"
        subtitle="Tenant company administration"
        action={
          canShowCreateAction ? (
            <Link href="/dashboard/companies/new" style={headerAction}>
              + New Company
            </Link>
          ) : undefined
        }
      />

      <section style={section}>
        <div style={sectionHeader}>
          <div style={sectionTitle}>Companies Register</div>
          <div style={sectionMeta}>Total: {meta.total}</div>
        </div>

        {companies.length === 0 ? (
          <div style={emptyBox}>No companies found.</div>
        ) : (
          <>
            <div className="desktop-only">
              <div style={tableCard}>
                <table
                  style={{
                    minWidth: 650,
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <tbody>
                    {companies.map((c) => (
                      <tr key={c.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                        <td style={titleCell}>
                          <Link
                            href={`/dashboard/companies/${c.id}`}
                            style={rowLink}
                          >
                            {c.name}
                          </Link>
                        </td>

                        <td style={td}>{c.country ?? "-"}</td>

                        <td style={td}>
                          <IndustryBadge industry={c.industry} />
                        </td>

                        <td style={mutedCell}>{c.id}</td>

                        <td style={td}>{formatDate(c.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mobile-only" style={{ display: "grid", gap: 10 }}>
              {companies.map((c) => (
                <Link
                  key={c.id}
                  href={`/dashboard/companies/${c.id}`}
                  style={companyCard}
                >
                  <div style={companyTop}>
                    <div style={companyName}>{c.name}</div>
                    <IndustryBadge industry={c.industry} />
                  </div>

                  <div style={companyCountry}>{c.country ?? "-"}</div>

                  <div style={companyDate}>
                    Created: {formatDate(c.createdAt)}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        <div style={pagination}>
          <Link href={buildDashboardCompaniesUrl(prevPage)} style={pageLink}>
            Prev
          </Link>

          <span style={pageText}>
            Page {meta.page} / {Math.max(meta.totalPages, 1)}
          </span>

          <Link href={buildDashboardCompaniesUrl(nextPage)} style={pageLink}>
            Next
          </Link>
        </div>
      </section>
    </div>
  );
}

/* styles بدون تغيير */

const container: React.CSSProperties = {
  padding: 16,
  fontFamily: "system-ui",
  maxWidth: 680,
  margin: "0 auto",
};

const section: React.CSSProperties = {
  marginTop: 18,
  display: "grid",
  gap: 10,
};

const sectionHeader: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#6b7280",
};

const sectionMeta: React.CSSProperties = {
  fontSize: 12,
  color: "#9ca3af",
};

const headerAction: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 12,
  background: "#111827",
  color: "#fff",
  textDecoration: "none",
};

const tableCard: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  overflowX: "auto" as const,
};

const td: React.CSSProperties = {
  padding: 10,
  fontSize: 13,
};

const titleCell: React.CSSProperties = {
  ...td,
  fontWeight: 700,
};

const mutedCell: React.CSSProperties = {
  ...td,
  color: "#6b7280",
};

const rowLink: React.CSSProperties = {
  color: "#111827",
  fontWeight: 700,
  textDecoration: "none",
};

const badgeStyle: React.CSSProperties = {
  padding: "4px 10px",
  borderRadius: "999px",
  fontSize: 12,
  fontWeight: 700,
  background: "#f3f4f6",
};

const companyCard: React.CSSProperties = {
  display: "block",
  padding: 14,
  borderRadius: 16,
  border: "1px solid #e5e7eb",
};

const companyTop: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
};

const companyName: React.CSSProperties = {
  fontWeight: 800,
};

const companyCountry: React.CSSProperties = {
  marginTop: 10,
};

const companyDate: React.CSSProperties = {
  fontSize: 12,
  color: "#9ca3af",
};

const pagination: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
};

const pageLink: React.CSSProperties = {
  padding: "8px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
};

const pageText: React.CSSProperties = {
  fontSize: 12,
  color: "#9ca3af",
};

const emptyBox: React.CSSProperties = {
  padding: 14,
  border: "1px solid #e5e7eb",
  borderRadius: 16,
};