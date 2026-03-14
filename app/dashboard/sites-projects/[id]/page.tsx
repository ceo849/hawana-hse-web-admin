import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { api } from "@/lib/core-api";
import PageHeader from "@/components/ui/page-header";

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

function isSiteProject(value: unknown): value is SiteProject {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    (typeof candidate.location === "string" || candidate.location === null) &&
    typeof candidate.status === "string" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string"
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
  const normalized = String(status ?? "").toUpperCase();

  if (normalized === "ACTIVE") {
    return {
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #86efac",
    };
  }

  if (normalized === "INACTIVE") {
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

  const r = await fetch(api(`/sites-projects/${id}`), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (r.status === 401) redirect("/login");
  if (!r.ok) redirect("/dashboard/sites-projects");

  const json = (await r.json()) as unknown;

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

    const res = await fetch(api(`/sites-projects/${id}`), {
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
        `/dashboard/sites-projects/${id}?error=${encodeURIComponent(
          `Update site / project failed (${res.status}) ${text}`,
        )}`,
      );
    }

    redirect(`/dashboard/sites-projects/${id}`);
  }

  async function deleteSiteProject() {
    "use server";

    const tokenInner = await requireAccessToken();

    const res = await fetch(api(`/sites-projects/${id}`), {
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
        `/dashboard/sites-projects/${id}?error=${encodeURIComponent(
          `Delete site / project failed (${res.status}) ${text}`,
        )}`,
      );
    }

    redirect("/dashboard/sites-projects");
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 960 }}>
      <PageHeader
        title="Site / Project Overview"
        subtitle="Site insight first, followed by site control actions"
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
        Site / Project Insight
      </div>

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            display: "inline-block",
            padding: "6px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 800,
            ...statusStyle,
          }}
        >
          {site.status}
        </span>
      </div>

      <div
        style={{
          marginBottom: 24,
          padding: 16,
          border: "1px solid #eee",
          borderRadius: 12,
          background: "#fff",
        }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <div>
            <b>Site / Project ID:</b> {site.id}
          </div>
          <div>
            <b>Name:</b> {site.name}
          </div>
          <div>
            <b>Location:</b> {site.location ?? "-"}
          </div>
          <div>
            <b>Status:</b> {site.status}
          </div>
          <div>
            <b>Created At:</b> {formatDate(site.createdAt)}
          </div>
          <div>
            <b>Updated At:</b> {formatDate(site.updatedAt)}
          </div>
        </div>
      </div>

      <div
        style={{
          marginBottom: 8,
          fontSize: 13,
          fontWeight: 700,
          color: "#444",
        }}
      >
        Site / Project Control Actions
      </div>

      <form action={updateSiteProject} style={{ display: "grid", gap: 16 }}>
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
              Name
            </label>
            <input
              id="name"
              name="name"
              defaultValue={site.name}
              placeholder="Enter site or project name"
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
              htmlFor="location"
              style={{ display: "block", marginBottom: 6, fontWeight: 700 }}
            >
              Location
            </label>
            <input
              id="location"
              name="location"
              defaultValue={site.location ?? ""}
              placeholder="Enter location"
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
              htmlFor="status"
              style={{ display: "block", marginBottom: 6, fontWeight: 700 }}
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={site.status}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "#fff",
              }}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
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
            Update Site / Project
          </button>

          <Link
            href="/dashboard/sites-projects"
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
            Back to Sites / Projects
          </Link>
        </div>
      </form>

      <form action={deleteSiteProject} style={{ marginTop: 16 }}>
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
          Deactivate Site / Project
        </button>
      </form>
    </div>
  );
}