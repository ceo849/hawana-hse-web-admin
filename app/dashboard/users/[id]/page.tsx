import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import PageHeader from "@/components/ui/page-header";

type UserRole = "OWNER" | "ADMIN" | "MANAGER" | "WORKER" | "VIEWER";

type User = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  companyId: string;
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
    typeof c.companyId === "string" &&
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
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 12, color: "#666" }}>{label}</div>
      <div style={{ fontWeight: 800 }}>{value}</div>
    </div>
  );
}

export default async function UserOverviewPage({
  params,
  searchParams,
}: PageProps) {
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
    <div style={{ padding: 24, maxWidth: 960 }}>
      <PageHeader title="User Overview" subtitle="User insight & control" />

      {error && (
        <div style={{ marginBottom: 16, padding: 12, background: "#fef2f2" }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: 12, ...roleBadgeStyle }}>{user.role}</div>

      <div style={{ border: "1px solid #eee", padding: 16, marginBottom: 16 }}>
        <div><b>ID:</b> {user.id}</div>
        <div><b>Name:</b> {user.fullName}</div>
        <div><b>Email:</b> {user.email}</div>
        <div><b>Company:</b> {user.companyId}</div>
        <div><b>Created:</b> {formatDate(user.createdAt)}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {metricCard("Role", user.role)}
        {metricCard("Company", user.companyId)}
        {metricCard("Email", user.email)}
      </div>

      <form action={updateUser} style={{ marginTop: 20 }}>
        <input name="fullName" defaultValue={user.fullName} />
        <select name="role" defaultValue={user.role}>
          <option>OWNER</option>
          <option>ADMIN</option>
          <option>MANAGER</option>
          <option>WORKER</option>
          <option>VIEWER</option>
        </select>
        <button type="submit">Update</button>
      </form>

      <form action={deleteUser} style={{ marginTop: 10 }}>
        <button type="submit">Delete</button>
      </form>

      <Link href="/dashboard/users">Back</Link>
    </div>
  );
}