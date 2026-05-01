// app/dashboard/sites-projects/[id]/edit/page.tsx

export const dynamic = "force-dynamic";

import { headers, cookies } from "next/headers"; // ✅ SSR FIX

import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import PageHeader from "@/components/ui/page-header";
import ErrorState from "@/components/ui/error-state";

type PageProps = {
  params: { id: string } | Promise<{ id: string }>;
  searchParams?: { error?: string } | Promise<{ error?: string }>;
};

type SiteProject = {
  id: string;
  name: string;
  location: string | null;
  status: string;
};

function normalize(v: unknown) {
  return String(v ?? "").trim();
}

export default async function EditSiteProjectPage({
  params,
  searchParams,
}: PageProps) {
  // ✅ ROOT FIX
  headers();
  cookies();

  const resolvedParams = await Promise.resolve(params);
  const resolvedSearch = await Promise.resolve(searchParams ?? {});

  const id = normalize(resolvedParams?.id);
  if (!id) redirect("/dashboard/sites-projects");

  const token = await requireAccessToken();

  let r: Response;

  try {
    r = await serverAppFetch(
      `/api/sites-projects/${encodeURIComponent(id)}`,
      token,
      { cache: "no-store" }
    );
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") redirect("/login");

    console.error("Edit SiteProject Fetch Error:", err);

    return (
      <div style={container}>
        <PageHeader
          title="Edit Site / Project"
          subtitle="Update site or project details"
        />
        <ErrorState message="Failed to load site/project (network/server error)" />
      </div>
    );
  }

  if (r.status === 401) redirect("/login");

  if (!r.ok) {
    return (
      <div style={container}>
        <PageHeader
          title="Edit Site / Project"
          subtitle="Update site or project details"
        />
        <ErrorState message="Failed to load site/project" />
      </div>
    );
  }

  const site = await r.json();

  const error = normalize(resolvedSearch?.error);

  async function updateSiteProject(formData: FormData) {
    "use server";

    const tokenInner = await requireAccessToken();

    const name = normalize(formData.get("name"));
    const location = normalize(formData.get("location"));
    const status = normalize(formData.get("status"));

    if (!name) {
      redirect(
        `/dashboard/sites-projects/${id}/edit?error=${encodeURIComponent(
          "Name is required"
        )}`
      );
    }

    const payload: Record<string, string | null> = {
      name,
      location: location || null,
      status,
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

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      redirect(
        `/dashboard/sites-projects/${id}/edit?error=${encodeURIComponent(
          `Update failed (${res.status}) ${text}`
        )}`
      );
    }

    redirect(`/dashboard/sites-projects/${id}`);
  }

  return (
    <div style={container}>
      <PageHeader
        title="Edit Site / Project"
        subtitle="Update site or project details"
      />

      {error && <ErrorState message={error} />}

      <form action={updateSiteProject} style={form}>
        <div style={card}>
          <div>
            <label style={label}>Name</label>
            <input
              name="name"
              defaultValue={site.name}
              required
              style={input}
            />
          </div>

          <div>
            <label style={label}>Location</label>
            <input
              name="location"
              defaultValue={site.location ?? ""}
              style={input}
            />
          </div>

          <div>
            <label style={label}>Status</label>
            <select
              name="status"
              defaultValue={site.status ?? "ACTIVE"}
              style={input}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </div>

        <div style={actionsRow}>
          <button type="submit" style={primaryBtn}>
            Update Site / Project
          </button>

          <Link
            href={`/dashboard/sites-projects/${id}`}
            style={cancelLink}
          >
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

const cancelLink: React.CSSProperties = {
  textDecoration: "none",
  color: "#111827",
  fontWeight: 600,
};