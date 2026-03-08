import Link from "next/link";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

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
  if (!Array.isArray(value)) return [];
  return value.filter(isUserDto);
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

export default async function UsersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${host}`;

  const r = await fetch(`${origin}/api/users`, {
    method: "GET",
    cache: "no-store",
    headers: {
      cookie: cookieStore.toString(),
    },
  });

  if (r.status === 401) {
    redirect("/login");
  }

  if (!r.ok) {
    const text = await r.text().catch(() => "");

    return (
      <div style={{ fontFamily: "system-ui" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Users</h1>

        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: "#f7f7f7",
            borderRadius: 12,
            overflowX: "auto",
            whiteSpace: "pre-wrap",
          }}
        >{`Failed to load users (${r.status})
${text}`}</pre>
      </div>
    );
  }

  const json = (await r.json()) as unknown;
  const users = parseUsers(json);

  return (
    <div style={{ fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800 }}>Users</h1>

      <div
        style={{
          marginTop: 16,
          border: "1px solid #eee",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: 12,
                  borderBottom: "1px solid #eee",
                }}
              >
                Full Name
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 12,
                  borderBottom: "1px solid #eee",
                }}
              >
                Email
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 12,
                  borderBottom: "1px solid #eee",
                }}
              >
                Role
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 12,
                  borderBottom: "1px solid #eee",
                }}
              >
                Company ID
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 12,
                  borderBottom: "1px solid #eee",
                }}
              >
                User ID
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 12,
                  borderBottom: "1px solid #eee",
                }}
              >
                Created At
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: 12,
                  borderBottom: "1px solid #eee",
                }}
              >
                Updated At
              </th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 12 }}>
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                    <Link
                      href={`/dashboard/users/${u.id}`}
                      style={{
                        color: "#2563eb",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      {u.fullName}
                    </Link>
                  </td>
                  <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                    {u.email}
                  </td>
                  <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                    {u.role}
                  </td>
                  <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                    {u.companyId}
                  </td>
                  <td
                    style={{
                      padding: 12,
                      borderBottom: "1px solid #eee",
                      fontFamily: "monospace",
                      fontSize: 12,
                    }}
                  >
                    {u.id}
                  </td>
                  <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                    {formatDate(u.createdAt)}
                  </td>
                  <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                    {formatDate(u.updatedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}