// app/dashboard/sites-projects/new/page.tsx

import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import PageHeader from "@/components/ui/page-header";
import FormSubmitButton from "@/components/ui/form-submit-button";

type PageProps = {
  searchParams?: { err?: string } | Promise<{ err?: string }>;
};

export default async function NewSiteProjectPage({ searchParams }: PageProps) {
  await requireAccessToken();

  const sp = await Promise.resolve(searchParams ?? {});
  const err = String(sp?.err ?? "").trim();

  async function createSiteProject(formData: FormData) {
    "use server";

    const tokenInner = await requireAccessToken();

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
      const res = await serverAppFetch(
        "/api/sites-projects",
        tokenInner,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          cache: "no-store",
        }
      );

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
            <label>Name</label>
            <input
              name="name"
              placeholder="Enter site or project name"
              required
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label>Location</label>
            <input name="location" placeholder="Enter location" />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label>Status</label>
            <select name="status" defaultValue="ACTIVE">
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <FormSubmitButton
            idleText="Create Site / Project"
            pendingText="Creating..."
          />

          <Link href="/dashboard/sites-projects">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}