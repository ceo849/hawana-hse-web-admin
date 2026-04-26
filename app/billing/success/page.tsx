export default function BillingSuccessPage() {
  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Checkout completed</h1>

      <p style={{ marginTop: 12 }}>
        Your payment is being processed. Your subscription status will update shortly.
      </p>

      <div style={{ marginTop: 24 }}>
        <a href="/dashboard/billing">← Return to Billing</a>
      </div>
    </div>
  );
}