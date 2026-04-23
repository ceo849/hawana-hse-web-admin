import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import PageHeader from "@/components/ui/page-header";

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
  const token = await requireAccessToken();
  const { id } = await params;

  const sp = searchParams ? await Promise.resolve(searchParams) : {};
  const error = String(sp?.error ?? "").trim();

  const [companyRes, usersRes, sitesRes, reportsRes, plansRes] =
    await Promise.all([
      serverAppFetch(`/api/companies/${encodeURIComponent(id)}`, token),
      serverAppFetch("/api/users?page=1&limit=100", token),
      serverAppFetch("/api/sites-projects", token),
      serverAppFetch("/api/safety-reports?page=1&limit=100", token),
      serverAppFetch("/api/action-plans", token),
    ]);

  if (
    companyRes.status === 401 ||
    usersRes.status === 401 ||
    sitesRes.status === 401 ||
    reportsRes.status === 401 ||
    plansRes.status === 401
  ) {
    redirect("/login");
  }

  if (!companyRes.ok) redirect("/dashboard/companies");

  const company = parseCompany(await companyRes.json());
  if (!company) redirect("/dashboard/companies");

  const usersJson = await usersRes.json().catch(() => []);
  const sitesJson = await sitesRes.json().catch(() => []);
  const reportsJson = await reportsRes.json().catch(() => []);
  const plansJson = await plansRes.json().catch(() => []);

  const count = (v: any) =>
    Array.isArray(v?.data) ? v.data.length : Array.isArray(v) ? v.length : 0;

  const counts = {
    users: count(usersJson),
    sitesProjects: count(sitesJson),
    safetyReports: count(reportsJson),
    actionPlans: count(plansJson),
  };

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

      {error && <div style={{ color: "red" }}>{error}</div>}

      <div style={{ marginBottom: 16 }}>
        <div>
          <b>ID:</b> {company.id}
        </div>
        <div>
          <b>Name:</b> {company.name}
        </div>
        <div>
          <b>Country:</b> {company.country ?? "-"}
        </div>
        <div>
          <b>Industry:</b> {company.industry ?? "-"}
        </div>
        <div>
          <b>Created:</b> {formatDate(company.createdAt)}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
        }}
      >
        {metricCard("Users", counts.users)}
        {metricCard("Sites", counts.sitesProjects)}
        {metricCard("Reports", counts.safetyReports)}
        {metricCard("Plans", counts.actionPlans)}
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