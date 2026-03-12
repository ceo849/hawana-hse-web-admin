import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { api } from "@/lib/core-api";
import PageHeader from "@/components/ui/page-header";

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

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    (typeof candidate.location === "string" || candidate.location === null) &&
    typeof candidate.status === "string"
  );
}

function parseSiteProjects(value: unknown): SiteProject[] {
  if (Array.isArray(value)) {
    return value.filter(isSiteProject);
  }

  if (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { data?: unknown }).data)
  ) {
    return ((value as { data: unknown[] }).data).filter(isSiteProject);
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

  const sitesRes = await fetch(api("/sites-projects"), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (sitesRes.status === 401) redirect("/login");

  const sitesJson = sitesRes.ok ? ((await sitesRes.json()) as unknown) : [];
  const siteProjects = parseSiteProjects(sitesJson);

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

    if (description) {
      payload.description = description;
    }

    if (siteProjectId) {
      payload.siteProjectId = siteProjectId;
    }

    const res = await fetch(api("/safety-reports"), {
      method: "POST",
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
            <label
              htmlFor="title"
              style={{ display: "block", marginBottom: 6, fontWeight: 700 }}
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              placeholder="Enter safety report title"
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
            <label
              htmlFor="siteProjectId"
              style={{ display: "block", marginBottom: 6, fontWeight: 700 }}
            >
              Site / Project
            </label>
            <select
              id="siteProjectId"
              name="siteProjectId"
              defaultValue=""
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "#fff",
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

          <div>
            <label
              htmlFor="description"
              style={{ display: "block", marginBottom: 6, fontWeight: 700 }}
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={8}
              placeholder="Enter report description"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
                resize: "vertical",
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
            Create Safety Report
          </button>

          <a
            href="/dashboard/safety-reports"
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
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}