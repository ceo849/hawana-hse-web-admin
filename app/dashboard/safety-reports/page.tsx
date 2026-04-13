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

type SafetyReport = {
  id: string;
  title: string | null;
  description: string | null;
  status: string | null;
  createdAt: string | null;
};

function isSafetyReport(value: unknown): value is SafetyReport {
  if (typeof value !== "object" || value === null) return false;

  const c = value as Record<string, unknown>;

  return (
    typeof c.id === "string" &&
    (typeof c.title === "string" || c.title === null) &&
    (typeof c.description === "string" || c.description === null) &&
    (typeof c.status === "string" || c.status === null) &&
    (typeof c.createdAt === "string" || c.createdAt === null)
  );
}

function parse(value: unknown): SafetyReport[] {
  if (Array.isArray(value)) return value.filter(isSafetyReport);

  if (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as any).data)
  ) {
    return (value as any).data.filter(isSafetyReport);
  }

  return [];
}

export default async function SafetyReportsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  const payload = decodeJwtPayload(token);
  const role: Role = (payload?.role as Role) ?? "UNKNOWN";

  let items: SafetyReport[] = [];

  const res = await serverAppFetch(
    "/safety-reports?page=1&limit=20",
    token
  );

  // ✅ مهم: خارج أي try/catch
  if (res.status === 401) {
    redirect("/login");
  }

  if (!res.ok) {
    return <div>Failed to load safety reports</div>;
  }

  const json = await res.json();
  items = parse(json);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <PageHeader
        title="Safety Reports"
        subtitle="Operational reports"
      />

      <div style={{ marginBottom: 12 }}>
        Total: {items.length}
      </div>

      <table style={{ width: "100%" }}>
        <tbody>
          {items.map((r) => (
            <tr key={r.id}>
              <td>{r.title ?? "-"}</td>
              <td>{r.status ?? "-"}</td>
              <td>{r.createdAt ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}