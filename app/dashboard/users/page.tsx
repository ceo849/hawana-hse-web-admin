import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import PageHeader from "@/components/ui/page-header";
import { decodeJwtPayload } from "@/src/auth/jwt";

type Role =
  | "OWNER"
  | "ADMIN"
  | "MANAGER"
  | "WORKER"
  | "VIEWER"
  | "UNKNOWN";

type UserDto = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
};

// ---------- Type Guard ----------
function isUser(v: unknown): v is UserDto {
  if (typeof v !== "object" || v === null) return false;

  const c = v as Record<string, unknown>;

  return (
    typeof c.id === "string" &&
    typeof c.email === "string" &&
    typeof c.fullName === "string" &&
    typeof c.role === "string" &&
    typeof c.createdAt === "string"
  );
}

// ---------- Parser ----------
function parse(value: unknown): UserDto[] {
  if (Array.isArray(value)) return value.filter(isUser);

  if (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as any).data)
  ) {
    return (value as any).data.filter(isUser);
  }

  return [];
}

// ---------- Date Formatter ----------
function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

// ---------- Page ----------
export default async function UsersPage() {
  const token = await requireAccessToken();

  const payload = decodeJwtPayload(token);
  const role: Role = (payload?.role as Role) ?? "UNKNOWN";

  const canManageUsers =
    role === "OWNER" || role === "ADMIN";

  const CORE_API =
    (process.env.NEXT_PUBLIC_API_BASE_URL ??
      "http://localhost:3001").replace(/\/$/, "");

  const res = await fetch(
    `${CORE_API}/v1/users?page=1&limit=20`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  // 🔐 Auth
  if (res.status === 401) redirect("/login");

  // 🔐 RBAC
  if (res.status === 403) {
    return (
      <div style={container}>
        <PageHeader title="Users" subtitle="Access restricted" />
        <div>Not authorized to view users</div>
      </div>
    );
  }

  if (!res.ok) {
    return (
      <div style={container}>
        <PageHeader title="Users" subtitle="Error" />
        Failed to load users
      </div>
    );
  }

  const json = await res.json();
  const users = parse(json);

  return (
    <div style={container}>
      <PageHeader
        title="Users"
        subtitle="Users Management"
        action={
          canManageUsers ? (
            <Link href="/dashboard/users/new">
              + New User
            </Link>
          ) : undefined
        }
      />

      <div style={{ marginBottom: 12 }}>
        Total: {users.length}
      </div>

      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>Role</th>
            <th style={th}>Created</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={row}>
              <td style={td}>{u.fullName}</td>
              <td style={td}>{u.email}</td>
              <td style={td}>{u.role}</td>
              <td style={td}>{formatDate(u.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------- Styles ----------
const container: React.CSSProperties = {
  padding: 24,
  fontFamily: "system-ui",
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const th: React.CSSProperties = {
  textAlign: "left",
  borderBottom: "1px solid #ddd",
  padding: "10px 8px",
  fontSize: 13,
  color: "#6b7280",
};

const td: React.CSSProperties = {
  padding: "10px 8px",
};

const row: React.CSSProperties = {
  borderBottom: "1px solid #eee",
};