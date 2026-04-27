// app/dashboard/safety-reports/new/page.tsx

export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import PageHeader from "@/components/ui/page-header";
import SubmitButton from "@/components/ui/submit-button";
import ErrorState from "@/components/ui/error-state";

type PageProps = {
  searchParams?: Promise<{ error?: string }> | { error?: string };
};

type SiteProject = {
  id: string;
  name: string;
  location: string | null;
  status: string;
};

function isSiteProject(value: unknown): value is SiteProject {
  if (typeof value !== "object" || value === null) return false;

  const c = value as Record<string, unknown>;

  return (
    typeof c.id === "string" &&
    typeof c.name === "string" &&
    (typeof c.location === "string" || c.location === null) &&
    typeof c.status === "string"
  );
}

function parseSiteProjects(value: unknown): SiteProject[] {
  if (Array.isArray(value)) return value.filter(isSiteProject);

  if (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    Array.isArray((value as any).data)
  ) {
    return (value as any).data.filter(isSiteProject);
  }

  return [];
}

function formatSiteProjectLabel(site: SiteProject): string {
  if (site.location) return `${site.name} (${site.location})`;
  return site.name;
}

export default async function NewSafetyReportPage({
  searchParams,
}: PageProps) {
  const token = await requireAccessToken();

  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : {};

  const error = String(resolvedSearchParams?.error ?? "").trim();

  let siteProjects: SiteProject[] = [];
  let fetchError: string | null = null;

  try {
    const res = await serverAppFetch("/api/sites-projects", token, {
      cache: "no-store", // ✅ consistency
    });

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();
    siteProjects = parseSiteProjects(json);
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") {
      redirect("/login");
    }

    console.error("SitesProjects Error:", err);
    fetchError = "Failed to load sites/projects";
  }

  async function createSafetyReport(formData: FormData) {
    "use server";

    const tokenInner = await requireAccessToken();

    const title = String(formData.get("title") ?? "").trim();

    const rawDescription = formData.get("description");
    const description =
      typeof rawDescription === "string" ? rawDescription.trim() : "";

    const siteProjectId = String(formData.get("siteProjectId") ?? "").trim();

    if (!title) {
      redirect(
        `/dashboard/safety-reports/new?error=${encodeURIComponent(
          "Title is required"
        )}`
      );
    }

    const payload: Record<string, string> = { title };

    if (description) payload.description = description;
    if (siteProjectId) payload.siteProjectId = siteProjectId;

    const res = await serverAppFetch("/api/safety-reports", tokenInner, {
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
        `/dashboard/safety-reports/new?error=${encodeURIComponent(
          `Create safety report failed (${res.status}) ${text}`
        )}`
      );
    }

    redirect("/dashboard/safety-reports");
  }

  return (
    <div style={container}>
      <PageHeader
        title="Create Safety Report"
        subtitle="Register a new safety report and optionally link it to a site or project"
      />

      {error && <ErrorState message={error} />}
      {fetchError && <ErrorState message={fetchError} />}

      <form action={createSafetyReport} style={form}>
        <div style={card}>
          <div>
            <label style={label}>Title</label>
            <input
              name="title"
              required
              placeholder="Enter safety report title"
              style={input}
            />
          </div>

          <div>
            <label style={label}>Site / Project</label>
            <select name="siteProjectId" defaultValue="" style={input}>
              <option value="">No Site / Project</option>

              {siteProjects.map((site) => (
                <option key={site.id} value={site.id}>
                  {formatSiteProjectLabel(site)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={label}>Description</label>
            <textarea
              name="description"
              rows={4} // ✅ reduced
              placeholder="Describe the safety report"
              style={input}
            />
          </div>
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}

/* styles (standardized) */

const container: React.CSSProperties = {
  padding: 24,
  fontFamily: "system-ui",
  maxWidth: 760,
};

const form: React.CSSProperties = {
  display: "grid",
  gap: 16,
};

const card: React.CSSProperties = {
  border: "1px solid #eee",
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