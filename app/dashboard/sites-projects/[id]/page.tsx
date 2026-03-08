import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { api } from "@/lib/core-api";

type SiteProject = {
  id: string;
  name: string;
  location: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
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

export default async function EditSiteProjectPage({
  params,
  searchParams,
}: PageProps) {
  const token = await requireAccessToken();

  const { id } = await params;
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const error = resolvedSearchParams?.error ?? "";

  const r = await fetch(api(`/v1/sites-projects/${id}`), {
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

  async function updateSiteProject(formData: FormData) {
    "use server";

    const tokenInner = await requireAccessToken();

    const name = String(formData.get("name") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const status = String(formData.get("status") ?? "").trim();

    const payload: Record<string, string> = {};

    if (name) payload.name = name;
    if (location) payload.location = location;
    if (status) payload.status = status;

    const res = await fetch(api(`/v1/sites-projects/${id}`), {
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
          `Update failed (${res.status}) ${text}`,
        )}`,
      );
    }

    redirect("/dashboard/sites-projects");
  }

  async function deleteSiteProject() {
    "use server";

    const tokenInner = await requireAccessToken();

    const res = await fetch(api(`/v1/sites-projects/${id}`), {
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
          `Delete failed (${res.status}) ${text}`,
        )}`,
      );
    }

    redirect("/dashboard/sites-projects");
  }

  return (
    <div style={{ padding: 40, fontFamily: "system-ui", maxWidth: 900 }}>
      <div style={{ marginBottom: 12, fontSize: 13, color: "#666" }}>
        <a href="/dashboard">Dashboard</a> /
        <a href="/dashboard/sites-projects"> Sites / Projects</a> /
        <span> Edit Site / Project</span>
      </div>

      <h1 style={{ fontSize: 40, fontWeight: 900, marginBottom: 20 }}>
        Edit Site / Project
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

      <div
        style={{
          marginBottom: 20,
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
            <b>Created At:</b> {formatDate(site.createdAt)}
          </div>
          <div>
            <b>Updated At:</b> {formatDate(site.updatedAt)}
          </div>
        </div>
      </div>

      <form action={updateSiteProject} style={{ maxWidth: 800 }}>
        <input
          name="name"
          defaultValue={site.name}
          placeholder="Name"
          style={{
            width: "100%",
            padding: 16,
            marginBottom: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        />

        <input
          name="location"
          defaultValue={site.location ?? ""}
          placeholder="Location"
          style={{
            width: "100%",
            padding: 16,
            marginBottom: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        />

        <select
          name="status"
          defaultValue={site.status}
          style={{
            width: "100%",
            padding: 16,
            marginBottom: 16,
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "#fff",
          }}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
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
            Update Site / Project
          </button>

          <a
            href="/dashboard/sites-projects"
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

      <form action={deleteSiteProject} style={{ maxWidth: 800, marginTop: 16 }}>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 10,
            border: "1px solid #d11a2a",
            background: "#fff",
            color: "#d11a2a",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Delete Site / Project
        </button>
      </form>
    </div>
  );
}