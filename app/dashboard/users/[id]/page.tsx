import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { api } from "@/lib/core-api";
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

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.fullName === "string" &&
    typeof candidate.role === "string" &&
    typeof candidate.companyId === "string" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string"
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
  const normalized = role.toUpperCase();

  if (normalized === "OWNER") {
    return {
      background: "#ede9fe",
      color: "#5b21b6",
      border: "1px solid #c4b5fd",
    };
  }

  if (normalized === "ADMIN") {
    return {
      background: "#dbeafe",
      color: "#1d4ed8",
      border: "1px solid #93c5fd",
    };
  }

  if (normalized === "MANAGER") {
    return {
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #86efac",
    };
  }

  if (normalized === "WORKER") {
    return {
      background: "#fef3c7",
      color: "#92400e",
      border: "1px solid #fcd34d",
    };
  }

  return {
    background: "#f3f4f6",
    color: "#111827",
    border: "1px solid #d1d5db",
  };
}

function metricCard(label: string, value: string) {
  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: 12,
        background: "#fff",
        padding: 16,
      }}
    >
      <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 800, color: "#111" }}>{value}</div>
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

  const r = await fetch(api(`/users/${id}`), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (r.status === 401) redirect("/login");
  if (!r.ok) redirect("/dashboard/users");

  const json = (await r.json()) as unknown;

  if (!isUser(json)) {
    redirect("/dashboard/users");
  }

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

    const res = await fetch(api(`/users/${id}`), {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${tokenInner}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      redirect(
        `/dashboard/users/${id}?error=${encodeURIComponent(
          `Update user failed (${res.status}) ${text}`,
        )}`,
      );
    }

    redirect(`/dashboard/users/${id}`);
  }

  async function deleteUser() {
    "use server";

    const tokenInner = await requireAccessToken();

    const res = await fetch(api(`/users/${id}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${tokenInner}`,
      },
      cache: "no-store",
    });

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      redirect(
        `/dashboard/users/${id}?error=${encodeURIComponent(
          `Delete user failed (${res.status}) ${text}`,
        )}`,
      );
    }

    redirect("/dashboard/users");
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 960 }}>
      <PageHeader
        title="User Overview"
        subtitle="User insight first, followed by user control actions"
      />

      {error ? (
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
          {error}
        </div>
      ) : null}

      <div
        style={{
          marginBottom: 12,
          display: "inline-block",
          padding: "6px 10px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 800,
          ...roleBadgeStyle,
        }}
      >
        {user.role}
      </div>

      <div
        style={{
          marginBottom: 8,
          fontSize: 13,
          fontWeight: 700,
          color: "#444",
        }}
      >
        User Insight
      </div>

      <div
        style={{
          marginBottom: 16,
          padding: 16,
          border: "1px solid #eee",
          borderRadius: 12,
          background: "#fff",
        }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <div>
            <b>User ID:</b> {user.id}
          </div>
          <div>
            <b>Full Name:</b> {user.fullName}
          </div>
          <div>
            <b>Email:</b> {user.email}
          </div>
          <div>
            <b>Role:</b> {user.role}
          </div>
          <div>
            <b>Company ID:</b> {user.companyId}
          </div>
          <div>
            <b>Created At:</b> {formatDate(user.createdAt)}
          </div>
          <div>
            <b>Updated At:</b> {formatDate(user.updatedAt)}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {metricCard("Role", user.role)}
        {metricCard("Company ID", user.companyId)}
        {metricCard("Email", user.email)}
      </div>

      <div
        style={{
          marginBottom: 8,
          fontSize: 13,
          fontWeight: 700,
          color: "#444",
        }}
      >
        User Control Actions
      </div>

      <form action={updateUser} style={{ display: "grid", gap: 16 }}>
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
          <div>
            <label
              htmlFor="fullName"
              style={{ display: "block", marginBottom: 6, fontWeight: 700 }}
            >
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              defaultValue={user.fullName}
              placeholder="Enter full name"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              style={{ display: "block", marginBottom: 6, fontWeight: 700 }}
            >
              Email
            </label>
            <input
              id="email"
              value={user.email}
              disabled
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "#f7f7f7",
                color: "#555",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="role"
              style={{ display: "block", marginBottom: 6, fontWeight: 700 }}
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              defaultValue={user.role}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "#fff",
              }}
            >
              <option value="OWNER">OWNER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="MANAGER">MANAGER</option>
              <option value="WORKER">WORKER</option>
              <option value="VIEWER">VIEWER</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="submit"
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #111",
              background: "#111",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Update User
          </button>

          <Link
            href="/dashboard/users"
            style={{
              display: "inline-block",
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "#fff",
              textDecoration: "none",
              color: "#111",
              fontWeight: 600,
            }}
          >
            Back to Users
          </Link>
        </div>
      </form>

      <form action={deleteUser} style={{ marginTop: 16 }}>
        <button
          type="submit"
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid #dc2626",
            background: "#fff",
            color: "#dc2626",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Deactivate User
        </button>
      </form>
    </div>
  );
}