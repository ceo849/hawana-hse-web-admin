// app/dashboard/companies/new/page.tsx

import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import PageHeader from "@/components/ui/page-header";
import ErrorState from "@/components/ui/error-state";

type PageProps = {
  searchParams?: Promise<{ error?: string }> | { error?: string };
};

export default async function NewCompanyPage({ searchParams }: PageProps) {
  await requireAccessToken();

  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : {};

  const error = String(resolvedSearchParams?.error ?? "").trim();

  async function createCompany(formData: FormData) {
    "use server";

    const token = await requireAccessToken();

    const name = String(formData.get("name") ?? "").trim();
    const country = String(formData.get("country") ?? "").trim();
    const industry = String(formData.get("industry") ?? "").trim();

    if (!name) {
      redirect(
        `/dashboard/companies/new?error=${encodeURIComponent(
          "Name is required"
        )}`
      );
    }

    const payload: Record<string, string> = { name };

    if (country) payload.country = country;
    if (industry) payload.industry = industry;

    let res: Response;

    try {
      res = await serverAppFetch("/api/companies", token, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });
    } catch (err: any) {
      if (err?.message === "SESSION_EXPIRED") {
        redirect("/login");
      }

      console.error("Create Company Error:", err);

      redirect(
        `/dashboard/companies/new?error=${encodeURIComponent(
          "Network/server error while creating company"
        )}`
      );
    }

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      redirect(
        `/dashboard/companies/new?error=${encodeURIComponent(
          `Create company failed (${res.status}) ${text}`
        )}`
      );
    }

    redirect("/dashboard/companies");
  }

  return (
    <div style={container}>
      <PageHeader
        title="Create Company"
        subtitle="Add a new tenant company"
      />

      {error && <ErrorState message={error} />}

      <form action={createCompany} style={form}>
        <div style={card}>
          <div>
            <label style={label}>Company Name</label>
            <input
              name="name"
              placeholder="Enter company name"
              required
              style={input}
            />
          </div>

          <div>
            <label style={label}>Country</label>
            <input
              name="country"
              placeholder="Enter country"
              style={input}
            />
          </div>

          <div>
            <label style={label}>Industry</label>
            <input
              name="industry"
              placeholder="Enter industry"
              style={input}
            />
          </div>
        </div>

        <div style={actionsRow}>
          <button type="submit" style={primaryBtn}>
            Create Company
          </button>

          <Link href="/dashboard/companies" style={cancelLink}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

/* ================= STANDARDIZED STYLES ================= */

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