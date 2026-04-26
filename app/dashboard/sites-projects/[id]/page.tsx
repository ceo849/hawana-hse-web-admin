// app/dashboard/sites-projects/[id]/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import PageHeader from "@/components/ui/page-header";
import FormSubmitButton from "@/components/ui/form-submit-button";

type SiteProjectStatus = "ACTIVE" | "INACTIVE" | string;

type SiteProject = {
  id: string;
  name: string;
  location: string | null;
  status: SiteProjectStatus;
  createdAt: string;
  updatedAt: string;
};

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }> | { error?: string };
};

function isSiteProject(v: unknown): v is SiteProject {
  if (typeof v !== "object" || v === null) return false;

  const c = v as Record<string, unknown>;

  return (
    typeof c.id === "string" &&
    typeof c.name === "string" &&
    (typeof c.location === "string" || c.location === null) &&
    typeof c.status === "string" &&
    typeof c.createdAt === "string" &&
    typeof c.updatedAt === "string"
  );
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

function getStatusStyle(status?: string | null) {
  const s = String(status ?? "").toUpperCase();

  if (s === "ACTIVE") {
    return {
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #86efac",
    };
  }

  if (s === "INACTIVE") {
    return {
      background: "#f3f4f6",
      color: "#111827",
      border: "1px solid #d1d5db",
    };
  }

  return {
    background: "#f3f4f6",
    color: "#111827",
    border: "1px solid #d1d5db",
  };
}

export default async function SiteProjectOverviewPage({
  params,
  searchParams,
}: PageProps) {
  const token = await requireAccessToken();
  const { id } = await params;

  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : {};

  const error = String(resolvedSearchParams?.error ?? "").trim();

  let r: Response;

  try {
    r = await serverAppFetch(
      `/api/sites-projects/${encodeURIComponent(id)}`,
      token,
      { cache: "no-store" }
    );
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") {
      redirect("/login");
    }

    return (
      <div style={{ padding: 24, maxWidth: 760, margin: "0 auto", fontFamily: "system-ui" }}>
        <PageHeader
          title="Failed to load Site / Project"
          subtitle="Details page diagnostic output"
        />

        <div style={{
          marginBottom: 16,
          padding: 12,
          background: "#fef2f2",
          borderRadius: 10,
          color: "#991b1b",
          border: "1px solid #fecaca",
          whiteSpace: "pre-wrap",
        }}>
          {err instanceof Error ? err.message : "Unknown error"}
        </div>

        <div style={{ marginTop: 16 }}>
          <Link href="/dashboard/sites-projects">Back</Link>
        </div>
      </div>
    );
  }

  if (r.status === 401) redirect("/login");

  if (!r.ok) {
    const text = await r.text().catch(() => "");

    return (
      <div style={{ padding: 24, maxWidth: 760, margin: "0 auto", fontFamily: "system-ui" }}>
        <PageHeader
          title="Failed to load Site / Project"
          subtitle="Details page diagnostic output"
        />

        <div style={{
          marginBottom: 16,
          padding: 12,
          background: "#fef2f2",
          borderRadius: 10,
          color: "#991b1b",
          border: "1px solid #fecaca",
          whiteSpace: "pre-wrap",
        }}>
          Status: {r.status}
          {"\n"}
          {text || "No response body"}
        </div>

        <div style={{ marginTop: 16 }}>
          <Link href="/dashboard/sites-projects">Back</Link>
        </div>
      </div>
    );
  }

  const json = await r.json();

  if (!isSiteProject(json)) {
    return (
      <div style={{ padding: 24, maxWidth: 760, margin: "0 auto", fontFamily: "system-ui" }}>
        <PageHeader
          title="Invalid Site / Project payload"
          subtitle="Details page diagnostic output"
        />

        <pre style={{
          padding: 12,
          borderRadius: 10,
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          overflowX: "auto",
          fontSize: 12,
        }}>
          {JSON.stringify(json, null, 2)}
        </pre>

        <div style={{ marginTop: 16 }}>
          <Link href="/dashboard/sites-projects">Back</Link>
        </div>
      </div>
    );
  }

  const site = json;
  const statusStyle = getStatusStyle(site.status);

  async function updateSiteProject(formData: FormData) {
    "use server";

    const tokenInner = await requireAccessToken();

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      location: String(formData.get("location") ?? "").trim(),
      status: String(formData.get("status") ?? "").trim(),
    };

    const res = await serverAppFetch(
      `/api/sites-projects/${encodeURIComponent(id)}`,
      tokenInner,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (res.status === 401) redirect("/login");
    if (!res.ok) redirect(`/dashboard/sites-projects/${id}`);

    redirect(`/dashboard/sites-projects/${id}`);
  }

  async function deleteSiteProject() {
    "use server";

    const tokenInner = await requireAccessToken();

    const res = await serverAppFetch(
      `/api/sites-projects/${encodeURIComponent(id)}`,
      tokenInner,
      { method: "DELETE" }
    );

    if (res.status === 401) redirect("/login");
    if (!res.ok) redirect(`/dashboard/sites-projects/${id}`);

    redirect("/dashboard/sites-projects");
  }

  return (
    <div style={{ padding: 24, maxWidth: 760, margin: "0 auto", fontFamily: "system-ui" }}>
      <PageHeader title="Site / Project Overview" subtitle="Site insight & control" />

      {error && <div style={{ color: "red" }}>{error}</div>}

      <div style={{ marginBottom: 16 }}>
        <span style={{ padding: "6px 12px", borderRadius: 999, ...statusStyle }}>
          {site.status}
        </span>
      </div>

      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
        <div><b>Name:</b> {site.name}</div>
        <div><b>Location:</b> {site.location ?? "-"}</div>
        <div><b>Created:</b> {formatDate(site.createdAt)}</div>
        <div><b>Updated:</b> {formatDate(site.updatedAt)}</div>
      </div>

      <form action={updateSiteProject}>
        <input name="name" defaultValue={site.name} />
        <input name="location" defaultValue={site.location ?? ""} />
        <select name="status" defaultValue={site.status}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>

        <FormSubmitButton idleText="Update" pendingText="Updating..." />
      </form>

      <form action={deleteSiteProject}>
        <FormSubmitButton idleText="Delete" pendingText="Deleting..." />
      </form>

      <Link href="/dashboard/sites-projects">Back</Link>
    </div>
  );
}