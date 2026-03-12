import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { api } from "@/lib/core-api";
import PageHeader from "@/components/ui/page-header";

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
          "Name is required",
        )}`,
      );
    }

    const payload: Record<string, string> = { name };

    if (country) payload.country = country;
    if (industry) payload.industry = industry;

    const res = await fetch(api("/companies"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      redirect(
        `/dashboard/companies/new?error=${encodeURIComponent(
          `Create company failed (${res.status}) ${text}`,
        )}`,
      );
    }

    redirect("/dashboard/companies");
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 760 }}>
      <PageHeader
        title="Create Company"
        subtitle="Add a new tenant company to the platform"
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

      <form action={createCompany} style={{ display: "grid", gap: 16 }}>
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
              placeholder="Enter company name"
              required
              style={{
                width: "100%",
                padding: 10,
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
              placeholder="Enter country"
              style={{
                width: "100%",
                padding: 10,
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
              placeholder="Enter industry"
              style={{
                width: "100%",
                padding: 10,
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
            Create Company
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
    </div>
  );
}