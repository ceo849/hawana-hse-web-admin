import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
import { decodeJwtPayload } from "@/src/auth/jwt";

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
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const res = await fetch(
      `${baseUrl}/v1/users?page=${page}&limit=${limit}&q=${q}&role=${roleFilter}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    if (res.status === 401) {
      redirect("/login");
    }

    const json = await res.json();
    const parsed = parseUsersResponse(json, page, limit);

    users = parsed.data;
    meta = parsed.meta;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown users fetch error";

    return (
      <div style={{ fontFamily: "system-ui", padding: 24 }}>
        <PageHeader
          title="Users Administration"
          subtitle="Control actions for tenant users"
        />

        <pre style={{ marginTop: 16 }}>{message}</pre>
      </div>
    );
  }

  const prevPage = Math.max(1, meta.page - 1);
  const nextPage = Math.min(Math.max(meta.totalPages, 1), meta.page + 1);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <PageHeader
        title="Users Administration"
        subtitle="Control actions for tenant users"
        action={
          canManageUsers ? (
            <Link
              href="/dashboard/users/new"
              style={{
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

      <div style={{ marginBottom: 12 }}>
        Total users: <strong>{meta.total}</strong>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Company</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                <Link href={`/dashboard/users/${u.id}`}>{u.fullName}</Link>
                <div>{u.email}</div>
              </td>

              <td>
                <span style={getRoleBadgeStyle(u.role)}>{u.role}</span>
              </td>

              <td>{u.companyId}</td>
              <td>{formatDate(u.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 16 }}>
        <Link href={buildDashboardUsersUrl(prevPage, limit, q, roleFilter)}>
          Previous
        </Link>
        {" | "}
        <Link href={buildDashboardUsersUrl(nextPage, limit, q, roleFilter)}>
          Next
        </Link>
      </div>
    </div>
  );
}