import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { api } from "@/lib/core-api";
import DashboardPageHeader from "@/components/ui/page-header"; // ✅ FIX
// تم تغيير الاسم فقط
// يمنع أي conflict داخلي

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

  const r = await fetch(api(`/action-plans/${id}`), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (r.status === 401) redirect("/login");
  if (!r.ok) redirect(`/dashboard/action-plans/${id}`);

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
          "Title is required",
        )}`,
      );
    }

    const res = await fetch(api(`/action-plans/${id}`), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenInner}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description: description || null,
      }),
      cache: "no-store",
    });

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      redirect(
        `/dashboard/action-plans/${id}/edit?error=${encodeURIComponent(
          `Update failed (${res.status}) ${text}`,
        )}`,
      );
    }

    redirect(`/dashboard/action-plans/${id}`);
  }

  return (
    <div
      style={{
        padding: 16,
        fontFamily: "system-ui",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      {/* ✅ FIX هنا */}
      <DashboardPageHeader
        title="Edit Action Plan"
        subtitle="Update the action plan title and description"
      />

      {error && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 10,
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      <form action={updateActionPlan} style={{ display: "grid", gap: 16 }}>
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            background: "#fff",
            padding: 16,
            display: "grid",
            gap: 14,
          }}
        >
          <div>
            <label style={{ marginBottom: 6, fontWeight: 600 }}>
              Title
            </label>
            <input
              name="title"
              defaultValue={ap.title}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
              }}
            />
          </div>

          <div>
            <label style={{ marginBottom: 6, fontWeight: 600 }}>
              Description
            </label>
            <textarea
              name="description"
              defaultValue={ap.description ?? ""}
              rows={6}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="submit"
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #111",
              background: "#111",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Update
          </button>

          <Link
            href={`/dashboard/action-plans/${ap.id}`}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #ddd",
              textDecoration: "none",
              color: "#111",
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}