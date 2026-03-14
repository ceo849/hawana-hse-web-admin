import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { api } from "@/lib/core-api";
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
    return {
      users: 0,
      sitesProjects: 0,
      safetyReports: 0,
      actionPlans: 0,
    };
  }

  const candidate = value as Record<string, unknown>;

  return {
    users: typeof candidate.users === "number" ? candidate.users : 0,
    sitesProjects:
      typeof candidate.sitesProjects === "number" ? candidate.sitesProjects : 0,
    safetyReports:
      typeof candidate.safetyReports === "number" ? candidate.safetyReports : 0,
    actionPlans:
      typeof candidate.actionPlans === "number" ? candidate.actionPlans : 0,
  };
}

function parseCompany(value: unknown): Company | null {
  if (typeof value !== "object" || value === null) return null;

  const candidate = value as Record<string, unknown>;

  if (
    typeof candidate.id !== "string" ||
    typeof candidate.name !== "string" ||
    (typeof candidate.country !== "string" && candidate.country !== null) ||
    (typeof candidate.industry !== "string" && candidate.industry !== null) ||
    typeof candidate.createdAt !== "string" ||
    typeof candidate.updatedAt !== "string"
  ) {
    return null;
  }

  return {
    id: candidate.id,
    name: candidate.name,
    country: candidate.country as string | null,
    industry: candidate.industry as string | null,
    createdAt: candidate.createdAt,
    updatedAt: candidate.updatedAt,
    _count: parseCompanyCounts(candidate._count),
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
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 12,
        background: "#fff",
        padding: 16,
      }}
    >
      <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "#111" }}>{value}</div>
    </div>
  );
}

export default async function CompanyOverviewPage({
  params,
  searchParams,
}: PageProps) {
  const token = await requireAccessToken();
  const { id } = await params;

  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : {};

  const error = String(resolvedSearchParams?.error ?? "").trim();

  const r = await fetch(api(`/companies/${id}`), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const [usersRes, sitesRes, reportsRes, plansRes] = await Promise.all([
    fetch(api("/users?page=1&limit=100"), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }),
    fetch(api("/sites-projects"), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }),
    fetch(api("/safety-reports?page=1&limit=100"), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }),
    fetch(api("/action-plans"), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }),
  ]);

  if (
    r.status === 401 ||
    usersRes.status === 401 ||
    sitesRes.status === 401 ||
    reportsRes.status === 401 ||
    plansRes.status === 401
  ) {
    redirect("/login");
  }

  if (!r.ok) redirect("/dashboard/companies");

  const json = (await r.json()) as unknown;
  const company = parseCompany(json);

  if (!company) {
    redirect("/dashboard/companies");
  }

  const usersJson = (await usersRes.json().catch(() => [])) as
    | { data?: unknown[] }
    | unknown[];
  const sitesJson = (await sitesRes.json().catch(() => [])) as
    | { data?: unknown[] }
    | unknown[];
  const reportsJson = (await reportsRes.json().catch(() => [])) as
    | { data?: unknown[] }
    | unknown[];
  const plansJson = (await plansRes.json().catch(() => [])) as
    | { data?: unknown[] }
    | unknown[];

  const counts = {
    users:
      !Array.isArray(usersJson) && Array.isArray(usersJson?.data)
        ? usersJson.data.length
        : Array.isArray(usersJson)
        ? usersJson.length
        : 0,
    sitesProjects:
      !Array.isArray(sitesJson) && Array.isArray(sitesJson?.data)
        ? sitesJson.data.length
        : Array.isArray(sitesJson)
        ? sitesJson.length
        : 0,
    safetyReports:
      !Array.isArray(reportsJson) && Array.isArray(reportsJson?.data)
        ? reportsJson.data.length
        : Array.isArray(reportsJson)
        ? reportsJson.length
        : 0,
    actionPlans:
      !Array.isArray(plansJson) && Array.isArray(plansJson?.data)
        ? plansJson.data.length
        : Array.isArray(plansJson)
        ? plansJson.length
        : 0,
  };

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

    const res = await fetch(api(`/companies/${id}`), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenInner}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      redirect(
        `/dashboard/companies/${id}?error=${encodeURIComponent(
          `Update company failed (${res.status}) ${text}`,
        )}`,
      );
    }

    redirect(`/dashboard/companies/${id}`);
  }

  async function deleteCompany() {
    "use server";

    const tokenInner = await requireAccessToken();

    const res = await fetch(api(`/companies/${id}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${tokenInner}`,
      },
      cache: "no-store",
    });

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      redirect(
        `/dashboard/companies/${id}?error=${encodeURIComponent(
          `Delete company failed (${res.status}) ${text}`,
        )}`,
      );
    }

    redirect("/dashboard/companies");
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 960 }}>
      <PageHeader
        title="Company Overview"
        subtitle="Tenant insight first, followed by company control actions"
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

      <div
        style={{
          marginBottom: 8,
          fontSize: 13,
          fontWeight: 700,
          color: "#444",
        }}
      >
        Company Insight
      </div>

      <div
        style={{
          marginBottom: 16,
          padding: 16,
          border: "1px solid #eee",
          borderRadius: 12,
          background: "#fff",
        }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <div>
            <b>Company ID:</b> {company.id}
          </div>
          <div>
            <b>Company Name:</b> {company.name}
          </div>
          <div>
            <b>Country:</b> {company.country ?? "-"}
          </div>
          <div>
            <b>Industry:</b> {company.industry ?? "-"}
          </div>
          <div>
            <b>Created At:</b> {formatDate(company.createdAt)}
          </div>
          <div>
            <b>Updated At:</b> {formatDate(company.updatedAt)}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {metricCard("Users", counts.users)}
        {metricCard("Sites / Projects", counts.sitesProjects)}
        {metricCard("Safety Reports", counts.safetyReports)}
        {metricCard("Action Plans", counts.actionPlans)}
      </div>

      <div
        style={{
          marginBottom: 8,
          fontSize: 13,
          fontWeight: 700,
          color: "#444",
        }}
      >
        Company Control Actions
      </div>

      <form action={updateCompany} style={{ display: "grid", gap: 16 }}>
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
              defaultValue={company.name}
              placeholder="Enter company name"
              style={{
                width: "100%",
                padding: "10px 12px",
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
              defaultValue={company.country ?? ""}
              placeholder="Enter country"
              style={{
                width: "100%",
                padding: "10px 12px",
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
              defaultValue={company.industry ?? ""}
              placeholder="Enter industry"
              style={{
                width: "100%",
                padding: "10px 12px",
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
            Update Company
          </button>

          <Link
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
            Back to Companies
          </Link>
        </div>
      </form>

      <form action={deleteCompany} style={{ marginTop: 16 }}>
        <button
          type="submit"
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #dc2626",
            background: "#fff",
            color: "#dc2626",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Deactivate Company
        </button>
      </form>
    </div>
  );
}