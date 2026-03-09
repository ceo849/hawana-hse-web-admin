import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { api } from "@/lib/core-api";
import PageHeader from "@/components/ui/page-header";

type Company = {
  id: string;
  name: string;
  country: string | null;
  industry: string | null;
  createdAt: string;
  updatedAt: string;
};

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }> | { error?: string };
};

function isCompany(value: unknown): value is Company {
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

export default async function EditCompanyPage({
  params,
  searchParams,
}: PageProps) {
  const token = await requireAccessToken();
  const { id } = await params;

  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : {};

  const error = String(resolvedSearchParams?.error ?? "").trim();

  const r = await fetch(api(`/v1/companies/${id}`), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (r.status === 401) redirect("/login");
  if (!r.ok) redirect("/dashboard/companies");

  const json = (await r.json()) as unknown;

  if (!isCompany(json)) {
    redirect("/dashboard/companies");
  }

  const company = json;

  async function updateCompany(formData: FormData) {
    "use server";

    const tokenInner = await requireAccessToken();

    const name = String(formData.get("name") ?? "").trim();
    const country = String(formData.get("country") ?? "").trim();
    const industry = String(formData.get("industry") ?? "").trim();

    const payload: Record<string, string> = {};

    if (name) payload.name = name;
    if (country) payload.country = country;
    if (industry) payload.industry = industry;

    const res = await fetch(api(`/v1/companies/${id}`), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenInner}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      redirect(
        `/dashboard/companies/${id}?error=${encodeURIComponent(
          `Update company failed (${res.status}) ${text}`,
        )}`,
      );
    }

    redirect("/dashboard/companies");
  }

  async function deleteCompany() {
    "use server";

    const tokenInner = await requireAccessToken();

    const res = await fetch(api(`/v1/companies/${id}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${tokenInner}`,
      },
      cache: "no-store",
    });

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      redirect(
        `/dashboard/companies/${id}?error=${encodeURIComponent(
          `Delete company failed (${res.status}) ${text}`,
        )}`,
      );
    }

    redirect("/dashboard/companies");
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 760 }}>
      <PageHeader
        title="Edit Company"
        subtitle="Update company information and tenant record details"
      />

      {error ? (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 10,
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
            whiteSpace: "pre-wrap",
          }}
        >
          {error}
        </div>
      ) : null}

      <div
        style={{
          marginBottom: 16,
          padding: 16,
          border: "1px solid #eee",
          borderRadius: 12,
          background: "#fff",
        }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <div>
            <b>Company ID:</b> {company.id}
          </div>
          <div>
            <b>Created At:</b> {formatDate(company.createdAt)}
          </div>
          <div>
            <b>Updated At:</b> {formatDate(company.updatedAt)}
          </div>
        </div>
      </div>

      <form action={updateCompany} style={{ display: "grid", gap: 16 }}>
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 12,
            background: "#fff",
            padding: 16,
            display: "grid",
            gap: 14,
          }}
        >
          <div>
            <label
              htmlFor="name"
              style={{ display: "block", marginBottom: 6, fontWeight: 700 }}
            >
              Company Name
            </label>
            <input
              id="name"
              name="name"
              defaultValue={company.name}
              placeholder="Enter company name"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="country"
              style={{ display: "block", marginBottom: 6, fontWeight: 700 }}
            >
              Country
            </label>
            <input
              id="country"
              name="country"
              defaultValue={company.country ?? ""}
              placeholder="Enter country"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="industry"
              style={{ display: "block", marginBottom: 6, fontWeight: 700 }}
            >
              Industry
            </label>
            <input
              id="industry"
              name="industry"
              defaultValue={company.industry ?? ""}
              placeholder="Enter industry"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="submit"
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #111",
              background: "#111",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Update Company
          </button>

          <a
            href="/dashboard/companies"
            style={{
              display: "inline-block",
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "#fff",
              textDecoration: "none",
              color: "#111",
              fontWeight: 600,
            }}
          >
            Cancel
          </a>
        </div>
      </form>

      <form action={deleteCompany} style={{ marginTop: 16 }}>
        <button
          type="submit"
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #dc2626",
            background: "#fff",
            color: "#dc2626",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Delete Company
        </button>
      </form>
    </div>
  );
}