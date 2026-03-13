import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
import { decodeJwtPayload } from "@/src/auth/jwt";
import { serverAppFetch } from "@/src/lib/server-app-fetch";

type Role = "OWNER" | "ADMIN" | "MANAGER" | "WORKER" | "VIEWER" | "UNKNOWN";

type UserDto = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
};

function isUserDto(value: unknown): value is UserDto {
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

function parseUsers(value: unknown): UserDto[] {
  if (Array.isArray(value)) {
    return value.filter(isUserDto);
  }

  if (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { data?: unknown }).data)
  ) {
    return ((value as { data: unknown[] }).data).filter(isUserDto);
  }

  return [];
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

export default async function UsersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  const payload = decodeJwtPayload(token);
  const currentRole: Role = (payload?.role as Role) ?? "UNKNOWN";
  const canManageUsers = currentRole === "OWNER" || currentRole === "ADMIN";

  let users: UserDto[] = [];

  try {
    const json = await serverAppFetch("/api/users");
    users = parseUsers(json);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown users fetch error";

    if (message.includes("401")) {
      redirect("/login");
    }

    return (
      <div style={{ fontFamily: "system-ui", padding: 24 }}>
        <PageHeader
          title="Users Administration"
          subtitle="Control layer for tenant users and access roles"
        />

        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: "#f7f7f7",
            borderRadius: 12,
            overflowX: "auto",
            whiteSpace: "pre-wrap",
          }}
        >{`Failed to load users
${message}`}</pre>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <PageHeader
        title="Users Administration"
        subtitle="Control actions for tenant users and access roles. User insight remains inside each user detail page."
        action={
          canManageUsers ? (
            <Link
              href="/dashboard/users/new"
              style={{
                display: "inline-block",
                padding: "10px 16px",
                background: "#111",
                color: "#fff",
                borderRadius: 10,
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              + New User
            </Link>
          ) : undefined
        }
      />

      <div
        style={{
          marginBottom: 12,
          padding: "12px 14px",
          border: "1px solid #eee",
          borderRadius: 12,
          background: "#fafafa",
          fontSize: 14,
          color: "#444",
        }}
      >
        Total users: <strong>{users.length}</strong>
      </div>

      <div
        style={{
          marginBottom: 16,
          padding: 14,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          background: "#fff",
          fontSize: 13,
          color: "#444",
        }}
      >
        <div style={{ fontWeight: 700, color: "#111", marginBottom: 6 }}>
          Scope of this page
        </div>
        <div>
          This page is for user administration actions. User detail insight and
          edit controls remain inside the individual user page.
        </div>
      </div>

      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 12,
          overflowX: "auto",
          background: "#fff",
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: 1180,
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: 14,
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                }}
              >
                User
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 14,
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                }}
              >
                Role
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 14,
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                }}
              >
                Company ID
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 14,
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                }}
              >
                User ID
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 14,
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                }}
              >
                Created At
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 14,
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                }}
              >
                Updated At
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 14,
                  borderBottom: "1px solid #eee",
                  fontSize: 13,
                  width: 150,
                }}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: 24,
                    color: "#555",
                  }}
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const roleBadgeStyle = getRoleBadgeStyle(u.role);

                return (
                  <tr key={u.id}>
                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid #eee",
                        verticalAlign: "top",
                      }}
                    >
                      <Link
                        href={`/dashboard/users/${u.id}`}
                        style={{
                          color: "#111",
                          fontWeight: 800,
                          textDecoration: "none",
                        }}
                      >
                        {u.fullName}
                      </Link>

                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 13,
                          color: "#666",
                        }}
                      >
                        {u.email}
                      </div>
                    </td>

                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid #eee",
                        verticalAlign: "top",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          padding: "6px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 800,
                          ...roleBadgeStyle,
                        }}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid #eee",
                        verticalAlign: "top",
                        fontFamily: "monospace",
                        fontSize: 12,
                        color: "#444",
                        wordBreak: "break-all",
                      }}
                    >
                      {u.companyId}
                    </td>

                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid #eee",
                        verticalAlign: "top",
                        fontFamily: "monospace",
                        fontSize: 12,
                        color: "#444",
                        wordBreak: "break-all",
                      }}
                    >
                      {u.id}
                    </td>

                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid #eee",
                        verticalAlign: "top",
                        fontSize: 13,
                        color: "#444",
                      }}
                    >
                      {formatDate(u.createdAt)}
                    </td>

                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid #eee",
                        verticalAlign: "top",
                        fontSize: 13,
                        color: "#444",
                      }}
                    >
                      {formatDate(u.updatedAt)}
                    </td>

                    <td
                      style={{
                        padding: 14,
                        borderBottom: "1px solid #eee",
                        verticalAlign: "top",
                      }}
                    >
                      <Link
                        href={`/dashboard/users/${u.id}`}
                        style={{
                          textDecoration: "underline",
                          color: "#111",
                          fontWeight: 600,
                        }}
                      >
                        Open detail
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}