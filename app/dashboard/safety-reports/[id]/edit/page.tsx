// app/dashboard/safety-reports/[id]/edit/page.tsx

export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import PageHeader from "@/components/ui/page-header";
import ErrorState from "@/components/ui/error-state";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
};

type SafetyReport = {
  id: string;
  title: string | null;
  description: string | null;
  status: string | null;
  siteProjectId: string | null;
};

type SiteProject = {
  id: string;
  name: string;
  location: string | null;
  status: string;
};

function isSafetyReport(v: unknown): v is SafetyReport {
  if (typeof v !== "object" || v === null) return false;
  const c = v as Record<string, unknown>;

  return (
    typeof c.id === "string" &&
    (typeof c.title === "string" || c.title === null) &&
    (typeof c.description === "string" || c.description === null) &&
    (typeof c.status === "string" || c.status === null) &&
    (typeof c.siteProjectId === "string" || c.siteProjectId === null)
  );
}

function isSiteProject(v: unknown): v is SiteProject {
  if (typeof v !== "object" || v === null) return false;
  const c = v as Record<string, unknown>;

  return (
    typeof c.id === "string" &&
    typeof c.name === "string" &&
    (typeof c.location === "string" || c.location === null) &&
    typeof c.status === "string"
  );
}

function formatSiteProjectLabel(site: SiteProject): string {
  return site.location ? `${site.name} (${site.location})` : site.name;
}

export default async function EditSafetyReportPage({
  params,
  searchParams,
}: PageProps) {
  const token = await requireAccessToken();

  const { id } = await params;
  const sp = searchParams ? await searchParams : undefined;
  const error = String(sp?.error ?? "").trim();

  let reportRes: Response;

  try {
    reportRes = await serverAppFetch(
      `/api/safety-reports/${encodeURIComponent(id)}`,
      token,
      { cache: "no-store" }
    );
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") redirect("/login");

    console.error("Safety Report Fetch Error:", err);

    return (
      <div style={{ padding: 40, maxWidth: 900 }}>
        <PageHeader title="Edit Safety Report" />
        <ErrorState message="Failed to load safety report (network/server error)" />
      </div>
    );
  }

  if (reportRes.status === 401) redirect("/login");
  if (!reportRes.ok) redirect("/dashboard/safety-reports");

  const reportJson = await reportRes.json();
  if (!isSafetyReport(reportJson)) {
    redirect("/dashboard/safety-reports");
  }

  const report = reportJson;

  let sitesRes: Response;

  try {
    sitesRes = await serverAppFetch("/api/sites-projects", token, {
      cache: "no-store",
    });
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") redirect("/login");

    console.error("Sites Fetch Error:", err);

    return (
      <div style={{ padding: 40, maxWidth: 900 }}>
        <PageHeader title="Edit Safety Report" />
        <ErrorState message="Failed to load sites/projects" />
      </div>
    );
  }

  if (sitesRes.status === 401) redirect("/login");

  const sitesJson = sitesRes.ok ? await sitesRes.json() : [];
  const siteProjects = Array.isArray(sitesJson)
    ? sitesJson.filter(isSiteProject)
    : [];

  async function updateSafetyReport(formData: FormData) {
    "use server";

    const tokenInner = await requireAccessToken();

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const status = String(formData.get("status") ?? "").trim();
    const siteProjectId = String(formData.get("siteProjectId") ?? "").trim();

    const payload: Record<string, string | null> = {};

    if (title) payload.title = title;
    payload.description = description || null;
    if (status) payload.status = status;
    payload.siteProjectId = siteProjectId || null;

    const res = await serverAppFetch(
      `/api/safety-reports/${encodeURIComponent(id)}`,
      tokenInner,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      redirect(
        `/dashboard/safety-reports/${id}/edit?error=${encodeURIComponent(
          `Update failed (${res.status}) ${text}`
        )}`
      );
    }

    redirect(`/dashboard/safety-reports/${id}`);
  }

  return (
    <div style={{ padding: 40, fontFamily: "system-ui", maxWidth: 900 }}>
      <PageHeader title="Edit Safety Report" subtitle="Update report details" />

      {error && <ErrorState message={error} />}

      <form action={updateSafetyReport}>
        <input
          name="title"
          defaultValue={report.title ?? ""}
          style={{ width: "100%", padding: 16, marginBottom: 12 }}
        />

        <select
          name="siteProjectId"
          defaultValue={report.siteProjectId ?? ""}
          style={{ width: "100%", padding: 16, marginBottom: 12 }}
        >
          <option value="">No Site / Project</option>
          {siteProjects.map((s) => (
            <option key={s.id} value={s.id}>
              {formatSiteProjectLabel(s)}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          defaultValue={report.description ?? ""}
          rows={8}
          style={{ width: "100%", padding: 16, marginBottom: 12 }}
        />

        <select
          name="status"
          defaultValue={report.status ?? "OPEN"}
          style={{ width: "100%", padding: 16, marginBottom: 16 }}
        >
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="CLOSED">CLOSED</option>
        </select>

        <button type="submit">Update</button>
      </form>

      <div style={{ marginTop: 16 }}>
        <Link href={`/dashboard/safety-reports/${id}`}>Back</Link>
      </div>
    </div>
  );
}