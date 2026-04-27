// app/dashboard/safety-reports/[id]/page.tsx

export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import PageHeader from "@/components/ui/page-header";
import ErrorState from "@/components/ui/error-state";
import { serverAppFetch } from "@/src/lib/server-app-fetch";

type SafetyReport = {
  id: string;
  title: string | null;
  description: string | null;
  status: string | null;
  createdAt: string | null;
  siteProjectId?: string | null;
};

type PageProps = {
  params: { id: string } | Promise<{ id: string }>;
  searchParams?: { err?: string } | Promise<{ err?: string }>;
};

function normalize(v: unknown) {
  return String(v ?? "").trim();
}

function getStatusStyle(status?: string | null) {
  const s = String(status ?? "").toUpperCase();

  if (s === "OPEN") return { background: "#fef3c7", color: "#92400e" };
  if (s === "IN_PROGRESS") return { background: "#dbeafe", color: "#1e40af" };
  if (s === "CLOSED") return { background: "#dcfce7", color: "#166534" };

  return { background: "#e5e7eb", color: "#111827" };
}

function formatDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB").format(d);
}

export default async function SafetyReportPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearch = await Promise.resolve(searchParams ?? {});

  const id = normalize(resolvedParams?.id);
  if (!id) redirect("/dashboard/safety-reports");

  const token = await requireAccessToken();

  let res: Response;

  try {
    res = await serverAppFetch(
      `/api/safety-reports/${encodeURIComponent(id)}`,
      token,
      { cache: "no-store" }
    );
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") {
      redirect("/login");
    }

    console.error("Safety Report Fetch Error:", err);

    return (
      <div style={container}>
        <PageHeader title="Safety Report" subtitle="Report details" />
        <ErrorState message="Failed to load safety report (network/server error)" />
      </div>
    );
  }

  if (res.status === 401) redirect("/login");

  if (res.status === 404) {
    return (
      <div style={container}>
        <PageHeader title="Safety Report" subtitle="Report details" />
        <ErrorState message="Safety report not found" />
        <div style={{ marginTop: 20 }}>
          <Link href="/dashboard/safety-reports">Back</Link>
        </div>
      </div>
    );
  }

  if (!res.ok) {
    return (
      <div style={container}>
        <PageHeader title="Safety Report" subtitle="Report details" />
        <ErrorState message="Failed to load safety report" />
      </div>
    );
  }

  const report = (await res.json()) as SafetyReport;

  const err = normalize(resolvedSearch?.err);
  const statusStyle = getStatusStyle(report.status);

  return (
    <div style={container}>
      <PageHeader title="Safety Report" subtitle="Report details" />

      {err && <ErrorState message={err} />}

      <div style={{ marginBottom: 16 }}>
        <span style={{ padding: "6px 10px", borderRadius: 999, ...statusStyle }}>
          {report.status ?? "UNKNOWN"}
        </span>
      </div>

      <div style={card}>
        <div><b>ID:</b> {report.id}</div>
        <div><b>Title:</b> {report.title ?? "-"}</div>
        <div><b>Description:</b> {report.description ?? "-"}</div>
        <div><b>Site / Project:</b> {report.siteProjectId ?? "-"}</div>
        <div><b>Created At:</b> {formatDate(report.createdAt)}</div>
      </div>

      <div style={actionsRow}>
        <Link href={`/dashboard/safety-reports/${report.id}/edit`} style={primaryLink}>
          Edit
        </Link>

        <Link href="/dashboard/safety-reports" style={secondaryLink}>
          Back
        </Link>
      </div>
    </div>
  );
}

/* ================= STANDARD ================= */

const container: React.CSSProperties = {
  padding: 24, // ✅ unified
  fontFamily: "system-ui",
  maxWidth: 760,
  margin: "0 auto",
};

const card: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 16,
  display: "grid",
  gap: 8,
  background: "#fff",
};

const actionsRow: React.CSSProperties = {
  marginTop: 20,
  display: "flex",
  gap: 10,
};

const primaryLink: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 10,
  background: "#111",
  color: "#fff",
  textDecoration: "none",
};

const secondaryLink: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  textDecoration: "none",
  color: "#111",
};