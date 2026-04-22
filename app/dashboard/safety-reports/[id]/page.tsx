export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import PageHeader from "@/components/ui/page-header";

type SafetyReport = {
  id: string;
  title?: string | null;
  description?: string | null;
  status?: string | null;
  createdAt?: string | null;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

function isSafetyReport(value: unknown): value is SafetyReport {
  if (typeof value !== "object" || value === null) return false;

  const c = value as Record<string, unknown>;

  return (
    typeof c.id === "string" &&
    (typeof c.title === "string" || c.title === null || typeof c.title === "undefined") &&
    (typeof c.description === "string" ||
      c.description === null ||
      typeof c.description === "undefined") &&
    (typeof c.status === "string" || c.status === null || typeof c.status === "undefined") &&
    (typeof c.createdAt === "string" ||
      c.createdAt === null ||
      typeof c.createdAt === "undefined")
  );
}

function formatDate(value?: string | null): string {
  if (!value) return "-";

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

function getStatusStyle(status?: string | null) {
  const s = String(status ?? "UNKNOWN").toUpperCase();

  if (s === "OPEN") {
    return { background: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d" };
  }

  if (s === "IN_PROGRESS") {
    return { background: "#dbeafe", color: "#1e40af", border: "1px solid #93c5fd" };
  }

  if (s === "COMPLETED" || s === "VERIFIED" || s === "CLOSED") {
    return { background: "#dcfce7", color: "#166534", border: "1px solid #86efac" };
  }

  return { background: "#f3f4f6", color: "#111827", border: "1px solid #d1d5db" };
}

export default async function SafetyReportDetailsPage({
  params,
}: PageProps) {
  await requireAccessToken();

  const { id } = await params;
  const reportId = String(id ?? "").trim();

  if (!reportId) {
    redirect("/dashboard/safety-reports");
  }

  let res: Response;

  try {
    res = await serverAppFetch(
      `/api/safety-reports/${encodeURIComponent(reportId)}`,
      {
        cache: "no-store",
      }
    );
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") {
      redirect("/login");
    }

    console.error("Safety Report Details Fetch Error:", err);

    return (
      <div
        style={{
          padding: 24,
          fontFamily: "system-ui",
          maxWidth: 760,
          margin: "0 auto",
        }}
      >
        <PageHeader title="Safety Report" subtitle="Error" />
        <div style={{ color: "red", marginTop: 12 }}>
          Failed to load safety report (network/server error)
        </div>
      </div>
    );
  }

  if (res.status === 401) {
    redirect("/login");
  }

  if (res.status === 404) {
    return (
      <div
        style={{
          padding: 24,
          fontFamily: "system-ui",
          maxWidth: 760,
          margin: "0 auto",
        }}
      >
        <PageHeader title="Safety Report" subtitle="Report details" />
        <div style={{ marginTop: 12 }}>Report not found</div>
        <div style={{ marginTop: 16 }}>
          <Link href="/dashboard/safety-reports">Back to list</Link>
        </div>
      </div>
    );
  }

  if (!res.ok) {
    return (
      <div
        style={{
          padding: 24,
          fontFamily: "system-ui",
          maxWidth: 760,
          margin: "0 auto",
        }}
      >
        <PageHeader title="Safety Report" subtitle="Error" />
        <div style={{ color: "red", marginTop: 12 }}>
          Failed to load safety report
        </div>
        <div style={{ marginTop: 16 }}>
          <Link href="/dashboard/safety-reports">Back to list</Link>
        </div>
      </div>
    );
  }

  const json = await res.json();

  if (!isSafetyReport(json)) {
    return (
      <div
        style={{
          padding: 24,
          fontFamily: "system-ui",
          maxWidth: 760,
          margin: "0 auto",
        }}
      >
        <PageHeader title="Safety Report" subtitle="Invalid payload" />
        <div style={{ color: "red", marginTop: 12 }}>
          Safety report payload shape is invalid
        </div>
        <div style={{ marginTop: 16 }}>
          <Link href="/dashboard/safety-reports">Back to list</Link>
        </div>
      </div>
    );
  }

  const report = json;
  const statusStyle = getStatusStyle(report.status);

  return (
    <div
      style={{
        padding: 24,
        fontFamily: "system-ui",
        maxWidth: 760,
        margin: "0 auto",
      }}
    >
      <PageHeader
        title={report.title ?? "Safety Report"}
        subtitle="Report details"
      />

      <div style={{ marginBottom: 16 }}>
        <span
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            ...statusStyle,
          }}
        >
          {report.status ?? "UNKNOWN"}
        </span>
      </div>

      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 12,
          padding: 16,
          background: "#fff",
          display: "grid",
          gap: 12,
        }}
      >
        <div>
          <strong>Title:</strong> {report.title ?? "-"}
        </div>
        <div>
          <strong>Description:</strong> {report.description ?? "-"}
        </div>
        <div>
          <strong>Status:</strong> {report.status ?? "-"}
        </div>
        <div>
          <strong>Created At:</strong> {formatDate(report.createdAt)}
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <Link href={`/dashboard/safety-reports/${reportId}/edit`}>
          Edit
        </Link>

        <Link href="/dashboard/safety-reports">
          Back to list
        </Link>
      </div>
    </div>
  );
}