import { redirect } from "next/navigation";
import Link from "next/link";
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

    await requireAccessToken();

    const name = String(formData.get("name") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const status = String(formData.get("status") ?? "").trim();

    if (!name) {
      redirect(
        `/dashboard/sites-projects/new?err=${encodeURIComponent(
          "Name is required"
        )}`
      );
    }

    const payload: Record<string, string> = { name };

    if (location) payload.location = location;
    if (status) payload.status = status;

    try {
      const res = await serverAppFetch("/api/sites-projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      if (res.status === 401) {
        redirect("/login");
      }

      if (!res.ok) {
        const contentType = res.headers.get("content-type") ?? "";
        const isJson = contentType.includes("application/json");

        let message = `Failed to create Site / Project (${res.status})`;

        if (isJson) {
          const data = await res.json().catch(() => ({}));
          if (Array.isArray((data as any)?.message)) {
            message = (data as any).message.join(" | ");
          } else if (typeof (data as any)?.message === "string") {
            message = (data as any).message;
          } else if (typeof (data as any)?.error === "string") {
            message = (data as any).error;
          }
        } else {
          const text = await res.text().catch(() => "");
          if (text.trim()) {
            message = `${message} ${text}`;
          }
        }

        redirect(
          `/dashboard/sites-projects/new?err=${encodeURIComponent(message)}`
        );
      }
    } catch (error: any) {
      if (error?.message === "SESSION_EXPIRED") {
        redirect("/login");
      }

      const message =
        error instanceof Error
          ? error.message
          : "Failed to create Site / Project";

      redirect(
        `/dashboard/sites-projects/new?err=${encodeURIComponent(message)}`
      );
    }

    redirect("/dashboard/sites-projects");
  }

  return (
    <div
      style={{
        padding: 24,
        fontFamily: "system-ui",
        maxWidth: 760,
        margin: "0 auto",
      }}
    >
      <PageHeader
        title="Create Site / Project"
        subtitle="Add a new operational site or project"
      />

      {err ? (
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
      ) : null}

      <form action={createSiteProject} style={{ display: "grid", gap: 16 }}>
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            background: "#fff",
            padding: 16,
            display: "grid",
            gap: 16,
          }}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <label
              htmlFor="name"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#111827",
              }}
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="Enter site or project name"
              required
              style={{
                height: 42,
                padding: "0 12px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                background: "#fff",
                fontSize: 14,
              }}
            />
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              Required. Use a clear operational name.
            </div>
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label
              htmlFor="location"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#111827",
              }}
            >
              Location
            </label>
            <input
              id="location"
              name="location"
              placeholder="Enter location"
              style={{
                height: 42,
                padding: "0 12px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                background: "#fff",
                fontSize: 14,
              }}
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label
              htmlFor="status"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#111827",
              }}
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue="ACTIVE"
              style={{
                height: 42,
                padding: "0 12px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                background: "#fff",
                fontSize: 14,
              }}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            type="submit"
            style={{
              height: 42,
              padding: "0 16px",
              borderRadius: 10,
              border: "none",
              background: "#111827",
              color: "#ffffff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Create Site / Project
          </button>

          <Link
            href="/dashboard/sites-projects"
            style={{
              height: 42,
              padding: "0 16px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              color: "#111827",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              fontWeight: 500,
              background: "#fff",
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}