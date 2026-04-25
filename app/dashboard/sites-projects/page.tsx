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

type SiteProject = {
  id: string;
  name: string;
  location: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type SitesProjectsResponse = {
  data: SiteProject[];
  meta?: {
    total?: number;
  };
};

function isSiteProject(value: unknown): value is SiteProject {
  if (typeof value !== "object" || value === null) return false;

  const c = value as Record<string, unknown>;

  return (
    typeof c.id === "string" &&
    typeof c.name === "string" &&
    (typeof c.location === "string" || c.location === null) &&
    typeof c.status === "string" &&
    typeof c.createdAt === "string" &&
    typeof c.updatedAt === "string"
  );
}

function parseSiteProjects(value: unknown): SitesProjectsResponse {
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
      data: raw.data.filter(isSiteProject),
      meta: {
        total:
          typeof raw.meta?.total === "number" ? raw.meta.total : undefined,
      },
    };
  }

  return { data: [], meta: { total: undefined } };
}

function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

function statusStyle(status: string): React.CSSProperties {
  if (status.toUpperCase() === "ACTIVE") {
    return {
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #86efac",
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 600,
      whiteSpace: "nowrap",
    };
  }

  return {
    background: "#f3f4f6",
    color: "#111827",
    border: "1px solid #d1d5db",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    whiteSpace: "nowrap",
  };
}

export default async function SitesProjectsPage() {
  const token = await requireAccessToken();

  const payload = decodeJwtPayload(token);
  const role: Role = (payload?.role as Role) ?? "UNKNOWN";

  const canShowCreateAction =
    role === "OWNER" || role === "ADMIN" || role === "MANAGER";

  let res: Response;

  try {
    res = await serverAppFetch("/api/sites-projects?page=1&limit=20", {
      cache: "no-store",
    });
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") {
      redirect("/login");
    }

    console.error("Sites Projects Fetch Error:", err);

    return (
      <div style={{ padding: 16, fontFamily: "system-ui" }}>
        <PageHeader
          title="Sites / Projects"
          subtitle="Operational sites management"
        />
        <div style={{ color: "red", marginTop: 12 }}>
          Failed to load sites/projects (network/server error)
        </div>
      </div>
    );
  }

  if (res.status === 403) {
    return (
      <div style={{ padding: 16, fontFamily: "system-ui" }}>
        <PageHeader
          title="Sites / Projects"
          subtitle="Operational sites management"
        />
        <div style={{ color: "#b91c1c", marginTop: 12 }}>
          Access restricted — subscription inactive
        </div>
      </div>
    );
  }

  if (!res.ok) {
    return (
      <div style={{ padding: 16, fontFamily: "system-ui" }}>
        <PageHeader title="Sites / Projects" subtitle="Error" />
        <div style={{ color: "red", marginTop: 12 }}>
          Failed to load sites/projects
        </div>
      </div>
    );
  }

  const json = await res.json();
  const parsed = parseSiteProjects(json);

  const items = parsed.data;
  const total = parsed.meta?.total ?? 0;

  return (
    <div style={{ padding: 16, fontFamily: "system-ui" }}>
      <PageHeader
        title="Sites / Projects Administration"
        subtitle="Operational sites management"
        action={
          canShowCreateAction ? (
            <Link href="/dashboard/sites-projects/new">
              + New Site / Project
            </Link>
          ) : undefined
        }
      />

      <div style={{ marginBottom: 12 }}>Total: {total}</div>

      {items.length === 0 ? (
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            background: "#ffffff",
            padding: 16,
            color: "#6b7280",
          }}
        >
          No sites/projects found.
        </div>
      ) : (
        <>
          <div className="desktop-only">
            <div style={{ overflowX: "auto" }}>
              <table style={{ minWidth: 600, width: "100%" }}>
                <tbody>
                  {items.map((i) => (
                    <tr key={i.id} style={{ borderTop: "1px solid #eee" }}>
                      <td style={{ padding: 8, whiteSpace: "nowrap" }}>
                        <Link href={`/dashboard/sites-projects/${i.id}`}>
                          {i.name}
                        </Link>
                      </td>

                      <td style={{ padding: 8 }}>
                        <span style={statusStyle(i.status)}>{i.status}</span>
                      </td>

                      <td
                        style={{
                          padding: 8,
                          maxWidth: 140,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {i.id}
                      </td>

                      <td style={{ padding: 8, whiteSpace: "nowrap" }}>
                        {formatDate(i.createdAt)}
                      </td>

                      <td style={{ padding: 8, whiteSpace: "nowrap" }}>
                        {formatDate(i.updatedAt)}
                      </td>

                      <td style={{ padding: 8, whiteSpace: "nowrap" }}>
                        <Link href={`/dashboard/sites-projects/${i.id}`}>
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mobile-only" style={{ marginTop: 12 }}>
            {items.map((i) => (
              <Link
                key={i.id}
                href={`/dashboard/sites-projects/${i.id}`}
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
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 6 }}>
                  {i.name}
                </div>

                <div style={{ marginBottom: 6 }}>
                  <span style={statusStyle(i.status)}>{i.status}</span>
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    marginBottom: 4,
                  }}
                >
                  {i.location ?? "-"}
                </div>

                <div style={{ fontSize: 12, color: "#9ca3af" }}>
                  {formatDate(i.createdAt)}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}