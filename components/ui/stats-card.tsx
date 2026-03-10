import React from "react";

type StatsCardProps = {
  label: string;
  value: number;
  helper?: string;
  href?: string;
};

function cardStyle() {
  return {
    display: "block",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 18,
    background: "#fff",
    textDecoration: "none",
    color: "#111",
  } as const;
}

export default function StatsCard({
  label,
  value,
  helper,
  href,
}: StatsCardProps) {
  const content = (
    <>
      <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
        {label}
      </div>

      <div style={{ fontSize: 34, fontWeight: 900 }}>
        {value}
      </div>

      {helper && (
        <div style={{ marginTop: 10, fontSize: 14, color: "#333" }}>
          {helper}
        </div>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} style={cardStyle()}>
        {content}
      </a>
    );
  }

  return (
    <div style={cardStyle()}>
      {content}
    </div>
  );
}
