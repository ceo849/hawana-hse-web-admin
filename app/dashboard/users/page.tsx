export const dynamic = "force-dynamic";

import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
  role: string;
  createdAt: string;
};

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

export default async function UsersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  const payload = decodeJwtPayload(token);
  const role: Role = (payload?.role as Role) ?? "UNKNOWN";

  const canManageUsers =
    role === "OWNER" || role === "ADMIN";

  let users: UserDto[] = [];

  const res = await serverAppFetch(
    "/users?page=1&limit=20",
    token
  );

  if (res.status === 401) redirect("/login");

  if (!res.ok) {
    return <div style={{ padding: 24 }}>Failed to load</div>;
  }

  const json = await res.json();
  users = parse(json);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
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

      <div>Total: {users.length}</div>

      <table>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}