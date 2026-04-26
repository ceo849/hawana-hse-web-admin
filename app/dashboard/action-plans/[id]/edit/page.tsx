// app/dashboard/action-plans/[id]/edit/page.tsx

export const dynamic = "force-dynamic";

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

type ActionPlan = {
  id: string;
  title: string;
  description?: string | null;
  status?: string | null;
};

function normalize(v: unknown) {
  return String(v ?? "").trim();
}

export default async function EditActionPlanPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearch = await Promise.resolve(searchParams ?? {});

  const id = normalize(resolvedParams?.id);
  if (!id) redirect("/dashboard/action-plans");

  const token = await requireAccessToken();

  let r: Response;

  try {
    r = await serverAppFetch(
      `/api/action-plans/${encodeURIComponent(id)}`,
      token,
      { cache: "no-store" } // ✅ ADD
    );
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") {
      redirect("/login");
    }

    console.error("Edit Action Plan Fetch Error:", err);

    return (
      <div style={container}>
        <PageHeader
          title="Edit Action Plan"
          subtitle="Update the action plan title and description"
        />

        <ErrorState message="Failed to load action plan (network/server error)" />
      </div>
    );
  }

  if (r.status === 401) redirect("/login");

  if (!r.ok) {
    return (
      <div style={container}>
        <PageHeader
          title="Edit Action Plan"
          subtitle="Update the action plan title and description"
        />

        <ErrorState message="Failed to load action plan" />
      </div>
    );
  }

  const ap = (await r.json()) as ActionPlan;

  const error = normalize(resolvedSearch?.error);
  const status = normalize(ap.status).toUpperCase();

  if (status === "VERIFIED") {
    redirect(`/dashboard/action-plans/${id}`);
  }

  async function updateActionPlan(formData: FormData) {
    "use server";

    const tokenInner = await requireAccessToken();

    const title = normalize(formData.get("title"));
    const description = normalize(formData.get("description"));

    if (!title) {
      redirect(
        `/dashboard/action-plans/${id}/edit?error=${encodeURIComponent(
          "Title is required"
        )}`
      );
    }

    const res = await serverAppFetch(
      `/api/action-plans/${encodeURIComponent(id)}`,
      tokenInner,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description: description || null,
        }),
      }
    );

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      redirect(
        `/dashboard/action-plans/${id}/edit?error=${encodeURIComponent(
          `Update failed (${res.status}) ${text}`
        )}`
      );
    }

    redirect(`/dashboard/action-plans/${id}`);
  }

  return (
    <div style={container}>
      <PageHeader
        title="Edit Action Plan"
        subtitle="Update the action plan title and description"
      />

      {error && <ErrorState message={error} />}

      <form action={updateActionPlan} style={form}>
        <div style={card}>
          <div>
            <label style={label}>Title</label>
            <input
              name="title"
              defaultValue={ap.title}
              required
              style={input}
            />
          </div>

          <div>
            <label style={label}>Description</label>
            <textarea
              name="description"
              defaultValue={ap.description ?? ""}
              rows={6}
              style={textarea}
            />
          </div>
        </div>

        <div style={actions}>
          <button type="submit" style={primaryBtn}>
            Update
          </button>

          <Link href={`/dashboard/action-plans/${ap.id}`} style={secondaryBtn}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

/* ================== STYLES ================== */

const container: React.CSSProperties = {
  padding: 16,
  fontFamily: "system-ui",
  maxWidth: 720,
  margin: "0 auto",
};

const form: React.CSSProperties = {
  display: "grid",
  gap: 16,
};

const card: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  background: "#fff",
  padding: 16,
  display: "grid",
  gap: 14,
};

const label: React.CSSProperties = {
  marginBottom: 6,
  fontWeight: 600,
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
};

const textarea: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
};

const actions: React.CSSProperties = {
  display: "flex",
  gap: 10,
};

const primaryBtn: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryBtn: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "1px solid #ddd",
  textDecoration: "none",
  color: "#111",
};