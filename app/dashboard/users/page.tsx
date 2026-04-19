import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import PageHeader from "@/components/ui/page-header";
import { decodeJwtPayload } from "@/src/auth/jwt";
import { serverAppFetch } from "@/src/lib/server-app-fetch";

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
  role: Role;
  companyId: string;
  createdAt: string;
};

type UsersResponse = {
  data: UserDto[];
  meta?: {
    total: number;
  };
};

// ===== Parsers =====
function isUserDto(v: unknown): v is UserDto {
  if (typeof v !== "object" || v === null) return false;

  const c = v as Record<string, unknown>;

  return (
    typeof c.id === "string" &&
    typeof c.email === "string" &&
    typeof c.fullName === "string" &&
    typeof c.role === "string" &&
    typeof c.companyId === "string"
  );
}

function parseUsers(value: unknown): UsersResponse {
  if (Array.isArray(value)) {
    const data = value.filter(isUserDto);
    return { data, meta: { total: data.length } };
  }

  if (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as any).data)
  ) {
    const data = (value as any).data.filter(isUserDto);

    return {
      data,
      meta: {
        total:
          typeof (value as any)?.meta?.total === "number"
            ? (value as any).meta.total
            : data.length,
      },
    };
  }

  return { data: [], meta: { total: 0 } };
}

// ===== PAGE =====
export default async function UsersPage() {
  const token = await requireAccessToken();

  const payload = decodeJwtPayload(token);
  const role: Role = (payload?.role as Role) ?? "UNKNOWN";

  const canManage =
    role === "OWNER" || role === "ADMIN";

  let users: UserDto[] = [];
  let total = 0;

  try {
    const res = await serverAppFetch(
      "/api/users?page=1&limit=20",
      token,
      { cache: "no-store" }
    );

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      return <div>Failed to load users</div>;
    }

    const json = await res.json();
    const parsed = parseUsers(json);

    users = parsed.data;
    total = parsed.meta?.total ?? users.length;

  } catch (err) {
    console.error("Users Fetch Error:", err);

    return <div>Failed to load users</div>;
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <PageHeader
        title="Users"
        subtitle="User management"
        action={
          canManage ? (
            <Link href="/dashboard/users/new">+ New User</Link>
          ) : undefined
        }
      />

      <div>Total users: {total}</div>

      <table>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Email</th>
            <th align="left">Role</th>
            <th align="left">Company</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.companyId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}