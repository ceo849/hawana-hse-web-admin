import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import { serverAppFetch } from "@/src/lib/server-app-fetch";
import PageHeader from "@/components/ui/page-header";

type SafetyReportStatus = "OPEN" | "IN_PROGRESS" | "CLOSED" | string;

type SiteProjectLite = {
  id: string;
  name: string;
  location?: string | null;
};

type AssignedUserLite = {
  id: string;
  fullName?: string | null;
  email?: string | null;
};

type SafetyReport = {
  id: string;
  title?: string | null;
  description?: string | null;
  status?: SafetyReportStatus | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  siteProjectId?: string | null;
  siteProject?: SiteProjectLite | null;
};

type ActionPlanStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "VERIFIED"
  | string;

type ActionPlan = {
  id: string;
  title: string;
  status?: ActionPlanStatus | null;
  safetyReportId?: string | null;
  assignedToUserId?: string | null;
  assignedTo?: AssignedUserLite | null;
  dueDate?: string | null;
  createdAt?: string | null;
};

type ActionPlansApiResponse = {
  data?: ActionPlan[];
};

type PageProps = {
  params: Promise<{ id: string }>;
};

async function safeText(res: Response): Promise<string> {
  try {
    return (await res.text()).trim();
  } catch {
    return "";
  }
}

function getSafetyReportStatusStyle(status?: string | null) {
  const normalized = String(status ?? "").toUpperCase();

  if (normalized === "OPEN") {
    return { background: "#f3f4f6", color: "#111827", border: "1px solid #d1d5db" };
  }

  if (normalized === "IN_PROGRESS") {
    return { background: "#dbeafe", color: "#1d4ed8", border: "1px solid #93c5fd" };
  }

  if (normalized === "CLOSED") {
    return { background: "#dcfce7", color: "#166534", border: "1px solid #86efac" };
  }

  return { background: "#f3f4f6", color: "#111827", border: "1px solid #d1d5db" };
}

function getActionPlanStatusStyle(status?: string | null) {
  const normalized = String(status ?? "").toUpperCase();

  if (normalized === "OPEN") return { background: "#f3f4f6", color: "#111827", border: "1px solid #d1d5db" };
  if (normalized === "IN_PROGRESS") return { background: "#dbeafe", color: "#1d4ed8", border: "1px solid #93c5fd" };
  if (normalized === "COMPLETED") return { background: "#dcfce7", color: "#166534", border: "1px solid #86efac" };
  if (normalized === "VERIFIED") return { background: "#dcfce7", color: "#14532d", border: "1px solid #4ade80" };

  return { background: "#f3f4f6", color: "#111827", border: "1px solid #d1d5db" };
}

function formatSiteProject(siteProject?: SiteProjectLite | null) {
  if (!siteProject) return "-";
  if (siteProject.location) return `${siteProject.name} (${siteProject.location})`;
  return siteProject.name;
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function formatAssignedTo(
  assignedTo?: AssignedUserLite | null,
  assignedToUserId?: string | null,
) {
  if (assignedTo?.fullName && assignedTo?.email) {
    return `${assignedTo.fullName} — ${assignedTo.email}`;
  }
  if (assignedTo?.fullName) return assignedTo.fullName;
  if (assignedTo?.email) return assignedTo.email;
  if (assignedToUserId) return assignedToUserId;
  return "—";
}

function metricCard(label: string, value: string | number) {
  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, background: "#fff", padding: 16 }}>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 12 }}>
      <div style={{ fontWeight: 800 }}>{label}</div>
      <div>{value}</div>
    </div>
  );
}

export default async function SafetyReportDetailPage({ params }: PageProps) {
  const token = await requireAccessToken();
  const { id } = await params;
  const reportId = String(id ?? "").trim();

  if (!reportId) redirect("/dashboard/safety-reports");

  // ✅ FIX
  const srRes = await serverAppFetch(`/safety-reports/${encodeURIComponent(reportId)}`, token);

  if (srRes.status === 401) redirect("/login");

  if (!srRes.ok) {
    const text = await safeText(srRes);

    return (
      <div style={{ padding: 24 }}>
        <PageHeader title="Safety Report Overview" subtitle="Error loading report" />
        <pre>{`Failed (${srRes.status})\n${text}`}</pre>
      </div>
    );
  }

  const sr = (await srRes.json()) as SafetyReport;

  let actionPlans: ActionPlan[] = [];

  try {
    // ✅ FIX
    const apRes = await serverAppFetch("/action-plans", token);

    if (apRes.status === 401) redirect("/login");

    if (apRes.ok) {
      const all = (await apRes.json()) as ActionPlansApiResponse | ActionPlan[];

      const raw = Array.isArray(all)
        ? all
        : Array.isArray(all?.data)
        ? all.data
        : [];

      actionPlans = raw.filter((ap) => ap?.safetyReportId === sr.id);
    }
  } catch {
    actionPlans = [];
  }

  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="Safety Report Overview" subtitle="Full report view" />

      <div style={{ marginBottom: 12 }}>
        {metricCard("Action Plans", actionPlans.length)}
      </div>

      <Row label="Title" value={sr.title ?? "-"} />
      <Row label="Status" value={sr.status ?? "-"} />
      <Row label="Site" value={formatSiteProject(sr.siteProject)} />
      <Row label="Created" value={formatDate(sr.createdAt)} />

      <div style={{ marginTop: 20 }}>
        <Link href="/dashboard/safety-reports">Back</Link>
      </div>
    </div>
  );
}