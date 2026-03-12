import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { api } from "@/lib/core-api";

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

function isSafetyReport(value: unknown): value is SafetyReport {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    (typeof candidate.title === "string" || candidate.title === null) &&
    (typeof candidate.description === "string" ||
      candidate.description === null) &&
    (typeof candidate.status === "string" || candidate.status === null) &&
    (typeof candidate.siteProjectId === "string" ||
      candidate.siteProjectId === null)
  );
}

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

function formatSiteProjectLabel(site: SiteProject): string {
  if (site.location) return `${site.name} (${site.location})`;
  return site.name;
}

export default async function EditSafetyReportPage({
  params,
  searchParams,
}: PageProps) {
  const token = await requireAccessToken();

  const { id } = await params;
  const sp = searchParams ? await searchParams : undefined;
  const error = String(sp?.error ?? "").trim();

  const reportRes = await fetch(api(`/safety-reports/${id}`), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (reportRes.status === 401) redirect("/login");
  if (!reportRes.ok) redirect("/dashboard/safety-reports");

  const reportJson = (await reportRes.json()) as unknown;
  if (!isSafetyReport(reportJson)) {
    redirect("/dashboard/safety-reports");
  }

  const report = reportJson;

  const sitesRes = await fetch(api("/sites-projects"), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (sitesRes.status === 401) redirect("/login");

  const sitesJson = sitesRes.ok ? ((await sitesRes.json()) as unknown) : [];
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

    const res = await fetch(api(`/safety-reports/${id}`), {
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
        `/dashboard/safety-reports/${id}/edit?error=${encodeURIComponent(
          `Update failed (${res.status}) ${text}`,
        )}`,
      );
    }

    redirect(`/dashboard/safety-reports/${id}`);
  }

  return (
    <div style={{ padding: 40, fontFamily: "system-ui", maxWidth: 900 }}>
      <div style={{ marginBottom: 12, fontSize: 13, color: "#666" }}>
        <a href="/dashboard">Dashboard</a> /
        <a href="/dashboard/safety-reports"> Safety Reports</a> /
        <span> Edit Safety Report</span>
      </div>

      <h1 style={{ fontSize: 40, fontWeight: 900, marginBottom: 20 }}>
        Edit Safety Report
      </h1>

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

      <form action={updateSafetyReport}>
        <input
          name="title"
          defaultValue={report.title ?? ""}
          placeholder="Title"
          style={{
            width: "100%",
            padding: 16,
            marginBottom: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        />

        <select
          name="siteProjectId"
          defaultValue={report.siteProjectId ?? ""}
          style={{
            width: "100%",
            padding: 16,
            marginBottom: 12,
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

        <textarea
          name="description"
          defaultValue={report.description ?? ""}
          rows={8}
          placeholder="Description"
          style={{
            width: "100%",
            padding: 16,
            marginBottom: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
            resize: "vertical",
          }}
        />

        <select
          name="status"
          defaultValue={report.status ?? "OPEN"}
          style={{
            width: "100%",
            padding: 16,
            marginBottom: 16,
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "#fff",
          }}
        >
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="CLOSED">CLOSED</option>
        </select>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="submit"
            style={{
              padding: "16px 20px",
              borderRadius: 10,
              border: "none",
              background: "#111",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Update Safety Report
          </button>

          <a
            href={`/dashboard/safety-reports/${report.id}`}
            style={{
              display: "inline-block",
              padding: "16px 20px",
              borderRadius: 10,
              border: "1px solid #ddd",
              textDecoration: "none",
              color: "#111",
            }}
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}