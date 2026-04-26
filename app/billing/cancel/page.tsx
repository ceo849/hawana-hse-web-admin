export default function BillingCancelPage() {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        <h1>Checkout cancelled</h1>
  
        <p style={{ marginTop: 12 }}>
          Your checkout was not completed.
          You can try again anytime.
        </p>
  
        <div style={{ marginTop: 24 }}>
          <a href="/dashboard/billing">
            ← Return to Billing
          </a>
        </div>
      </div>
    );
  }