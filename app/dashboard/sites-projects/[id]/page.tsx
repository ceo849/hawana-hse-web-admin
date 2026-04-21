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

  const r = await serverAppFetch(
    token,
    `/api/sites-projects/${encodeURIComponent(id)}`
  );

  if (r.status === 401) redirect("/login");
  if (!r.ok) redirect("/dashboard/sites-projects");

  const json = await r.json();

  if (!isSiteProject(json)) {
    redirect("/dashboard/sites-projects");
  }

  const site = json;
  const statusStyle = getStatusStyle(site.status);

  async function updateSiteProject(formData: FormData) {
    "use server";

    const tokenInner = await requireAccessToken();

    const name = String(formData.get("name") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const status = String(formData.get("status") ?? "").trim();

    const payload: Record<string, string> = {};

    if (name) payload.name = name;
    payload.location = location;
    if (status) payload.status = status;

    const res = await serverAppFetch(
      tokenInner,
      `/api/sites-projects/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      redirect(
        `/dashboard/sites-projects/${id}?error=${encodeURIComponent(
          `Update failed (${res.status}) ${text}`
        )}`
      );
    }

    redirect(`/dashboard/sites-projects/${id}`);
  }

  async function deleteSiteProject() {
    "use server";

    const tokenInner = await requireAccessToken();

    const res = await serverAppFetch(
      tokenInner,
      `/api/sites-projects/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    );

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      redirect(
        `/dashboard/sites-projects/${id}?error=${encodeURIComponent(
          `Delete failed (${res.status}) ${text}`
        )}`
      );
    }

    redirect("/dashboard/sites-projects");
  }

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 760,
        margin: "0 auto",
        fontFamily: "system-ui",
      }}
    >
      <PageHeader
        title="Site / Project Overview"
        subtitle="Site insight & control"
      />

      {error && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            background: "#fef2f2",
            borderRadius: 10,
            color: "#991b1b",
            border: "1px solid #fecaca",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <span
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            ...statusStyle,
          }}
        >
          {site.status}
        </span>
      </div>

      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
          background: "#fff",
          display: "grid",
          gap: 8,
        }}
      >
        <div>
          <b>Name:</b> {site.name}
        </div>
        <div>
          <b>Location:</b> {site.location ?? "-"}
        </div>
        <div>
          <b>Created:</b> {formatDate(site.createdAt)}
        </div>
        <div>
          <b>Updated:</b> {formatDate(site.updatedAt)}
        </div>
      </div>

      <form action={updateSiteProject} style={{ display: "grid", gap: 12 }}>
        <input name="name" defaultValue={site.name} />
        <input name="location" defaultValue={site.location ?? ""} />

        <select name="status" defaultValue={site.status}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>

        <FormSubmitButton
          idleText="Update Site / Project"
          pendingText="Updating..."
        />
      </form>

      <form action={deleteSiteProject} style={{ marginTop: 12 }}>
        <FormSubmitButton
          idleText="Delete Site / Project"
          pendingText="Deleting..."
        />
      </form>

      <div style={{ marginTop: 16 }}>
        <Link href="/dashboard/sites-projects">Back to Sites / Projects</Link>
      </div>
    </div>
  );
}