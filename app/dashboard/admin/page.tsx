export default function AdminPage() {
    return (
      <div style={{ padding: 40, fontFamily: "system-ui" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>
          Admin Panel
        </h1>
  
        <p style={{ color: "#555", fontSize: 14 }}>
          System administration tools will appear here.
        </p>
  
        <div
          style={{
            marginTop: 20,
            padding: 20,
            border: "1px dashed #ccc",
            borderRadius: 10,
            background: "#fafafa",
          }}
        >
          <strong>Planned tools</strong>
  
          <ul style={{ marginTop: 10 }}>
            <li>Role management</li>
            <li>System settings</li>
            <li>Audit access</li>
            <li>Platform administration</li>
          </ul>
        </div>
      </div>
    );
  }