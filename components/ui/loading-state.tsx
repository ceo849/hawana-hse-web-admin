export default function LoadingState({
    message = "Loading...",
  }: {
    message?: string;
  }) {
    return (
      <div style={container}>
        <div style={spinner} />
        <div style={text}>{message}</div>
      </div>
    );
  }
  
  /* ================= STYLES ================= */
  
  const container: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    background: "#fff",
    gap: 10,
  };
  
  const spinner: React.CSSProperties = {
    width: 24,
    height: 24,
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #111827",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };
  
  const text: React.CSSProperties = {
    fontSize: 13,
    color: "#6b7280",
  };