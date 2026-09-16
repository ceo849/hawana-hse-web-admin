// app/dashboard/action-plans/[id]/edit/page.tsx

export const dynamic = "force-dynamic";

import { headers, cookies } from "next/headers"; // ✅ FIX

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
  headers();
  cookies();

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
      { cache: "no-store" }
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
          subtitle="Update the action plan due date"
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
          subtitle="Update the action plan due date"
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


  async function updateDueDate(formData: FormData) {
    "use server";

    const tokenInner = await requireAccessToken();

    const dueDate = normalize(formData.get("dueDate"));

    const res = await serverAppFetch(
      `/api/action-plans/${encodeURIComponent(id)}/due-date`,
      tokenInner,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dueDate: dueDate || null,
        }),
      }
    );

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      const text = await res.text().catch(() => "");

      redirect(
        `/dashboard/action-plans/${id}/edit?error=${encodeURIComponent(
          `Due date update failed (${res.status}) ${text}`
        )}`
      );
    }

    redirect(`/dashboard/action-plans/${id}`);
  }

  return (
    <div style={container}>
      <PageHeader
        title="Edit Action Plan"
        subtitle="Update the action plan due date"
      />

      {error && <ErrorState message={error} />}

      <form action={updateDueDate} style={form}>
        <div style={card}>
          <div>
            <label style={label}>Due Date</label>
            <input
              type="date"
              name="dueDate"
              style={input}
            />
          </div>
        </div>

        <div style={actionsRow}>
          <button type="submit" style={primaryBtn}>
            Update Due Date
          </button>
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

const primaryBtn: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  background: "#111",
  color: "#fff",
};
