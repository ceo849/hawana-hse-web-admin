// app/dashboard/sites-projects/page.tsx

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

type SiteProject = {
  id: string;
  name: string;
  location: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
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

function parseSiteProjects(value: unknown): SiteProject[] {
  if (Array.isArray(value)) return value.filter(isSiteProject);

  if (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as any).data)
  ) {
    return (value as any).data.filter(isSiteProject);
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
  }).format(d);
}

function style(bg: string, color: string, border: string) {
  return {
    background: bg,
    color,
    border: `1px solid ${border}`,
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    whiteSpace: "nowrap" as const,
  };
}

function getStatusStyle(status: string) {
  const s = status.toUpperCase();

  if (s === "ACTIVE") {
    return style("#dcfce7", "#166534", "#86efac");
  }

  return style("#f3f4f6", "#111827", "#d1d5db");
}

export default async function SitesProjectsPage() {
  const token = await requireAccessToken();

  const payload = decodeJwtPayload(token);
  const role: Role = (payload?.role as Role) ?? "UNKNOWN";

  const canManage =
    role === "OWNER" || role === "ADMIN" || role === "MANAGER";

  let res;

  try {
    res = await serverAppFetch("/api/sites-projects?page=1&limit=20", {
      cache: "no-store",
    });
  } catch (err) {
    console.error("Sites Projects Fetch Error:", err);

    return (
      <div style={{ padding: 16 }}>
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
      <div style={{ padding: 16 }}>
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
      <div style={{ padding: 16 }}>
        <PageHeader title="Sites / Projects" subtitle="Error" />
        <div style={{ color: "red", marginTop: 12 }}>
          Failed to load sites/projects
        </div>
      </div>
    );
  }

  const json = await res.json();
  const items = parseSiteProjects(json);

  return (
    <div style={{ padding: 16, fontFamily: "system-ui" }}>
      <PageHeader
        title="Sites / Projects Administration"
        subtitle="Operational sites management"
        action={
          canManage ? (
            <Link href="/dashboard/sites-projects/new">
              + New Site / Project
            </Link>
          ) : undefined
        }
      />

      <div style={{ marginBottom: 12 }}>Total: {items.length}</div>

      <div className="desktop-only">
        <div style={{ overflowX: "auto" }}>
          <table style={{ minWidth: 600, width: "100%" }}>
            <tbody>
              {items.map((i) => {
                const s = getStatusStyle(i.status);

                return (
                  <tr key={i.id} style={{ borderTop: "1px solid #eee" }}>
                    <td style={{ padding: 8, whiteSpace: "nowrap" }}>
                      <Link href={`/dashboard/sites-projects/${i.id}`}>
                        {i.name}
                      </Link>
                    </td>

                    <td style={{ padding: 8 }}>
                      <span style={s}>{i.status}</span>
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mobile-only" style={{ marginTop: 12 }}>
        {items.map((i) => {
          const s = getStatusStyle(i.status);

          return (
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
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 6 }}>
                {i.name}
              </div>

              <div style={{ marginBottom: 6 }}>
                <span style={s}>{i.status}</span>
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
          );
        })}
      </div>
    </div>
  );
}