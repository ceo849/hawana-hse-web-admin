import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { api } from "@/lib/core-api";

type PageProps = {
  searchParams?: Promise<{ err?: string }>;
};

export default async function NewCompanyPage({ searchParams }: PageProps) {
  await requireAccessToken();

  const sp = searchParams ? await searchParams : undefined;
  const err = String(sp?.err ?? "").trim();

  async function createCompany(formData: FormData) {
    "use server";

    const token = await requireAccessToken();

    const name = String(formData.get("name") ?? "").trim();
    const country = String(formData.get("country") ?? "").trim();
    const industry = String(formData.get("industry") ?? "").trim();

    if (!name) {
      redirect(
        `/dashboard/companies/new?err=${encodeURIComponent("Name is required")}`
      );
    }

    const payload: Record<string, string> = { name };

    if (country) payload.country = country;
    if (industry) payload.industry = industry;

    const res = await fetch(api("/v1/companies"), {
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
        `/dashboard/companies/new?err=${encodeURIComponent(
          `Create failed (${res.status}) ${text}`
        )}`
      );
    }

    redirect("/dashboard/companies");
  }

  return (
    <div style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 40, fontWeight: 900, marginBottom: 20 }}>
        Create Company
      </h1>

      {err ? (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 12,
            background: "#fff5f5",
            border: "1px solid #ffd6d6",
            color: "#b00020",
            fontWeight: 700,
          }}
        >
          {err}
        </div>
      ) : null}

      <form action={createCompany} style={{ maxWidth: 700 }}>
        <input
          name="name"
          placeholder="Company Name"
          required
          style={{
            width: "100%",
            padding: 16,
            marginBottom: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        />

        <input
          name="country"
          placeholder="Country"
          style={{
            width: "100%",
            padding: 16,
            marginBottom: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        />

        <input
          name="industry"
          placeholder="Industry"
          style={{
            width: "100%",
            padding: 16,
            marginBottom: 16,
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 10,
            border: "none",
            background: "#111",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Create Company
        </button>
      </form>
    </div>
  );
}