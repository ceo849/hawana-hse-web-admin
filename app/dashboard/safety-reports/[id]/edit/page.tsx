// app/dashboard/safety-reports/[id]/edit/page.tsx

export const dynamic = "force-dynamic";

import { headers, cookies } from "next/headers"; // ✅ FIX

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
  // ✅ ROOT FIX
  headers();
  cookies();

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
      <div style={container}>
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
      <div style={container}>
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
    <div style={container}>
      <PageHeader
        title="Edit Safety Report"
        subtitle="Update report details"
      />

      {error && <ErrorState message={error} />}

      <form action={updateSafetyReport} style={form}>
        <div style={card}>
          <div>
            <label style={label}>Title</label>
            <input
              name="title"
              defaultValue={report.title ?? ""}
              placeholder="Update report title"
              required
              style={input}
            />
          </div>

          <div>
            <label style={label}>Site / Project</label>
            <select
              name="siteProjectId"
              defaultValue={report.siteProjectId ?? ""}
              style={input}
            >
              <option value="">No Site / Project</option>
              {siteProjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {formatSiteProjectLabel(s)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={label}>Description</label>
            <textarea
              name="description"
              defaultValue={report.description ?? ""}
              rows={4}
              placeholder="Update description"
              style={input}
            />
          </div>

          <div>
            <label style={label}>Status</label>
            <select
              name="status"
              defaultValue={report.status ?? "OPEN"}
              style={input}
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        </div>

        <div style={actionsRow}>
          <button type="submit" style={primaryBtn}>
            Update Safety Report
          </button>

          <Link href={`/dashboard/safety-reports/${id}`} style={secondaryBtn}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

/* ================= STANDARD ================= */

const container: React.CSSProperties = {
  padding: 24,
  fontFamily: "system-ui",
  maxWidth: 760,
  margin: "0 auto",
};

const form: React.CSSProperties = {
  display: "grid",
  gap: 16,
};

const card: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  background: "#fff",
  padding: 16,
  display: "grid",
  gap: 14,
};

const label: React.CSSProperties = {
  marginBottom: 6,
  fontWeight: 700,
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
};

const actionsRow: React.CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "center",
};

const primaryBtn: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  background: "#111",
  color: "#fff",
};

const secondaryBtn: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "1px solid #ddd",
  textDecoration: "none",
  color: "#111",
};