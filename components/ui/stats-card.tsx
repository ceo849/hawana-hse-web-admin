import React from "react";

type StatsCardProps = {
  label: string;
  value: number;
  helper?: string;
  href?: string;
};

function cardStyle() {
  return {
    display: "flex",
    flexDirection: "column",

    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",

    border: "1px solid #e5e7eb",
    borderRadius: 12,

    padding: "12px 14px",
    background: "#fff",

    textDecoration: "none",
    color: "#111",

    minHeight: 72, // ✅ مستطيل مش مربع

    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",

    gap: 4,

    cursor: "pointer",
    transition: "all 0.2s ease",
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
      {/* Hover مرة واحدة */}
      <style>{`
        .stats-card:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 6px 16px rgba(0,0,0,0.06);
        }
      `}</style>

      {/* Label */}
      <div
        style={{
          fontSize: 11,
          color: "#6b7280",
          fontWeight: 500,
        }}
      >
        {label}
      </div>

      {/* Value */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#111827",
        }}
      >
        {value}
      </div>

      {/* Helper (اختياري) */}
      {helper && (
        <div
          style={{
            fontSize: 11,
            color: "#9ca3af",
          }}
        >
          {helper}
        </div>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} style={cardStyle()} className="stats-card">
        {content}
      </a>
    );
  }

  return (
    <div style={cardStyle()} className="stats-card">
      {content}
    </div>
  );
}