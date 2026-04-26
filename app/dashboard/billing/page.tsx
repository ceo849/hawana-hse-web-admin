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
      <div style={{ padding: 24 }}>
        <PageHeader title="Billing" subtitle="Subscription status" />
        <div style={{ color: "red", marginTop: 12 }}>
          Failed to load billing (network error)
        </div>
      </div>
    );
  }

  if (res.status === 401) {
    redirect("/login");
  }

  if (!res.ok) {
    return (
      <div style={{ padding: 24 }}>
        <PageHeader title="Billing" subtitle="Subscription status" />
        <div style={{ color: "red", marginTop: 12 }}>
          Failed to load billing
        </div>
      </div>
    );
  }

  const json = await res.json();
  const billing = parseBilling(json);

  if (!billing) {
    return (
      <div style={{ padding: 24 }}>
        <PageHeader title="Billing" subtitle="Subscription status" />
        <div style={{ marginTop: 12 }}>No billing data</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, fontFamily: "system-ui" }}>
      <PageHeader title="Billing" subtitle="Subscription status" />

      <div style={{ marginTop: 16 }}>
        <div>
          <b>Plan:</b> {billing.plan}
        </div>
        <div>
          <b>Status:</b> {billing.status}
        </div>
        <div>
          <b>Trial Ends:</b> {formatDate(billing.trialEndsAt)}
        </div>
        <div>
          <b>Subscription Ends:</b> {formatDate(billing.subscriptionEndsAt)}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <form action={startCheckout}>
          <input type="hidden" name="plan" value="BASIC" />
          <button type="submit">Upgrade to BASIC</button>
        </form>
      </div>
    </div>
  );
}