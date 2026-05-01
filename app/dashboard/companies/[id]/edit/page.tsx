// app/dashboard/companies/[id]/edit/page.tsx

export const dynamic = "force-dynamic";

import { headers, cookies } from "next/headers"; // ✅ SSR FIX

import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import PageHeader from "@/components/ui/page-header";
import ErrorState from "@/components/ui/error-state";

type PageProps = {
  params: { id: string } | Promise<{ id: string }>;
  searchParams?: { error?: string } | Promise<{ error?: string }>;
};

type Company = {
  id: string;
  name: string;
  country: string | null;
  industry: string | null;
};

function normalize(v: unknown) {
  return String(v ?? "").trim();
}

export default async function EditCompanyPage({
  params,
  searchParams,
}: PageProps) {
  // ✅ ROOT FIX
  headers();
  cookies();

  const resolvedParams = await Promise.resolve(params);
  const resolvedSearch = await Promise.resolve(searchParams ?? {});

  const id = normalize(resolvedParams?.id);
  if (!id) redirect("/dashboard/companies");

  const token = await requireAccessToken();

  let r: Response;

  try {
    r = await serverAppFetch(
      `/api/companies/${encodeURIComponent(id)}`,
      token,
      { cache: "no-store" }
    );
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") redirect("/login");

    console.error("Edit Company Fetch Error:", err);

    return (
      <div style={container}>
        <PageHeader
          title="Edit Company"
          subtitle="Update tenant company details"
        />
        <ErrorState message="Failed to load company (network/server error)" />
      </div>
    );
  }

  if (r.status === 401) redirect("/login");

  if (!r.ok) {
    return (
      <div style={container}>
        <PageHeader
          title="Edit Company"
          subtitle="Update tenant company details"
        />
        <ErrorState message="Failed to load company" />
      </div>
    );
  }

  const company = await r.json();

  const error = normalize(resolvedSearch?.error);

  async function updateCompany(formData: FormData) {
    "use server";

    const tokenInner = await requireAccessToken();

    const name = normalize(formData.get("name"));
    const country = normalize(formData.get("country"));
    const industry = normalize(formData.get("industry"));

    if (!name) {
      redirect(
        `/dashboard/companies/${id}/edit?error=${encodeURIComponent(
          "Name is required"
        )}`
      );
    }

    const payload: Record<string, string | null> = {
      name,
      country: country || null,
      industry: industry || null,
    };

    const res = await serverAppFetch(
      `/api/companies/${encodeURIComponent(id)}`,
      tokenInner,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      redirect(
        `/dashboard/companies/${id}/edit?error=${encodeURIComponent(
          `Update failed (${res.status}) ${text}`
        )}`
      );
    }

    redirect(`/dashboard/companies/${id}`);
  }

  return (
    <div style={container}>
      <PageHeader
        title="Edit Company"
        subtitle="Update tenant company details"
      />

      {error && <ErrorState message={error} />}

      <form action={updateCompany} style={form}>
        <div style={card}>
          <div>
            <label style={label}>Company Name</label>
            <input
              name="name"
              defaultValue={company.name}
              required
              style={input}
            />
          </div>

          <div>
            <label style={label}>Country</label>
            <input
              name="country"
              defaultValue={company.country ?? ""}
              style={input}
            />
          </div>

          <div>
            <label style={label}>Industry</label>
            <input
              name="industry"
              defaultValue={company.industry ?? ""}
              style={input}
            />
          </div>
        </div>

        <div style={actionsRow}>
          <button type="submit" style={primaryBtn}>
            Update Company
          </button>

          <Link
            href={`/dashboard/companies/${id}`}
            style={cancelLink}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

/* ================= STANDARD ================= */

const container: React.CSSProperties = {
  padding: 24,
  fontFamily: "system-ui",
  maxWidth: 760,
  margin: "0 auto",
};

const form: React.CSSProperties = {
  display: "grid",
  gap: 16,
};

const card: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  background: "#fff",
  padding: 16,
  display: "grid",
  gap: 14,
};

const label: React.CSSProperties = {
  marginBottom: 6,
  fontWeight: 700,
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
};

const actionsRow: React.CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "center",
};

const primaryBtn: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  background: "#111",
  color: "#fff",
};

const cancelLink: React.CSSProperties = {
  textDecoration: "none",
  color: "#111827",
  fontWeight: 600,
};