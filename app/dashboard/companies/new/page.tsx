import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
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

    // ✅ FIX
    const res = await serverAppFetch("/companies", token, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
        subtitle="Add a new tenant company"
      />

      {error && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 10,
            background: "#fef2f2",
          }}
        >
          {error}
        </div>
      )}

      <form action={createCompany} style={{ display: "grid", gap: 16 }}>
        <input name="name" placeholder="Company Name" required />
        <input name="country" placeholder="Country" />
        <input name="industry" placeholder="Industry" />

        <button type="submit">Create</button>

        <a href="/dashboard/companies">Cancel</a>
      </form>
    </div>
  );
}