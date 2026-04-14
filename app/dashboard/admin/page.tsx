import { redirect } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
import StatsCard from "@/components/ui/stats-card";
import { requireAccessToken } from "@/lib/server-auth";
import { decodeJwtPayload } from "@/src/auth/jwt";

export default async function AdminPage() {
  const token = await requireAccessToken();
  const payload = decodeJwtPayload(token);
  const role = String(payload?.role ?? "UNKNOWN").toUpperCase();

  // 🔐 RBAC
  if (role !== "OWNER") {
    redirect("/dashboard");
  }

  const CORE_API =
    (process.env.NEXT_PUBLIC_API_BASE_URL ??
      "http://localhost:3001").replace(/\/$/, "");

  let users = 0;
  let reports = 0;
  let plans = 0;

  try {
    const [u, r, p] = await Promise.all([
      fetch(`${CORE_API}/v1/users?page=1&limit=1`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
      fetch(`${CORE_API}/v1/safety-reports?page=1&limit=1`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
      fetch(`${CORE_API}/v1/action-plans?page=1&limit=1`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
    ]);

    if (u.status === 401 || r.status === 401 || p.status === 401) {
      redirect("/login");
    }

    // USERS
    if (u.ok) {
      const j = await u.json();
      users = j?.meta?.total ?? 0;
    }

    // REPORTS
    if (r.ok) {
      const j = await r.json();
      reports = j?.meta?.total ?? 0;
    }

    // PLANS
    if (p.ok) {
      const j = await p.json();
      plans = j?.meta?.total ?? 0;
    }

  } catch (e) {
    console.error("Admin fallback error:", e);
  }

  return (
    <div style={container}>
      <PageHeader
        title="Platform Admin"
        subtitle="System overview"
      />

      {/* صف 1 */}
      <div style={grid}>
        <StatsCard label="Users" value={users} />
        <StatsCard label="Reports" value={reports} />
      </div>

      {/* صف 2 */}
      <div style={grid}>
        <StatsCard label="Plans" value={plans} />
      </div>
    </div>
  );
}

const container: React.CSSProperties = {
  padding: 24,
  fontFamily: "system-ui",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
};