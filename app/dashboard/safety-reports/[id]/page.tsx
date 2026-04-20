export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
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
  params: { id: string }; // ✅ FIX (no Promise)
};

export default async function SafetyReportDetailsPage({
  params,
}: PageProps) {
  const token = await requireAccessToken();

  const reportId = String(params.id ?? "").trim();

  if (!reportId) redirect("/dashboard/safety-reports");

  let sr: SafetyReport | null = null;

  let res;

  try {
    // ✅ FIX: correct signature
    res = await serverAppFetch(
      `/safety-reports/${encodeURIComponent(reportId)}`,
      token,
      { cache: "no-store" }
    );
  } catch (err) {
    console.error("Details Fetch Error:", err);

    return (
      <div style={{ padding: 24 }}>
        <PageHeader title="Safety Report" subtitle="Error" />
        Failed to load
      </div>
    );
  }

  if (res.status === 401) redirect("/login");

  if (res.ok) {
    sr = (await res.json()) as SafetyReport;
  } else if (res.status === 404) {
    // ✅ fallback safe (no breaking)
    const listRes = await serverAppFetch(
      `/safety-reports?page=1&limit=50`,
      token,
      { cache: "no-store" }
    );

    if (listRes.ok) {
      const listJson = await listRes.json();
      const list = Array.isArray(listJson)
        ? listJson
        : listJson.data ?? [];

      sr = list.find((r: any) => r.id === reportId) ?? null;
    }
  }

  if (!sr) {
    return <div style={{ padding: 24 }}>Report not found</div>;
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 760 }}>
      <PageHeader
        title={sr.title ?? "Safety Report"}
        subtitle="Report details"
      />

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
        <div><strong>Title:</strong> {sr.title ?? "-"}</div>
        <div><strong>Description:</strong> {sr.description ?? "-"}</div>
        <div><strong>Status:</strong> {sr.status ?? "-"}</div>
        <div><strong>Created At:</strong> {sr.createdAt ?? "-"}</div>
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