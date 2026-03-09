import Link from "next/link";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/page-header";

type CompanyDto = {
  id: string;
  name: string;
  country: string | null;
  industry: string | null;
  createdAt: string;
  updatedAt: string;
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

function parseCompanies(value: unknown): CompanyDto[] {
  if (Array.isArray(value)) {
    return value.filter(isCompanyDto);
  }

  if (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { data?: unknown }).data)
  ) {
    return ((value as { data: unknown[] }).data).filter(isCompanyDto);
  }

  return [];
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

export default async function CompaniesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${host}`;

  const r = await fetch(`${origin}/api/companies`, {
    method: "GET",
    cache: "no-store",
    headers: {
      cookie: cookieStore.toString(),
    },
  });

  if (r.status === 401) {
    redirect("/login");
  }

  if (!r.ok) {
    const text = await r.text().catch(() => "");

    return (
      <div style={{ fontFamily: "system-ui", padding: 24 }}>
        <PageHeader
          title="Companies"
          subtitle="Manage tenant companies and organizational records"
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
        >{`Failed to load companies (${r.status})
${text}`}</pre>
      </div>
    );
  }

  const json = (await r.json()) as unknown;
  const companies = parseCompanies(json);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <PageHeader
        title="Companies"
        subtitle="Manage tenant companies and organizational records"
        action={
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
        Total companies: <strong>{companies.length}</strong>
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
            minWidth: 1080,
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
                Company
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 14,
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                }}
              >
                Country
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 14,
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                }}
              >
                Industry
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 14,
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                }}
              >
                Company ID
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
                Updated At
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
            {companies.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
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
                      fontSize: 14,
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
                      fontSize: 14,
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
                      fontSize: 13,
                      color: "#444",
                    }}
                  >
                    {formatDate(c.updatedAt)}
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
                      Open
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}