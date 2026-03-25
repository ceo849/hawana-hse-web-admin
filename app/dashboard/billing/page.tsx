import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import PageHeader from "@/components/ui/page-header";
import BillingActions from "@/components/billing/billing-actions";
import { decodeJwtPayload } from "@/src/auth/jwt";
import { api } from "@/lib/core-api";

type Role = "OWNER" | "ADMIN" | "MANAGER" | "WORKER" | "VIEWER" | "UNKNOWN";

type CompanyBillingDto = {
  id: string;
  name: string;
  subscriptionPlan: string | null;
  subscriptionStatus: string | null;
  trialEndsAt: string | null;
  subscriptionEndsAt: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  updatedAt: string;
};

type CompaniesResponse = {
  data: CompanyBillingDto[];
};

function isCompanyBillingDto(value: unknown): value is CompanyBillingDto {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    (typeof candidate.subscriptionPlan === "string" ||
      candidate.subscriptionPlan === null) &&
    (typeof candidate.subscriptionStatus === "string" ||
      candidate.subscriptionStatus === null) &&
    (typeof candidate.trialEndsAt === "string" ||
      candidate.trialEndsAt === null) &&
    (typeof candidate.subscriptionEndsAt === "string" ||
      candidate.subscriptionEndsAt === null) &&
    (typeof candidate.stripeCustomerId === "string" ||
      candidate.stripeCustomerId === null) &&
    (typeof candidate.stripeSubscriptionId === "string" ||
      candidate.stripeSubscriptionId === null) &&
    typeof candidate.updatedAt === "string"
  );
}

function parseCompaniesResponse(value: unknown): CompaniesResponse {
  if (Array.isArray(value)) {
    return {
      data: value.filter(isCompanyBillingDto),
    };
  }

  if (typeof value !== "object" || value === null) {
    return { data: [] };
  }

  const candidate = value as Record<string, unknown>;

  return {
    data: Array.isArray(candidate.data)
      ? candidate.data.filter(isCompanyBillingDto)
      : [],
  };
}

function formatDateTime(value: string | null): string {
  if (!value) return "Not available";

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

function getStatusAppearance(status: string | null): {
  label: string;
  message: string;
  color: string;
  background: string;
  border: string;
} {
  switch (status) {
    case "ACTIVE":
      return {
        label: "ACTIVE",
        message: "Your subscription is active",
        color: "#166534",
        background: "#dcfce7",
        border: "#86efac",
      };

    case "TRIAL":
      return {
        label: "TRIAL",
        message: "You are currently in a trial period",
        color: "#1d4ed8",
        background: "#dbeafe",
        border: "#93c5fd",
      };

    case "SUSPENDED":
      return {
        label: "SUSPENDED",
        message: "Your subscription is suspended",
        color: "#991b1b",
        background: "#fee2e2",
        border: "#fca5a5",
      };

    case "CANCELLED":
      return {
        label: "CANCELLED",
        message: "Your subscription is cancelled",
        color: "#374151",
        background: "#f3f4f6",
        border: "#d1d5db",
      };

    default:
      return {
        label: status ?? "UNKNOWN",
        message: "Billing status is not available",
        color: "#374151",
        background: "#f3f4f6",
        border: "#d1d5db",
      };
  }
}

function getTrialRemainingDays(trialEndsAt: string | null): number | null {
  if (!trialEndsAt) return null;

  const end = new Date(trialEndsAt);
  if (Number.isNaN(end.getTime())) return null;

  const now = new Date();
  const diffMs = end.getTime() - now.getTime();
  const dayMs = 1000 * 60 * 60 * 24;

  return Math.ceil(diffMs / dayMs);
}

export default async function BillingPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  const payload = decodeJwtPayload(token);
  const currentRole: Role = (payload?.role as Role) ?? "UNKNOWN";

  if (currentRole !== "OWNER" && currentRole !== "ADMIN") {
    redirect("/dashboard");
  }

  const r = await fetch(`${api("/companies")}?page=1&limit=1`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (r.status === 401) redirect("/login");

  if (!r.ok) {
    const text = await r.text().catch(() => "");

    return (
      <div style={{ fontFamily: "system-ui", padding: 24 }}>
        <PageHeader
          title="Billing"
          subtitle="Subscription visibility and commercial status"
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
        >{`Failed to load billing data
${text}`}</pre>
      </div>
    );
  }

  const rawJson = (await r.json()) as unknown;
  const parsed = parseCompaniesResponse(rawJson);
  const company = parsed.data[0] ?? null;

  if (!company) {
    return (
      <div style={{ fontFamily: "system-ui", padding: 24 }}>
        <PageHeader
          title="Billing"
          subtitle="Subscription visibility and commercial status"
        />
        <div
          style={{
            padding: 16,
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            background: "#fff",
            color: "#444",
          }}
        >
          Billing information is not available right now.
        </div>
      </div>
    );
  }

  const statusAppearance = getStatusAppearance(company.subscriptionStatus);
  const trialDays =
    company.subscriptionStatus === "TRIAL"
      ? getTrialRemainingDays(company.trialEndsAt)
      : null;

  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <PageHeader
        title="Billing"
        subtitle="View your current subscription plan, status, and commercial account state."
      />

      {/* Plan + Status */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, background: "#fff", padding: 18 }}>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
            Current plan
          </div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>
            {company.subscriptionPlan ?? "Not available"}
          </div>
        </div>

        <div style={{ border: `1px solid ${statusAppearance.border}`, borderRadius: 14, background: statusAppearance.background, padding: 18 }}>
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            Subscription status
          </div>
          <div style={{ marginTop: 10, fontWeight: 800 }}>
            {statusAppearance.label}
          </div>
          <div style={{ marginTop: 6 }}>{statusAppearance.message}</div>
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          marginBottom: 16,
          padding: 18,
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          background: "#fff",
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>
          Actions
        </div>

        <BillingActions />

        <div style={{ marginTop: 10, fontSize: 13, color: "#6b7280" }}>
          The backend remains the source of truth. This UI only starts the checkout flow.
        </div>
      </div>
    </div>
  );
}