export const dynamic = "force-dynamic";

import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

function getStatusStyle(status: string) {
  const s = status.toUpperCase();

  if (s === "ACTIVE") {
    return {
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #86efac",
    };
  }

  return {
    background: "#f3f4f6",
    color: "#111827",
    border: "1px solid #d1d5db",
  };
}

export default async function SitesProjectsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  const payload = decodeJwtPayload(token);
  const role: Role = (payload?.role as Role) ?? "UNKNOWN";

  const canManage =
    role === "OWNER" || role === "ADMIN" || role === "MANAGER";

  let items: SiteProject[] = [];

  try {
    const res = await serverAppFetch("/sites-projects", token);

    if (res.status === 401) redirect("/login");

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();
    items = parseSiteProjects(json);
  } catch (err) {
    console.error("SitesProjects Error:", err);

    return (
      <div style={{ padding: 24 }}>
        <PageHeader title="Sites / Projects" subtitle="Error" />
        Failed to load
      </div>
    );
  }

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
            const style = getStatusStyle(i.status);

            return (
              <tr key={i.id}>
                <td>
                  <Link href={`/dashboard/sites-projects/${i.id}`}>
                    {i.name}
                  </Link>
                </td>

                <td>
                  <span style={style}>{i.status}</span>
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