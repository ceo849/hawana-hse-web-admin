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

type CompaniesResponse = {
  data: CompanyDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

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

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  const payload = decodeJwtPayload(token);
  const currentRole: Role = (payload?.role as Role) ?? "UNKNOWN";
  const canManageCompanies = currentRole === "OWNER";

  const page = Number(searchParams.page ?? "1");
  const search = searchParams.search ?? "";
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
        <PageHeader title="Companies Administration" subtitle="Failed to load companies" />
        <pre>{text}</pre>
      </div>
    );
  }

  const json = (await r.json()) as CompaniesResponse;

  const companies = json.data;
  const meta = json.meta;

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <PageHeader
        title="Companies Administration"
        subtitle="Tenant company administration"
        action={
          canManageCompanies ? (
            <Link
              href="/dashboard/companies/new"
              style={{
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

      <div style={{ marginBottom: 20 }}>
        Total companies: <strong>{meta.total}</strong>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
        }}
      >
        <thead>
          <tr style={{ background: "#fafafa" }}>
            <th style={{ padding: 12, textAlign: "left" }}>Company</th>
            <th style={{ padding: 12, textAlign: "left" }}>Country</th>
            <th style={{ padding: 12, textAlign: "left" }}>Industry</th>
            <th style={{ padding: 12, textAlign: "left" }}>Created</th>
            <th style={{ padding: 12, textAlign: "left" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {companies.map((c) => (
            <tr key={c.id}>
              <td style={{ padding: 12 }}>
                <Link href={`/dashboard/companies/${c.id}`} style={{ fontWeight: 700 }}>
                  {c.name}
                </Link>
              </td>

              <td style={{ padding: 12 }}>{c.country ?? "-"}</td>
              <td style={{ padding: 12 }}>{c.industry ?? "-"}</td>
              <td style={{ padding: 12 }}>{formatDate(c.createdAt)}</td>

              <td style={{ padding: 12 }}>
                <Link href={`/dashboard/companies/${c.id}`}>Open</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        {page > 1 && (
          <Link href={`/dashboard/companies?page=${page - 1}`}>
            ← Previous
          </Link>
        )}

        {page < meta.totalPages && (
          <Link href={`/dashboard/companies?page=${page + 1}`}>
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}