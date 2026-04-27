import React from "react";

type Props = {
  status?: string | null;
};

function getStyle(status?: string | null): React.CSSProperties {
  const s = String(status ?? "").toUpperCase();

  if (s === "OPEN") {
    return { background: "#fef3c7", color: "#92400e" };
  }

  if (s === "IN_PROGRESS") {
    return { background: "#dbeafe", color: "#1e40af" };
  }

  if (s === "COMPLETED") {
    return { background: "#dcfce7", color: "#166534" };
  }

  if (s === "VERIFIED" || s === "CLOSED") {
    return { background: "#bbf7d0", color: "#14532d" };
  }

  if (s === "ACTIVE") {
    return { background: "#dcfce7", color: "#166534" };
  }

  if (s === "INACTIVE" || s === "SUSPENDED") {
    return { background: "#f3f4f6", color: "#111827" };
  }

  return { background: "#e5e7eb", color: "#111827" };
}

export default function StatusBadge({ status }: Props) {
  const style = getStyle(status);

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: 12,
        fontWeight: 700,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {status ?? "UNKNOWN"}
    </span>
  );
}