import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch"; // ❌ سيظل موجود (لا نحذفه)
import PageHeader from "@/components/ui/page-header";

// ✅ ADDITIVE: fallback بدل الملف المفقود
async function serverAppFetchFallback(
  path: string,
  token: string,
  options: RequestInit = {}
) {
  const BASE =
    (process.env.NEXT_PUBLIC_API_BASE_URL ??
      "http://localhost:3001").replace(/\/$/, "");

  return fetch(`${BASE}/v1${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

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

    // ✅ FIX: استخدام fallback بدل serverAppFetch
    const res = await serverAppFetchFallback("/companies", token, {
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