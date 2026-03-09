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

export default async function EditUserPage({
  params,
  searchParams,
}: PageProps) {
  const token = await requireAccessToken();
  const { id } = await params;

  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : {};

  const error = String(resolvedSearchParams?.error ?? "").trim();

  const r = await fetch(api(`/v1/users/${id}`), {
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

  async function updateUser(formData: FormData) {
    "use server";

    const tokenInner = await requireAccessToken();

    const fullName = String(formData.get("fullName") ?? "").trim();
    const role = String(formData.get("role") ?? "").trim();

    const payload: Record<string, string> = {};

    if (fullName) payload.fullName = fullName;
    if (role) payload.role = role;

    const res = await fetch(api(`/v1/users/${id}`), {
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

    redirect("/dashboard/users");
  }

  async function deleteUser() {
    "use server";

    const tokenInner = await requireAccessToken();

    const res = await fetch(api(`/v1/users/${id}`), {
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
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 760 }}>
      <PageHeader
        title="Edit User"
        subtitle="Update user information and access role"
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

          <a
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
            Cancel
          </a>
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
          Delete User
        </button>
      </form>
    </div>
  );
}