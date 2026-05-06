// app/dashboard/users/[id]/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers"; // ✅ ADD

import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import PageHeader from "@/components/ui/page-header";
import ErrorState from "@/components/ui/error-state";

type UserRole = "OWNER" | "ADMIN" | "MANAGER" | "WORKER" | "VIEWER";

type User = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }> | { error?: string };
};

function isUser(v: unknown): v is User {
  if (typeof v !== "object" || v === null) return false;
  const c = v as Record<string, unknown>;

  return (
    typeof c.id === "string" &&
    typeof c.email === "string" &&
    typeof c.fullName === "string" &&
    typeof c.role === "string" &&
    typeof c.createdAt === "string" &&
    typeof c.updatedAt === "string"
  );
}

function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function getRoleBadgeStyle(role: string) {
  const r = role.toUpperCase();

  if (r === "OWNER") return { background: "#ede9fe", color: "#5b21b6", border: "1px solid #c4b5fd" };
  if (r === "ADMIN") return { background: "#dbeafe", color: "#1d4ed8", border: "1px solid #93c5fd" };
  if (r === "MANAGER") return { background: "#dcfce7", color: "#166534", border: "1px solid #86efac" };
  if (r === "WORKER") return { background: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d" };

  return { background: "#f3f4f6", color: "#111827", border: "1px solid #d1d5db" };
}

function metricCard(label: string, value: string) {
  return (
    <div style={metric}>
      <div style={metricLabel}>{label}</div>
      <div style={metricValue}>{value}</div>
    </div>
  );
}

export default async function UserOverviewPage({
  params,
  searchParams,
}: PageProps) {
  // ✅ CRITICAL FIX
  headers();
  cookies();

  const token = await requireAccessToken();
  const { id } = await params;

  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : {};

  const error = String(resolvedSearchParams?.error ?? "").trim();

  const r = await serverAppFetch(`/api/users/${encodeURIComponent(id)}`, token);

  if (r.status === 401) redirect("/login");
  if (!r.ok) redirect("/dashboard/users");

  const json = await r.json();

  if (!isUser(json)) redirect("/dashboard/users");

  const user = json;
  const roleBadgeStyle = getRoleBadgeStyle(user.role);

  async function updateUser(formData: FormData) {
    "use server";

    const tokenInner = await requireAccessToken();

    const fullName = String(formData.get("fullName") ?? "").trim();
    const role = String(formData.get("role") ?? "").trim();

    const payload: Record<string, string> = {};
    if (fullName) payload.fullName = fullName;
    if (role) payload.role = role;

    const res = await serverAppFetch(
      `/api/users/${encodeURIComponent(id)}`,
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
      redirect(`/dashboard/users/${id}?error=${encodeURIComponent(`Update failed (${res.status}) ${text}`)}`);
    }

    redirect(`/dashboard/users/${id}`);
  }

  async function deleteUser() {
    "use server";

    const tokenInner = await requireAccessToken();

    const res = await serverAppFetch(
      `/api/users/${encodeURIComponent(id)}`,
      tokenInner,
      { method: "DELETE" }
    );

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      redirect(`/dashboard/users/${id}?error=${encodeURIComponent(`Delete failed (${res.status}) ${text}`)}`);
    }

    redirect("/dashboard/users");
  }

  return (
    <div style={container}>
      <PageHeader title="User Overview" subtitle="User insight & control" />

      {error && <ErrorState message={error} />}

      <div style={{ marginBottom: 16 }}>
        <span style={{ padding: "6px 10px", borderRadius: 999, ...roleBadgeStyle }}>
          {user.role}
        </span>
      </div>

      <div style={card}>
        <div><b>ID:</b> {user.id}</div>
        <div><b>Name:</b> {user.fullName}</div>
        <div><b>Email:</b> {user.email}</div>
        <div><b>Created:</b> {formatDate(user.createdAt)}</div>
      </div>

      <div style={metricsGrid}>
        {metricCard("Role", user.role)}
        {metricCard("Email", user.email)}
      </div>

      <form action={updateUser} style={form}>
        <div style={card}>
          <input
            name="fullName"
            defaultValue={user.fullName}
            placeholder="Update full name"
            style={input}
          />

          <select name="role" defaultValue={user.role} style={input}>
            <option>OWNER</option>
            <option>ADMIN</option>
            <option>MANAGER</option>
            <option>WORKER</option>
            <option>VIEWER</option>
          </select>
        </div>

        <button type="submit" style={primaryBtn}>
          Update User
        </button>
      </form>

      <div style={{ marginTop: 10 }}>
        <form action={deleteUser}>
          <button type="submit" style={dangerBtn}>
            Delete User
          </button>
        </form>
      </div>

      <div style={{ marginTop: 16 }}>
        <Link href="/dashboard/users" style={secondaryBtn}>
          Back
        </Link>
      </div>
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

const card: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 16,
  background: "#fff",
  display: "grid",
  gap: 8,
};

const metricsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: 10,
  marginTop: 16,
};

const metric: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 14,
};

const metricLabel: React.CSSProperties = {
  fontSize: 12,
  color: "#6b7280",
};

const metricValue: React.CSSProperties = {
  fontWeight: 800,
};

const form: React.CSSProperties = {
  display: "grid",
  gap: 16,
  marginTop: 20,
};

const input: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
};

const primaryBtn: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  background: "#111",
  color: "#fff",
};

const dangerBtn: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  background: "#dc2626",
  color: "#fff",
};

const secondaryBtn: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "1px solid #ddd",
  textDecoration: "none",
  color: "#111",
};