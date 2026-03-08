import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    (typeof candidate.location === "string" || candidate.location === null) &&
    typeof candidate.status === "string" &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string"
  );
}

function parseSiteProjects(value: unknown): SiteProject[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isSiteProject);
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

export default async function SitesProjectsPage() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${host}`;

  const r = await fetch(`${origin}/api/sites-projects`, {
    cache: "no-store",
    headers: {
      cookie: h.get("cookie") ?? "",
    },
  });

  if (r.status === 401) redirect("/login");

  if (!r.ok) {
    const text = await r.text().catch(() => "");

    return (
      <div style={{ fontFamily: "system-ui" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Sites / Projects</h1>

        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: "#f7f7f7",
            borderRadius: 12,
            overflowX: "auto",
            whiteSpace: "pre-wrap",
          }}
        >{`Failed to load sites / projects (${r.status})
${text}`}</pre>
      </div>
    );
  }

  const json = (await r.json()) as unknown;
  const items = parseSiteProjects(json);

  return (
    <div style={{ fontFamily: "system-ui" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
          Sites / Projects
        </h1>

        <Link
          href="/dashboard/sites-projects/new"
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            background: "#111",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Create Site / Project
        </Link>
      </div>

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
              <th style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #eee" }}>
                Name
              </th>
              <th style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #eee" }}>
                Location
              </th>
              <th style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #eee" }}>
                Status
              </th>
              <th style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #eee" }}>
                Site / Project ID
              </th>
              <th style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #eee" }}>
                Created At
              </th>
              <th style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #eee" }}>
                Updated At
              </th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 12 }}>
                  No sites / projects found.
                </td>
              </tr>
            ) : (
              items.map((s) => (
                <tr key={s.id}>
                  <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                    <Link
                      href={`/dashboard/sites-projects/${s.id}`}
                      style={{
                        color: "#2563eb",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      {s.name}
                    </Link>
                  </td>

                  <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                    {s.location ?? "-"}
                  </td>

                  <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                    {s.status}
                  </td>

                  <td
                    style={{
                      padding: 12,
                      borderBottom: "1px solid #eee",
                      fontFamily: "monospace",
                      fontSize: 12,
                    }}
                  >
                    {s.id}
                  </td>

                  <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                    {formatDate(s.createdAt)}
                  </td>

                  <td style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                    {formatDate(s.updatedAt)}
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