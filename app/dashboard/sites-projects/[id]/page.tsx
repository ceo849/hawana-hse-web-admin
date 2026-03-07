import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { api } from "@/lib/core-api";

type SiteProject = {
  id: string;
  name: string;
  location: string | null;
  status: string;
};

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ err?: string }>;
};

export default async function EditSiteProjectPage({
  params,
  searchParams,
}: PageProps) {
  const token = await requireAccessToken();

  const { id } = await params;
  const sp = searchParams ? await searchParams : undefined;
  const err = String(sp?.err ?? "").trim();

  const r = await fetch(api(`/v1/sites-projects/${id}`), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (r.status === 401) redirect("/login");
  if (!r.ok) redirect("/dashboard/sites-projects");

  const site: SiteProject = await r.json();

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
        `/dashboard/sites-projects/${id}?err=${encodeURIComponent(
          `Update failed (${res.status}) ${text}`
        )}`
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
        `/dashboard/sites-projects/${id}?err=${encodeURIComponent(
          `Delete failed (${res.status}) ${text}`
        )}`
      );
    }

    redirect("/dashboard/sites-projects");
  }

  return (
    <div style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 40, fontWeight: 900, marginBottom: 16 }}>
        Edit Site / Project
      </h1>

      {err ? (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 12,
            background: "#fff5f5",
            border: "1px solid #ffd6d6",
            color: "#b00020",
            fontWeight: 700,
          }}
        >
          {err}
        </div>
      ) : null}

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
          }}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>

        <div style={{ display: "grid", gap: 12 }}>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: 16,
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