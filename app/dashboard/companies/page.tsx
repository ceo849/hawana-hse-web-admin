// app/dashboard/companies/page.tsx

import Link from "next/link";
import { cookies } from "next/headers";
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
    // ✅ ADDITIVE DEBUG + FIX
    console.log("API BASE:", process.env.NEXT_PUBLIC_API_BASE_URL);

    const BASE =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://127.0.0.1:3001";

    console.log("FINAL BASE USED:", BASE);

    const res = await fetch(
      `${BASE}/v1/companies?page=${page}&limit=${limit}` +
        (search ? `&search=${encodeURIComponent(search)}` : ""),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    console.log("RESPONSE STATUS:", res.status);

    if (res.status === 401) redirect("/login");

    const raw = await res.json();
    console.log("RAW RESPONSE:", raw);

    json = parseCompaniesResponse(raw, page, limit);
  } catch (err) {
    console.error("FETCH ERROR:", err);

    return (
      <div style={{ padding: 24 }}>
        <PageHeader title="Companies Administration" subtitle="Error" />
        Failed to load companies
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
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <PageHeader
        title="Companies Administration"
        subtitle="Tenant company administration"
        action={
          canManageCompanies ? (
            <Link href="/dashboard/companies/new">+ New Company</Link>
          ) : undefined
        }
      />

      <div>Total companies: {meta.total}</div>

      <table>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.country ?? "-"}</td>
              <td>{c.industry ?? "-"}</td>
              <td>{c.id}</td>
              <td>{formatDate(c.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <Link href={buildDashboardCompaniesUrl(prevPage)}>Prev</Link> |{" "}
        <Link href={buildDashboardCompaniesUrl(nextPage)}>Next</Link>
      </div>
    </div>
  );
}