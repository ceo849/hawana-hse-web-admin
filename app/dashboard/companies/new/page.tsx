// app/dashboard/companies/new/page.tsx

import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import PageHeader from "@/components/ui/page-header";
import ErrorState from "@/components/ui/error-state"; // ✅ ADD

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
      // ✅ ADD
      if (err?.message === "SESSION_EXPIRED") {
        redirect("/login");
      }

      console.error("Create Company Error:", err);

      redirect(
        `/dashboard/companies/new?error=${encodeURIComponent(
          "Network/server error while creating company",
        )}`,
      );
    }

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

      {error && <ErrorState message={error} />}

      <form action={createCompany} style={{ display: "grid", gap: 16 }}>
        <input name="name" placeholder="Company Name" required />
        <input name="country" placeholder="Country" />
        <input name="industry" placeholder="Industry" />

        <button type="submit">Create</button>

        <Link href="/dashboard/companies">Cancel</Link>
      </form>
    </div>
  );
}