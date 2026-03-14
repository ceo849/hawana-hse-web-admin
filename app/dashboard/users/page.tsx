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

type UsersMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type UsersResponse = {
  data: UserDto[];
  meta: UsersMeta;
};

type SearchParamsInput =
  | {
      page?: string;
      limit?: string;
      q?: string;
      role?: string;
    }
  | Promise<{
      page?: string;
      limit?: string;
      q?: string;
      role?: string;
    }>;

type PageProps = {
  searchParams?: SearchParamsInput;
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

function parseUsersResponse(
  value: unknown,
  fallbackPage: number,
  fallbackLimit: number,
): UsersResponse {
  if (Array.isArray(value)) {
    const data = value.filter(isUserDto);

    return {
      data,
      meta: {
        page: fallbackPage,
        limit: fallbackLimit,
        total: data.length,
        totalPages: 1,
      },
    };
  }

  if (typeof value !== "object" || value === null) {
    return {
      data: [],
      meta: {
        page: fallbackPage,
        limit: fallbackLimit,
        total: 0,
        totalPages: 1,
      },
    };
  }

  const candidate = value as Record<string, unknown>;
  const data = Array.isArray(candidate.data)
    ? candidate.data.filter(isUserDto)
    : [];

  const metaRaw =
    typeof candidate.meta === "object" && candidate.meta !== null
      ? (candidate.meta as Record<string, unknown>)
      : null;

  return {
    data,
    meta: {
      page: typeof metaRaw?.page === "number" ? metaRaw.page : fallbackPage,
      limit: typeof metaRaw?.limit === "number" ? metaRaw.limit : fallbackLimit,
      total: typeof metaRaw?.total === "number" ? metaRaw.total : data.length,
      totalPages:
        typeof metaRaw?.totalPages === "number" ? metaRaw.totalPages : 1,
    },
  };
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

function buildUsersUrl(page: number, limit: number, q: string, role: string) {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(limit));

  if (q) params.set("q", q);
  if (role) params.set("role", role);

  return `/api/users?${params.toString()}`;
}

function buildDashboardUsersUrl(
  page: number,
  limit: number,
  q: string,
  role: string,
) {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(limit));

  if (q) params.set("q", q);
  if (role) params.set("role", role);

  return `/dashboard/users?${params.toString()}`;
}

export default async function UsersPage({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  const resolvedSearchParams = searchParams
    ? await Promise.resolve(searchParams)
    : {};

  const page = Math.max(1, Number(resolvedSearchParams.page ?? "1") || 1);
  const limit = Math.max(1, Number(resolvedSearchParams.limit ?? "20") || 20);
  const q = String(resolvedSearchParams.q ?? "").trim();
  const roleFilter = String(resolvedSearchParams.role ?? "").trim().toUpperCase();

  const payload = decodeJwtPayload(token);
  const currentRole: Role = (payload?.role as Role) ?? "UNKNOWN";
  const canManageUsers = currentRole === "OWNER" || currentRole === "ADMIN";

  let users: UserDto[] = [];
  let meta: UsersMeta = {
    page,
    limit,
    total: 0,
    totalPages: 1,
  };

  try {
    const raw = await serverAppFetch(buildUsersUrl(page, limit, q, roleFilter));
    const json = parseUsersResponse(raw, page, limit);

    users = json.data;
    meta = json.meta;
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
          subtitle="Control actions for tenant users and access roles"
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

  const prevPage = Math.max(1, meta.page - 1);
  const nextPage = Math.min(Math.max(meta.totalPages, 1), meta.page + 1);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <PageHeader
        title="Users Administration"
        subtitle="Control actions for tenant users. Detail insight remains inside each user page."
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

      <form
        method="GET"
        action="/dashboard/users"
        style={{
          marginBottom: 16,
          padding: 14,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          background: "#fff",
          display: "grid",
          gridTemplateColumns: "2fr 1fr auto",
          gap: 12,
          alignItems: "end",
        }}
      >
        <div>
          <label
            htmlFor="q"
            style={{ display: "block", marginBottom: 6, fontWeight: 700 }}
          >
            Search
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Search by full name or email"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ddd",
              borderRadius: 10,
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
            defaultValue={roleFilter}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #ddd",
              borderRadius: 10,
              background: "#fff",
            }}
          >
            <option value="">All Roles</option>
            <option value="OWNER">OWNER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="MANAGER">MANAGER</option>
            <option value="WORKER">WORKER</option>
            <option value="VIEWER">VIEWER</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input type="hidden" name="page" value="1" />
          <input type="hidden" name="limit" value={String(limit)} />

          <button
            type="submit"
            style={{
              padding: "10px 16px",
              background: "#111",
              color: "#fff",
              border: "1px solid #111",
              borderRadius: 10,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Apply
          </button>

          <Link
            href={`/dashboard/users?page=1&limit=${limit}`}
            style={{
              display: "inline-block",
              padding: "10px 16px",
              border: "1px solid #ddd",
              borderRadius: 10,
              textDecoration: "none",
              color: "#111",
              background: "#fff",
              fontWeight: 600,
            }}
          >
            Reset
          </Link>
        </div>
      </form>

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
        Total users: <strong>{meta.total}</strong>
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

      <div
        style={{
          marginTop: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ fontSize: 13, color: "#555" }}>
          Page <strong>{meta.page}</strong> of{" "}
          <strong>{Math.max(meta.totalPages, 1)}</strong>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <Link
            href={buildDashboardUsersUrl(prevPage, limit, q, roleFilter)}
            style={{
              pointerEvents: meta.page <= 1 ? "none" : "auto",
              opacity: meta.page <= 1 ? 0.5 : 1,
              display: "inline-block",
              padding: "10px 16px",
              border: "1px solid #ddd",
              borderRadius: 10,
              textDecoration: "none",
              color: "#111",
              background: "#fff",
              fontWeight: 600,
            }}
          >
            Previous
          </Link>

          <Link
            href={buildDashboardUsersUrl(nextPage, limit, q, roleFilter)}
            style={{
              pointerEvents:
                meta.page >= Math.max(meta.totalPages, 1) ? "none" : "auto",
              opacity: meta.page >= Math.max(meta.totalPages, 1) ? 0.5 : 1,
              display: "inline-block",
              padding: "10px 16px",
              border: "1px solid #ddd",
              borderRadius: 10,
              textDecoration: "none",
              color: "#111",
              background: "#fff",
              fontWeight: 600,
            }}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}