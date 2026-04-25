// app/dashboard/users/page.tsx

export const dynamic = "force-dynamic";

import Link from "next/link";
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
    total?: number;
  };
};

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
  if (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { data?: unknown }).data)
  ) {
    const raw = value as {
      data: unknown[];
      meta?: {
        total?: unknown;
      };
    };

    return {
      data: raw.data.filter(isUserDto),
      meta: {
        total:
          typeof raw.meta?.total === "number" ? raw.meta.total : undefined,
      },
    };
  }

  return { data: [], meta: { total: undefined } };
}

function RoleBadge({ role }: { role: string }) {
  let bg = "#e5e7eb";
  let color = "#111827";

  if (role === "OWNER") {
    bg = "#fef3c7";
    color = "#92400e";
  } else if (role === "ADMIN") {
    bg = "#dbeafe";
    color = "#1e40af";
  } else if (role === "MANAGER") {
    bg = "#dcfce7";
    color = "#166534";
  }

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: 12,
        fontWeight: 600,
        background: bg,
        color,
        whiteSpace: "nowrap",
      }}
    >
      {role}
    </span>
  );
}

export default async function UsersPage() {
  const token = await requireAccessToken();

  const payload = decodeJwtPayload(token);
  const role: Role = (payload?.role as Role) ?? "UNKNOWN";

  const canShowCreateAction = role === "OWNER" || role === "ADMIN";

  let res: Response;

  try {
    res = await serverAppFetch("/api/users?page=1&limit=20", {
      cache: "no-store",
    });
  } catch (err) {
    console.error("Users Fetch Error:", err);

    return (
      <div style={{ padding: 24 }}>
        <PageHeader title="Users" subtitle="User management" />
        <div style={{ color: "red", marginTop: 12 }}>
          Failed to load users (network/server error)
        </div>
      </div>
    );
  }

  if (!res.ok) {
    return (
      <div style={{ padding: 24 }}>
        <PageHeader title="Users" subtitle="User management" />
        <div style={{ color: "red", marginTop: 12 }}>
          Failed to load users
        </div>
      </div>
    );
  }

  const json = await res.json();
  const parsed = parseUsers(json);

  const users = parsed.data;
  const total = parsed.meta?.total ?? 0;

  return (
    <div style={{ padding: 16, fontFamily: "system-ui" }}>
      <PageHeader
        title="Users"
        subtitle="User management"
        action={
          canShowCreateAction ? (
            <Link href="/dashboard/users/new">+ New User</Link>
          ) : undefined
        }
      />

      <div style={{ marginBottom: 12 }}>Total users: {total}</div>

      <div className="desktop-only">
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              minWidth: 600,
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
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
                <tr key={u.id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: "8px 6px", whiteSpace: "nowrap" }}>
                    {u.fullName}
                  </td>

                  <td
                    style={{
                      padding: "8px 6px",
                      maxWidth: 160,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {u.email}
                  </td>

                  <td style={{ padding: "8px 6px" }}>
                    <RoleBadge role={u.role} />
                  </td>

                  <td
                    style={{
                      padding: "8px 6px",
                      maxWidth: 180,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {u.companyId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mobile-only" style={{ marginTop: 12 }}>
        {users.map((u) => (
          <Link
            key={u.id}
            href={`/dashboard/users/${u.id}`}
            style={{
              display: "block",
              padding: 16,
              borderRadius: 14,
              border: "1px solid #e5e7eb",
              marginBottom: 12,
              textDecoration: "none",
              color: "inherit",
              background: "#ffffff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 6 }}>
              {u.fullName}
            </div>

            <div
              style={{
                fontSize: 13,
                color: "#6b7280",
                marginBottom: 6,
              }}
            >
              {u.email}
            </div>

            <div style={{ marginBottom: 4 }}>
              <RoleBadge role={u.role} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}