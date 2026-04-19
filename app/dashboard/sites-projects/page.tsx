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
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function style(bg: string, color: string, border: string) {
  return {
    background: bg,
    color,
    border: `1px solid ${border}`,
    padding: "4px 8px",
    borderRadius: 8,
    fontSize: 12,
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

  // ✅ FIX: correct serverAppFetch signature + correct path
  const res = await serverAppFetch(
    "/sites-projects?page=1&limit=20",
    token,
    {
      cache: "no-store",
    }
  );

  if (res.status === 401) redirect("/login");

  if (!res.ok) {
    if (res.status === 403) {
      return (
        <div style={{ padding: 24 }}>
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

    return (
      <div style={{ padding: 24 }}>
        <PageHeader title="Sites / Projects" subtitle="Error" />
        Failed to load
      </div>
    );
  }

  const json = await res.json();
  const items = parseSiteProjects(json);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
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

      <div>Total: {items.length}</div>

      <table>
        <tbody>
          {items.map((i) => {
            const s = getStatusStyle(i.status);

            return (
              <tr key={i.id}>
                <td>
                  <Link href={`/dashboard/sites-projects/${i.id}`}>
                    {i.name}
                  </Link>
                </td>

                <td>
                  <span style={s}>{i.status}</span>
                </td>

                <td>{i.id}</td>
                <td>{formatDate(i.createdAt)}</td>
                <td>{formatDate(i.updatedAt)}</td>

                <td>
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
  );
}