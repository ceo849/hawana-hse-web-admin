// app/dashboard/sites-projects/page.tsx

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
      fontWeight: 700,
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
    fontWeight: 700,
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
    res = await serverAppFetch(
      "/api/sites-projects?page=1&limit=20",
      token,
      { cache: "no-store" }
    );
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") {
      redirect("/login");
    }

    console.error("Sites Projects Fetch Error:", err);

    return (
      <div style={container}>
        <PageHeader
          title="Sites / Projects"
          subtitle="Operational sites management"
        />
        <div style={errorBox}>
          Failed to load sites/projects (network/server error)
        </div>
      </div>
    );
  }

  if (res.status === 401) redirect("/login");

  if (res.status === 403) {
    return (
      <div style={container}>
        <PageHeader
          title="Sites / Projects"
          subtitle="Operational sites management"
        />
        <div style={restrictedBox}>
          Access restricted — subscription inactive
        </div>
      </div>
    );
  }

  if (!res.ok) {
    return (
      <div style={container}>
        <PageHeader
          title="Sites / Projects"
          subtitle="Operational sites management"
        />
        <div style={errorBox}>Failed to load sites/projects</div>
      </div>
    );
  }

  const json = await res.json();
  const parsed = parseSiteProjects(json);

  const items = parsed.data;
  const total = parsed.meta?.total ?? 0;

  return (
    <div style={container}>
      <PageHeader
        title="Sites / Projects"
        subtitle="Operational sites management"
        action={
          canShowCreateAction ? (
            <Link href="/dashboard/sites-projects/new" style={headerAction}>
              + New Site / Project
            </Link>
          ) : undefined
        }
      />

      <section style={section}>
        <div style={sectionHeader}>
          <div style={sectionTitle}>Sites Register</div>
          <div style={sectionMeta}>Total: {total}</div>
        </div>

        {items.length === 0 ? (
          <div style={emptyBox}>
            <div style={emptyText}>No sites/projects found.</div>
          </div>
        ) : (
          <>
            <div className="desktop-only">
              <div style={tableCard}>
                <table style={{ minWidth: 600, width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    {items.map((i) => (
                      <tr key={i.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                        <td style={titleCell}>
                          <Link href={`/dashboard/sites-projects/${i.id}`} style={rowLink}>
                            {i.name}
                          </Link>
                        </td>

                        <td style={td}>
                          <span style={statusStyle(i.status)}>{i.status}</span>
                        </td>

                        <td style={mutedCell}>{i.location ?? "-"}</td>
                        <td style={td}>{formatDate(i.createdAt)}</td>
                        <td style={td}>{formatDate(i.updatedAt)}</td>

                        <td style={td}>
                          <Link href={`/dashboard/sites-projects/${i.id}`} style={rowLink}>
                            Open
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mobile-only" style={{ display: "grid", gap: 10 }}>
              {items.map((i) => (
                <Link key={i.id} href={`/dashboard/sites-projects/${i.id}`} style={siteCard}>
                  <div style={siteTop}>
                    <div style={siteName}>{i.name}</div>
                    <span style={statusStyle(i.status)}>{i.status}</span>
                  </div>

                  <div style={siteLocation}>{i.location ?? "-"}</div>
                  <div style={siteDate}>Created: {formatDate(i.createdAt)}</div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

/* styles */
const container: React.CSSProperties = { padding: 16, fontFamily: "system-ui", maxWidth: 680, margin: "0 auto" };
const section: React.CSSProperties = { marginTop: 18, display: "grid", gap: 10 };
const sectionHeader: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 };
const sectionTitle: React.CSSProperties = { fontSize: 13, fontWeight: 700, color: "#6b7280" };
const sectionMeta: React.CSSProperties = { fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" };
const headerAction: React.CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "8px 12px", borderRadius: 12, background: "#111827", color: "#ffffff", textDecoration: "none", fontSize: 13, fontWeight: 700 };
const tableCard: React.CSSProperties = { overflowX: "auto", background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" };
const td: React.CSSProperties = { padding: "10px 8px", whiteSpace: "nowrap", fontSize: 13 };
const titleCell: React.CSSProperties = { ...td, fontWeight: 700 };
const mutedCell: React.CSSProperties = { ...td, color: "#6b7280", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis" };
const rowLink: React.CSSProperties = { color: "#111827", fontWeight: 700, textDecoration: "none" };
const siteCard: React.CSSProperties = { display: "block", padding: 14, borderRadius: 16, border: "1px solid #e5e7eb", textDecoration: "none", color: "inherit", background: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" };
const siteTop: React.CSSProperties = { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 };
const siteName: React.CSSProperties = { fontWeight: 800, fontSize: 15, color: "#111827" };
const siteLocation: React.CSSProperties = { marginTop: 10, paddingTop: 10, borderTop: "1px solid #f3f4f6", fontSize: 12, color: "#6b7280" };
const siteDate: React.CSSProperties = { marginTop: 4, fontSize: 12, color: "#9ca3af" };

const emptyBox: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 16,
  background: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const emptyText: React.CSSProperties = {
  color: "#6b7280",
  fontSize: 13,
  fontWeight: 500,
};

const errorBox: React.CSSProperties = { color: "#991b1b", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: 12, marginTop: 12, fontSize: 13 };
const restrictedBox: React.CSSProperties = { color: "#92400e", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: 12, marginTop: 12, fontSize: 13 };