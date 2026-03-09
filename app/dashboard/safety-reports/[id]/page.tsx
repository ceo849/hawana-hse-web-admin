// app/dashboard/safety-reports/[id]/page.tsx
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
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
    return {
      background: "#f3f4f6",
      color: "#111827",
      border: "1px solid #d1d5db",
    };
  }

  if (normalized === "IN_PROGRESS") {
    return {
      background: "#dbeafe",
      color: "#1d4ed8",
      border: "1px solid #93c5fd",
    };
  }

  if (normalized === "CLOSED") {
    return {
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #86efac",
    };
  }

  return {
    background: "#f3f4f6",
    color: "#111827",
    border: "1px solid #d1d5db",
  };
}

function getActionPlanStatusStyle(status?: string | null) {
  const normalized = String(status ?? "").toUpperCase();

  if (normalized === "OPEN") {
    return {
      background: "#f3f4f6",
      color: "#111827",
      border: "1px solid #d1d5db",
    };
  }

  if (normalized === "IN_PROGRESS") {
    return {
      background: "#dbeafe",
      color: "#1d4ed8",
      border: "1px solid #93c5fd",
    };
  }

  if (normalized === "COMPLETED") {
    return {
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #86efac",
    };
  }

  if (normalized === "VERIFIED") {
    return {
      background: "#dcfce7",
      color: "#14532d",
      border: "1px solid #4ade80",
    };
  }

  return {
    background: "#f3f4f6",
    color: "#111827",
    border: "1px solid #d1d5db",
  };
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

  if (assignedTo?.fullName) {
    return assignedTo.fullName;
  }

  if (assignedTo?.email) {
    return assignedTo.email;
  }

  if (assignedToUserId) {
    return assignedToUserId;
  }

  return "—";
}

export default async function SafetyReportDetailPage({ params }: PageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${host}`;

  const { id } = await params;
  const reportId = String(id ?? "").trim();

  if (!reportId) redirect("/dashboard/safety-reports");

  const srRes = await fetch(
    `${origin}/api/safety-reports/${encodeURIComponent(reportId)}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        cookie: cookieStore.toString(),
      },
    },
  );

  if (srRes.status === 401) redirect("/login");

  if (!srRes.ok) {
    const text = await safeText(srRes);

    return (
      <div style={{ fontFamily: "system-ui", padding: 24 }}>
        <PageHeader
          title="Safety Report"
          subtitle="View report details and linked corrective actions"
        />

        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: "#f7f7f7",
            borderRadius: 12,
            overflowX: "auto",
            whiteSpace: "pre-wrap",
          }}
        >{`Failed to load safety report (${srRes.status})
${text}`}</pre>

        <div style={{ marginTop: 14 }}>
          <a href="/dashboard/safety-reports" style={{ textDecoration: "underline" }}>
            Back to Safety Reports
          </a>
        </div>
      </div>
    );
  }

  const sr = (await srRes.json()) as SafetyReport;
  const statusStyle = getSafetyReportStatusStyle(sr.status);

  let actionPlans: ActionPlan[] = [];

  try {
    const apUrl = new URL(`${origin}/api/action-plans`);
    apUrl.searchParams.set("safetyReportId", sr.id);

    const apRes = await fetch(apUrl.toString(), {
      method: "GET",
      cache: "no-store",
      headers: {
        cookie: cookieStore.toString(),
      },
    });

    if (apRes.status === 401) redirect("/login");

    if (apRes.ok) {
      const all = (await apRes.json()) as ActionPlan[] | ActionPlansApiResponse;
      const raw = Array.isArray(all) ? all : Array.isArray(all?.data) ? all.data : [];

      actionPlans = raw
        .filter((ap) => ap?.safetyReportId === sr.id)
        .sort((a, b) =>
          String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")),
        );
    }
  } catch {
    actionPlans = [];
  }

  return (
    <div style={{ fontFamily: "system-ui", padding: 24, maxWidth: 960 }}>
      <PageHeader
        title="Safety Report"
        subtitle="View report details and linked corrective actions"
        action={
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a
              href={`/dashboard/action-plans/new?safetyReportId=${encodeURIComponent(sr.id)}`}
              style={{
                display: "inline-block",
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #111",
                background: "#111",
                color: "#fff",
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              + Create Action Plan
            </a>

            <a
              href={`/dashboard/safety-reports/${encodeURIComponent(sr.id)}/edit`}
              style={{
                display: "inline-block",
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "#fff",
                color: "#111",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Edit Report
            </a>

            <a
              href="/dashboard/safety-reports"
              style={{
                display: "inline-block",
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #ddd",
                background: "#fff",
                color: "#111",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Back
            </a>
          </div>
        }
      />

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            display: "inline-block",
            padding: "6px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 800,
            ...statusStyle,
          }}
        >
          {sr.status ?? "-"}
        </span>
      </div>

      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 12,
          padding: 16,
          background: "#fff",
        }}
      >
        <div style={{ display: "grid", gap: 10 }}>
          <Row label="ID" value={sr.id} />
          <Row label="Title" value={sr.title ?? "-"} />
          <Row label="Site / Project" value={formatSiteProject(sr.siteProject)} />
          <Row label="Status" value={sr.status ?? "-"} />
          <Row label="Description" value={sr.description ?? "-"} />
          <Row label="Created" value={formatDate(sr.createdAt)} />
          <Row label="Updated" value={formatDate(sr.updatedAt)} />
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>
          Related Action Plans
        </div>

        {actionPlans.length === 0 ? (
          <div
            style={{
              border: "1px dashed #d1d5db",
              borderRadius: 12,
              padding: 18,
              background: "#fafafa",
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 6 }}>
              No action plans linked yet
            </div>
            <div style={{ fontSize: 13, color: "#555", marginBottom: 12 }}>
              Create the first action plan for this safety report.
            </div>
            <a
              href={`/dashboard/action-plans/new?safetyReportId=${encodeURIComponent(sr.id)}`}
              style={{
                display: "inline-block",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #111",
                background: "#111",
                color: "#fff",
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              + Create Action Plan
            </a>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {actionPlans.map((ap) => {
              const actionPlanStatusStyle = getActionPlanStatusStyle(ap.status);

              return (
                <div
                  key={ap.id}
                  style={{
                    border: "1px solid #eee",
                    borderRadius: 12,
                    padding: 14,
                    background: "#fff",
                  }}
                >
                  <div style={{ fontWeight: 900 }}>{ap.title}</div>

                  <div style={{ marginTop: 10 }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "6px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 800,
                        ...actionPlanStatusStyle,
                      }}
                    >
                      {ap.status ?? "—"}
                    </span>
                  </div>

                  <div style={{ marginTop: 10, fontSize: 14 }}>
                    <b>Assigned To:</b>{" "}
                    {formatAssignedTo(ap.assignedTo, ap.assignedToUserId)}
                  </div>

                  <div style={{ marginTop: 8, fontSize: 14 }}>
                    <b>Due Date:</b> {formatDate(ap.dueDate)}
                  </div>

                  <div style={{ marginTop: 8, fontSize: 14 }}>
                    <b>Created:</b> {formatDate(ap.createdAt)}
                  </div>

                  <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <a
                      href={`/dashboard/action-plans/${encodeURIComponent(ap.id)}`}
                      style={{ textDecoration: "underline", color: "#111" }}
                    >
                      View
                    </a>

                    <a
                      href={`/dashboard/action-plans/${encodeURIComponent(ap.id)}/edit`}
                      style={{ textDecoration: "underline", color: "#111" }}
                    >
                      Edit
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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