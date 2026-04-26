// app/dashboard/billing/page.tsx

export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { requireAccessToken } from "@/lib/server-auth";
import PageHeader from "@/components/ui/page-header";
import { serverAppFetch } from "@/src/lib/server-app-fetch";

type BillingDto = {
  plan: string;
  status: string;
  trialEndsAt: string | null;
  subscriptionEndsAt: string | null;
};

function parseBilling(value: unknown): BillingDto | null {
  if (typeof value !== "object" || value === null) return null;

  const c = value as Record<string, unknown>;

  if (typeof c.plan !== "string" || typeof c.status !== "string") {
    return null;
  }

  return {
    plan: c.plan,
    status: c.status,
    trialEndsAt: typeof c.trialEndsAt === "string" ? c.trialEndsAt : null,
    subscriptionEndsAt:
      typeof c.subscriptionEndsAt === "string" ? c.subscriptionEndsAt : null,
  };
}

function formatDate(value: string | null) {
  if (!value) return "-";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

function statusStyle(status: string): React.CSSProperties {
  const s = status.toUpperCase();

  if (s === "ACTIVE") {
    return {
      background: "#dcfce7",
      color: "#166534",
      border: "1px solid #86efac",
    };
  }

  if (s === "TRIAL") {
    return {
      background: "#dbeafe",
      color: "#1e40af",
      border: "1px solid #93c5fd",
    };
  }

  if (s === "SUSPENDED" || s === "CANCELLED") {
    return {
      background: "#fee2e2",
      color: "#991b1b",
      border: "1px solid #fecaca",
    };
  }

  return {
    background: "#f3f4f6",
    color: "#111827",
    border: "1px solid #d1d5db",
  };
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      style={{
        ...statusStyle(status),
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

export default async function BillingPage() {
  await requireAccessToken();

  async function startCheckout(formData: FormData) {
    "use server";

    const plan = String(formData.get("plan") ?? "");

    const res = await serverAppFetch("/api/billing/checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan }),
    });

    if (res.status === 401) {
      redirect("/login");
    }

    if (!res.ok) {
      redirect("/dashboard/billing");
    }

    const data = await res.json().catch(() => null);

    if (data?.url) {
      redirect(String(data.url));
    }

    redirect("/dashboard/billing");
  }

  let res: Response;

  try {
    res = await serverAppFetch("/api/billing", {
      cache: "no-store",
    });
  } catch (err: any) {
    if (err?.message === "SESSION_EXPIRED") {
      redirect("/login");
    }

    return (
      <div style={container}>
        <PageHeader title="Billing" subtitle="Subscription status" />
        <div style={errorBox}>Failed to load billing (network error)</div>
      </div>
    );
  }

  if (res.status === 401) {
    redirect("/login");
  }

  if (!res.ok) {
    return (
      <div style={container}>
        <PageHeader title="Billing" subtitle="Subscription status" />
        <div style={errorBox}>Failed to load billing</div>
      </div>
    );
  }

  const json = await res.json();
  const billing = parseBilling(json);

  if (!billing) {
    return (
      <div style={container}>
        <PageHeader title="Billing" subtitle="Subscription status" />
        <div style={emptyBox}>No billing data</div>
      </div>
    );
  }

  return (
    <div style={container}>
      <PageHeader title="Billing" subtitle="Subscription status" />

      <section style={section}>
        <div style={sectionHeader}>
          <div style={sectionTitle}>Current Subscription</div>
          <StatusBadge status={billing.status} />
        </div>

        <div style={billingCard}>
          <div style={billingRow}>
            <span style={label}>Plan</span>
            <strong style={value}>{billing.plan}</strong>
          </div>

          <div style={billingRow}>
            <span style={label}>Status</span>
            <strong style={value}>{billing.status}</strong>
          </div>

          <div style={billingRow}>
            <span style={label}>Trial Ends</span>
            <strong style={value}>{formatDate(billing.trialEndsAt)}</strong>
          </div>

          <div style={billingRow}>
            <span style={label}>Subscription Ends</span>
            <strong style={value}>
              {formatDate(billing.subscriptionEndsAt)}
            </strong>
          </div>
        </div>
      </section>

      <section style={section}>
        <div style={sectionTitle}>Plan Upgrade</div>

        <form action={startCheckout}>
          <input type="hidden" name="plan" value="BASIC" />
          <button type="submit" style={upgradeButton}>
            Upgrade to BASIC
          </button>
        </form>
      </section>
    </div>
  );
}

const container: React.CSSProperties = {
  padding: 16,
  fontFamily: "system-ui",
  maxWidth: 680,
  margin: "0 auto",
};

const section: React.CSSProperties = {
  marginTop: 18,
  display: "grid",
  gap: 10,
};

const sectionHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#6b7280",
};

const billingCard: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  overflow: "hidden",
};

const billingRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "12px 14px",
  borderBottom: "1px solid #f3f4f6",
};

const label: React.CSSProperties = {
  fontSize: 12,
  color: "#6b7280",
  fontWeight: 600,
};

const value: React.CSSProperties = {
  fontSize: 13,
  color: "#111827",
  textAlign: "right",
};

const upgradeButton: React.CSSProperties = {
  width: "100%",
  border: "none",
  borderRadius: 14,
  background: "#111827",
  color: "#ffffff",
  padding: "13px 16px",
  fontSize: 14,
  fontWeight: 800,
  cursor: "pointer",
};

const errorBox: React.CSSProperties = {
  color: "#991b1b",
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: 12,
  padding: 12,
  marginTop: 12,
  fontSize: 13,
};

const emptyBox: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  background: "#ffffff",
  padding: 14,
  color: "#6b7280",
  fontSize: 13,
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};