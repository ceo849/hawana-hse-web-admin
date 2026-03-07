import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type SiteProject = {
  id: string;
  name: string;
  location: string | null;
  status: string;
  createdAt: string;
};

export default async function SitesProjectsPage() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";

  const r = await fetch(`http://${host}/api/sites-projects`, {
    cache: "no-store",
    headers: {
      cookie: h.get("cookie") ?? "",
    },
  });

  if (r.status === 401) redirect("/login");

  const items: SiteProject[] = await r.json();

  return (
    <div style={{ fontFamily: "system-ui" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>
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
              <th style={{ textAlign: "left", padding: 12 }}>Name</th>
              <th style={{ textAlign: "left", padding: 12 }}>Location</th>
              <th style={{ textAlign: "left", padding: 12 }}>Status</th>
              <th style={{ textAlign: "left", padding: 12 }}>Created</th>
            </tr>
          </thead>

          <tbody>
            {items.map((s) => (
              <tr key={s.id}>
                <td style={{ padding: 12 }}>
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

                <td style={{ padding: 12 }}>
                  {s.location ?? "-"}
                </td>

                <td style={{ padding: 12 }}>
                  {s.status}
                </td>

                <td style={{ padding: 12 }}>
                  {new Date(s.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}