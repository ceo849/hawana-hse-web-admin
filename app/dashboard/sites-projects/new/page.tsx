import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import PageHeader from "@/components/ui/page-header";

type PageProps = {
  searchParams?: { err?: string } | Promise<{ err?: string }>;
};

export default async function NewSiteProjectPage({ searchParams }: PageProps) {
  await requireAccessToken();

  const sp = await Promise.resolve(searchParams ?? {});
  const err = String(sp?.err ?? "").trim();

  async function createSiteProject(formData: FormData) {
    "use server";

    const token = await requireAccessToken();

    const name = String(formData.get("name") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const status = String(formData.get("status") ?? "").trim();

    if (!name) {
      redirect(
        `/dashboard/sites-projects/new?err=${encodeURIComponent(
          "Name is required",
        )}`,
      );
    }

    const payload: Record<string, string> = { name };

    if (location) payload.location = location;
    if (status) payload.status = status;

    // ✅ FIX
    const res = await serverAppFetch("/sites-projects", token, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 401) {
      redirect("/login");
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      redirect(
        `/dashboard/sites-projects/new?err=${encodeURIComponent(
          `Failed to create Site / Project (${res.status}) ${text}`,
        )}`,
      );
    }

    redirect("/dashboard/sites-projects");
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 760 }}>
      <PageHeader
        title="Create Site / Project"
        subtitle="Add a new operational site or project"
      />

      {err && (
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
          {err}
        </div>
      )}

      <form action={createSiteProject} style={{ display: "grid", gap: 16 }}>
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
          <input name="name" placeholder="Name" required />
          <input name="location" placeholder="Location" />

          <select name="status" defaultValue="ACTIVE">
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit">Create</button>

          <a href="/dashboard/sites-projects">
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}