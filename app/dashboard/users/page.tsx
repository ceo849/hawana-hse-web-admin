// app/dashboard/users/page.tsx

export const dynamic = "force-dynamic";

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
    total?: number;
  };
};

function parseUsers(value: unknown): UsersResponse {
  if (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as { data?: unknown }).data)
  ) {
    const raw = value as {
      data: UserDto[];
      meta?: {
        total?: unknown;
      };
    };

    return {
      data: raw.data,
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
        fontWeight: 700,
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
    res = await serverAppFetch(
      "/api/users?page=1&limit=20",
      token,
      { cache: "no-store" }
    );
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") {
      redirect("/login");
    }

    console.error("Users Fetch Error:", err);

    return (
      <div style={container}>
        <PageHeader title="Users" subtitle="User management" />
        <div style={errorBox}>
          Failed to load users (network/server error)
        </div>
      </div>
    );
  }

  if (res.status === 401) {
    redirect("/login");
  }

  if (!res.ok) {
    return (
      <div style={container}>
        <PageHeader title="Users" subtitle="User management" />
        <div style={errorBox}>Failed to load users</div>
      </div>
    );
  }

  const json = await res.json();
  const parsed = parseUsers(json);

  const users = parsed.data;
  const total = parsed.meta?.total ?? 0;

  return (
    <div style={container}>
      <PageHeader
        title="Users"
        subtitle="User management"
        action={
          canShowCreateAction ? (
            <Link href="/dashboard/users/new" style={headerAction}>
              + New User
            </Link>
          ) : undefined
        }
      />

      <section style={section}>
        <div style={sectionHeader}>
          <div style={sectionTitle}>Directory</div>
          <div style={sectionMeta}>Total users: {total}</div>
        </div>

        <div className="desktop-only">
          <div style={tableCard}>
            <table
              style={{
                minWidth: 600,
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th align="left" style={th}>Name</th>
                  <th align="left" style={th}>Email</th>
                  <th align="left" style={th}>Role</th>
                  <th align="left" style={th}>Company</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                    <td style={td}>{u.fullName}</td>
                    <td style={emailCell}>{u.email}</td>
                    <td style={td}>
                      <RoleBadge role={u.role} />
                    </td>
                    <td style={companyCell}>{u.companyId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mobile-only" style={{ display: "grid", gap: 10 }}>
          {users.map((u) => (
            <Link
              key={u.id}
              href={`/dashboard/users/${u.id}`}
              style={userCard}
            >
              <div style={userCardTop}>
                <div>
                  <div style={userName}>{u.fullName}</div>
                  <div style={userEmail}>{u.email}</div>
                </div>

                <RoleBadge role={u.role} />
              </div>

              <div style={userCompany}>Company: {u.companyId}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

/* styles بدون تغيير */
const container: React.CSSProperties = {
  padding: 16,
  fontFamily: "system-ui",
  maxWidth: 680,
  margin: "0 auto",
};

const section: React.CSSProperties = {
  marginTop: 18,
  display: "grid",
  gap: 10,
};

const sectionHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#6b7280",
};

const sectionMeta: React.CSSProperties = {
  fontSize: 12,
  color: "#9ca3af",
  whiteSpace: "nowrap",
};

const headerAction: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px 12px",
  borderRadius: 12,
  background: "#111827",
  color: "#ffffff",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 700,
};

const tableCard: React.CSSProperties = {
  overflowX: "auto",
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const th: React.CSSProperties = {
  padding: "10px 8px",
  fontSize: 12,
  color: "#6b7280",
  fontWeight: 700,
};

const td: React.CSSProperties = {
  padding: "10px 8px",
  whiteSpace: "nowrap",
  fontSize: 13,
};

const emailCell: React.CSSProperties = {
  ...td,
  maxWidth: 160,
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const companyCell: React.CSSProperties = {
  ...td,
  maxWidth: 180,
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const userCard: React.CSSProperties = {
  display: "block",
  padding: 14,
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  textDecoration: "none",
  color: "inherit",
  background: "#ffffff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const userCardTop: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
};

const userName: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 15,
  marginBottom: 4,
};

const userEmail: React.CSSProperties = {
  fontSize: 12,
  color: "#6b7280",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const userCompany: React.CSSProperties = {
  marginTop: 10,
  paddingTop: 10,
  borderTop: "1px solid #f3f4f6",
  fontSize: 12,
  color: "#9ca3af",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const errorBox: React.CSSProperties = {
  color: "#991b1b",
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: 12,
  padding: 12,
  marginTop: 12,
  fontSize: 13,
};