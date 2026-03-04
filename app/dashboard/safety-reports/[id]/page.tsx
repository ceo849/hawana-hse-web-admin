// app/dashboard/safety-reports/[id]/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const CORE_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:3001"
).replace(/\/$/, "");

type SafetyReport = {
  id: string;
  title?: string | null;
  description?: string | null;
  status?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  companyId?: string | null;
  siteProjectId?: string | null;
  incidentId?: string | null;
};

function getCookieValue(cookieStore: any, name: string): string | null {
  if (cookieStore && typeof cookieStore.get === "function") {
    return cookieStore.get(name)?.value ?? null;
  }
  if (Array.isArray(cookieStore)) {
    const hit = cookieStore.find((x: any) => Array.isArray(x) && x[0] === name);
    return hit?.[1]?.value ?? null;
  }
  if (cookieStore && typeof cookieStore[Symbol.iterator] === "function") {
    for (const entry of cookieStore as any) {
      if (Array.isArray(entry) && entry[0] === name) return entry?.[1]?.value ?? null;
    }
  }
  return null;
}

export default async function SafetyReportDetailPage(props: {
  params: any; // Next 16: ممكن تكون Promise
}) {
  const cookieStore = await cookies();
  const token = getCookieValue(cookieStore, "access_token");
  if (!token) redirect("/login");

  const p = props.params ? await props.params : {};
  const id = p?.id as string | undefined;
  if (!id) redirect("/dashboard/safety-reports");

  const res = await fetch(`${CORE_BASE_URL}/v1/safety-reports/${id}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 401) redirect("/login");
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return (
      <div style={{ fontFamily: "system-ui" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>
          Safety Report
        </h1>
        <pre
          style={{
            padding: 12,
            background: "#f7f7f7",
            borderRadius: 12,
            overflowX: "auto",
          }}
        >{`Failed to load safety report (${res.status})
${text}`}</pre>
      </div>
    );
  }

  const sr = (await res.json()) as SafetyReport;

  return (
    <div style={{ fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 34, fontWeight: 900, marginBottom: 10 }}>
        Safety Report
      </h1>

      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 14,
          padding: 16,
          background: "#fff",
          maxWidth: 900,
        }}
      >
        <div style={{ display: "grid", gap: 10 }}>
          <Row label="ID" value={sr.id} />
          <Row label="Title" value={sr.title ?? "-"} />
          <Row label="Status" value={sr.status ?? "-"} />
          <Row label="Description" value={sr.description ?? "-"} />
          <Row label="Created" value={sr.createdAt ?? "-"} />
          <Row label="Updated" value={sr.updatedAt ?? "-"} />
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <a href="/dashboard/safety-reports" style={{ textDecoration: "underline" }}>
          ← Back to Safety Reports
        </a>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 12 }}>
      <div style={{ fontWeight: 800, color: "#333" }}>{label}</div>
      <div style={{ color: "#111", wordBreak: "break-word" }}>{value}</div>
    </div>
  );
}