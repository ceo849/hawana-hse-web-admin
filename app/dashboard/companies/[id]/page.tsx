// app/dashboard/companies/[id]/page.tsx

export const dynamic = "force-dynamic";

import { headers, cookies } from "next/headers"; // ✅ ADD

import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import PageHeader from "@/components/ui/page-header";
import ErrorState from "@/components/ui/error-state";

type CompanyCounts = {
  users: number;
  sitesProjects: number;
  safetyReports: number;
  actionPlans: number;
};

type Company = {
  id: string;
  name: string;
  country: string | null;
  industry: string | null;
  createdAt: string;
  updatedAt: string;
  _count: CompanyCounts;
};

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }> | { error?: string };
};

function parseCompanyCounts(value: unknown): CompanyCounts {
  if (typeof value !== "object" || value === null) {
    return { users: 0, sitesProjects: 0, safetyReports: 0, actionPlans: 0 };
  }

  const c = value as Record<string, unknown>;

  return {
    users: typeof c.users === "number" ? c.users : 0,
    sitesProjects: typeof c.sitesProjects === "number" ? c.sitesProjects : 0,
    safetyReports: typeof c.safetyReports === "number" ? c.safetyReports : 0,
    actionPlans: typeof c.actionPlans === "number" ? c.actionPlans : 0,
  };
}

function parseCompany(value: unknown): Company | null {
  if (typeof value !== "object" || value === null) return null;

  const c = value as Record<string, unknown>;

  if (
    typeof c.id !== "string" ||
    typeof c.name !== "string" ||
    (typeof c.country !== "string" && c.country !== null) ||
    (typeof c.industry !== "string" && c.industry !== null) ||
    typeof c.createdAt !== "string" ||
    typeof c.updatedAt !== "string"
  ) {
    return null;
  }

  return {
    id: c.id,
    name: c.name,
    country: c.country as string | null,
    industry: c.industry as string | null,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    _count: parseCompanyCounts(c._count),
  };
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

function metricCard(label: string, value: number) {
  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 12, color: "#666" }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

export default async function CompanyOverviewPage({
  params,
  searchParams,
}: PageProps) {
  // ✅ ROOT FIX (mandatory for Next.js caching layer)
  headers();
  cookies();

  const token = await requireAccessToken();
  const { id } = await params;

  const sp = searchParams ? await Promise.resolve(searchParams) : {};
  const error = String(sp?.error ?? "").trim();

  let companyRes: Response;

  try {
    companyRes = await serverAppFetch(
      `/api/companies/${encodeURIComponent(id)}`,
      token
    );
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") {
      redirect("/login");
    }

    console.error("Company Fetch Error:", err);

    return (
      <div style={{ padding: 24, maxWidth: 960 }}>
        <PageHeader title="Company Overview" subtitle="Tenant insight" />
        <ErrorState message="Failed to load company (network/server error)" />
      </div>
    );
  }

  if (companyRes.status === 401) {
    redirect("/login");
  }

  if (!companyRes.ok) {
    return (
      <div style={{ padding: 24, maxWidth: 960 }}>
        <PageHeader title="Company Overview" subtitle="Tenant insight" />
        <ErrorState message="Failed to load company" />
      </div>
    );
  }

  const company = parseCompany(await companyRes.json());

  if (!company) {
    redirect("/dashboard/companies");
  }

  async function updateCompany(formData: FormData) {
    "use server";

    const tokenInner = await requireAccessToken();

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      country: String(formData.get("country") ?? "").trim(),
      industry: String(formData.get("industry") ?? "").trim(),
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
    if (!res.ok) redirect(`/dashboard/companies/${id}`);

    redirect(`/dashboard/companies/${id}`);
  }

  async function deleteCompany() {
    "use server";

    const tokenInner = await requireAccessToken();

    const res = await serverAppFetch(
      `/api/companies/${encodeURIComponent(id)}`,
      tokenInner,
      {
        method: "DELETE",
      }
    );

    if (res.status === 401) redirect("/login");
    if (!res.ok) redirect(`/dashboard/companies/${id}`);

    redirect("/dashboard/companies");
  }

  return (
    <div style={{ padding: 24, maxWidth: 960 }}>
      <PageHeader title="Company Overview" subtitle="Tenant insight" />

      {error && <ErrorState message={error} />}

      <div style={{ marginBottom: 16 }}>
        <div><b>ID:</b> {company.id}</div>
        <div><b>Name:</b> {company.name}</div>
        <div><b>Country:</b> {company.country ?? "-"}</div>
        <div><b>Industry:</b> {company.industry ?? "-"}</div>
        <div><b>Created:</b> {formatDate(company.createdAt)}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {metricCard("Users", company._count.users)}
        {metricCard("Sites", company._count.sitesProjects)}
        {metricCard("Reports", company._count.safetyReports)}
        {metricCard("Plans", company._count.actionPlans)}
      </div>

      <form action={updateCompany} style={{ marginTop: 20 }}>
        <input name="name" defaultValue={company.name} />
        <input name="country" defaultValue={company.country ?? ""} />
        <input name="industry" defaultValue={company.industry ?? ""} />
        <button type="submit">Update</button>
      </form>

      <form action={deleteCompany} style={{ marginTop: 10 }}>
        <button type="submit">Delete</button>
      </form>

      <Link href="/dashboard/companies">Back</Link>
    </div>
  );
}