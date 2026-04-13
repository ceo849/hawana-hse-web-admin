import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import PageHeader from "@/components/ui/page-header";

export const dynamic = "force-dynamic";

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

  try {
    const res = await serverAppFetch("/sites-projects", token);

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();
    siteProjects = parseSiteProjects(json);
  } catch (err) {
    console.error("SitesProjects Error:", err);
  }

  async function createSafetyReport(formData: FormData) {
    "use server";

    const tokenInner = await requireAccessToken();

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const siteProjectId = String(formData.get("siteProjectId") ?? "").trim();

    if (!title) {
      redirect(
        `/dashboard/safety-reports/new?error=${encodeURIComponent(
          "Title is required",
        )}`,
      );
    }

    const payload: Record<string, string> = { title };

    if (description) payload.description = description;
    if (siteProjectId) payload.siteProjectId = siteProjectId;

    const res = await serverAppFetch("/safety-reports", tokenInner, {
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
          `Create safety report failed (${res.status}) ${text}`,
        )}`,
      );
    }

    redirect("/dashboard/safety-reports");
  }

  return (
    <div style={{ fontFamily: "system-ui", padding: 24, maxWidth: 760 }}>
      <PageHeader
        title="Create Safety Report"
        subtitle="Register a new safety report and optionally link it to a site or project"
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

      <form action={createSafetyReport} style={{ display: "grid", gap: 16 }}>
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
            <label style={{ display: "block", marginBottom: 6, fontWeight: 700 }}>
              Title
            </label>
            <input
              name="title"
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6, fontWeight: 700 }}>
              Site / Project
            </label>
            <select
              name="siteProjectId"
              defaultValue=""
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
              }}
            >
              <option value="">No Site / Project</option>

              {siteProjects.map((site) => (
                <option key={site.id} value={site.id}>
                  {formatSiteProjectLabel(site)}
                </option>
              ))}
            </select>
          </div>

          <textarea
            name="description"
            rows={6}
            placeholder="Description"
            style={{
              padding: 10,
              borderRadius: 10,
              border: "1px solid #ddd",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: 12,
            background: "#111",
            color: "#fff",
            borderRadius: 10,
          }}
        >
          Create
        </button>
      </form>
    </div>
  );
}