import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { api } from "@/lib/core-api";

type Company = {
  id: string;
  name: string;
  country: string | null;
  industry: string | null;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCompanyPage({ params }: PageProps) {
  const token = await requireAccessToken();
  const { id } = await params;

  const r = await fetch(api(`/v1/companies/${id}`), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (r.status === 401) redirect("/login");
  if (!r.ok) redirect("/dashboard/companies");

  const company: Company = await r.json();

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
    if (!res.ok) redirect(`/dashboard/companies/${id}`);

    redirect("/dashboard/companies");
  }

  return (
    <div style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 40, fontWeight: 900, marginBottom: 20 }}>
        Edit Company
      </h1>

      <form action={updateCompany} style={{ maxWidth: 700 }}>
        <input
          name="name"
          defaultValue={company.name}
          placeholder="Company Name"
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
          defaultValue={company.country ?? ""}
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
          defaultValue={company.industry ?? ""}
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
          Update Company
        </button>
      </form>
    </div>
  );
}