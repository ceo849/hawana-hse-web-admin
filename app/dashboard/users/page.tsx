export const dynamic = "force-dynamic";

import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
import { decodeJwtPayload } from "@/src/auth/jwt";

type UserDto = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
};

function getCoreUrl() {
  const url = process.env.CORE_API_BASE_URL;
  if (!url) throw new Error("CORE_API_BASE_URL missing");
  return url;
}

function normalizeUsers(value: any): UserDto[] {
  // الحالة 1: { data: [...] }
  if (Array.isArray(value?.data)) return value.data;

  // الحالة 2: array مباشر
  if (Array.isArray(value)) return value;

  // الحالة 3: object واحد (سبب المشكلة)
  if (value && typeof value === "object") return [value];

  return [];
}

export default async function UsersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  const payload = decodeJwtPayload(token);
  const role = payload?.role;

  const canManageUsers = role === "OWNER" || role === "ADMIN";

  let users: UserDto[] = [];

  try {
    const res = await fetch(`${getCoreUrl()}/users?page=1&limit=20`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (res.status === 401) redirect("/login");

    const json = await res.json();

    // ✅ FIX الحقيقي
    users = normalizeUsers(json);
  } catch {
    return <div style={{ padding: 24 }}>Failed to load</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <PageHeader
        title="Users"
        subtitle="Users Management"
        action={
          canManageUsers ? (
            <Link href="/dashboard/users/new">+ New User</Link>
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