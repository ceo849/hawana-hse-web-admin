// app/dashboard/sites-projects/new/page.tsx

export const dynamic = "force-dynamic";

import { headers, cookies } from "next/headers"; // ✅ FIX

import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import PageHeader from "@/components/ui/page-header";
import FormSubmitButton from "@/components/ui/form-submit-button";
import ErrorState from "@/components/ui/error-state";

type PageProps = {
  searchParams?: { err?: string } | Promise<{ err?: string }>;
};

function isNextRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export default async function NewSiteProjectPage({ searchParams }: PageProps) {
  // ✅ ROOT FIX
  headers();
  cookies();

  await requireAccessToken();

  const sp = await Promise.resolve(searchParams ?? {});
  const err = String(sp?.err ?? "").trim();

  async function createSiteProject(formData: FormData) {
    "use server";

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
      const tokenInner = await requireAccessToken();

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
      if (isNextRedirectError(error)) {
        throw error;
      }

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

    redirect("/dashboard/sites-projects?success=created");
  }

  return (
    <div style={container}>
      <PageHeader
        title="Create Site / Project"
        subtitle="Add a new operational site or project"
      />

      {err && <ErrorState message={err} />}

      <form action={createSiteProject} style={form}>
        <div style={card}>
          <div>
            <label style={label}>Name</label>
            <input
              name="name"
              placeholder="Enter site or project name"
              required
              style={input}
            />
          </div>

          <div>
            <label style={label}>Location</label>
            <input
              name="location"
              placeholder="Enter location"
              style={input}
            />
          </div>

          <div>
            <label style={label}>Status</label>
            <select name="status" defaultValue="ACTIVE" style={input}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </div>

        <div style={actionsRow}>
          <FormSubmitButton
            idleText="Create Site / Project"
            pendingText="Creating..."
          />

          <Link href="/dashboard/sites-projects" style={cancelLink}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

/* ================= STANDARDIZED STYLES ================= */

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

const cancelLink: React.CSSProperties = {
  textDecoration: "none",
  color: "#111827",
  fontWeight: 600,
};