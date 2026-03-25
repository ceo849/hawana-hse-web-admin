export default function BillingSuccessPage() {
    return (
      <div
        style={{
          fontFamily: "system-ui",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9fafb",
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 500,
            width: "100%",
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 24,
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>
            Subscription Started
          </h1>
  
          <p style={{ fontSize: 14, color: "#555", marginBottom: 20 }}>
            Your billing session was completed successfully. The backend will
            update your subscription status shortly.
          </p>
  
          <a
            href="/dashboard/billing"
            style={{
              display: "inline-block",
              padding: "10px 16px",
              borderRadius: 10,
              background: "#111",
              color: "#fff",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Back to Billing
          </a>
        </div>
      </div>
    );
  }