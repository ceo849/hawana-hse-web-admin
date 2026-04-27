export default function EmptyState({
    message = "No data available",
  }: {
    message?: string;
  }) {
    return (
      <div style={container}>
        <div style={text}>{message}</div>
      </div>
    );
  }
  
  /* ================= STYLES ================= */
  
  const container: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 14,
    background: "#fff",
    textAlign: "center",
  };
  
  const text: React.CSSProperties = {
    fontSize: 13,
    color: "#6b7280",
  };