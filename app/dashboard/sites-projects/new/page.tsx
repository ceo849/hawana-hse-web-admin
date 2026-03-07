import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { api } from "@/lib/core-api";

type PageProps = {
  searchParams?:
    | { err?: string }
    | Promise<{ err?: string }>;
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
        `/dashboard/sites-projects/new?err=${encodeURIComponent("Name is required")}`
      );
    }

    const payload: Record<string, string> = {
      name,
    };

    if (location) {
      payload.location = location;
    }

    if (status) {
      payload.status = status;
    }

    const res = await fetch(api("/v1/sites-projects"), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (res.status === 401) {
      redirect("/login");
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      redirect(
        `/dashboard/sites-projects/new?err=${encodeURIComponent(
          `Failed to create Site / Project (${res.status}) ${text}`
        )}`
      );
    }

    redirect("/dashboard/sites-projects");
  }

  return (
    <div style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 12 }}>
        Create Site / Project
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

      <form action={createSiteProject} style={{ maxWidth: 800 }}>
        <input
          name="name"
          placeholder="Name"
          required
          style={{
            width: "100%",
            padding: "16px",
            marginBottom: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        />

        <input
          name="location"
          placeholder="Location"
          style={{
            width: "100%",
            padding: "16px",
            marginBottom: 12,
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        />

        <select
          name="status"
          defaultValue="ACTIVE"
          style={{
            width: "100%",
            padding: "16px",
            marginBottom: 16,
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "#fff",
          }}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 10,
            border: "none",
            background: "#111",
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Create Site / Project
        </button>
      </form>
    </div>
  );
}