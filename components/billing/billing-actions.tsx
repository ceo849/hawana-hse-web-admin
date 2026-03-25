"use client";

import { useState } from "react";

type Plan = "BASIC" | "PROFESSIONAL" | "ENTERPRISE";

export default function BillingActions() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    if (!selectedPlan) {
      setError("Please select a plan");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/billing/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      if (res.status === 401) {
        setError("Your session has expired");
        return;
      }

      if (!res.ok) {
        setError("Unable to start billing session");
        return;
      }

      const data = await res.json();

      if (!data?.url) {
        setError("Invalid checkout response");
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 12, fontWeight: 700 }}>
        Select Plan
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        {(["BASIC", "PROFESSIONAL", "ENTERPRISE"] as Plan[]).map((plan) => (
          <button
            key={plan}
            type="button"
            onClick={() => setSelectedPlan(plan)}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border:
                selectedPlan === plan
                  ? "2px solid #111"
                  : "1px solid #ddd",
              background: selectedPlan === plan ? "#111" : "#fff",
              color: selectedPlan === plan ? "#fff" : "#111",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {plan}
          </button>
        ))}
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        style={{
          padding: "10px 16px",
          borderRadius: 10,
          border: "1px solid #111",
          background: "#111",
          color: "#fff",
          fontWeight: 800,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Processing..." : "Upgrade / Start Subscription"}
      </button>

      {error && (
        <div style={{ marginTop: 10, color: "#b91c1c", fontSize: 13 }}>
          {error}
        </div>
      )}
    </div>
  );
}