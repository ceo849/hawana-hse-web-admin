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

    border: "1px solid #e5e7eb",
    borderRadius: 12, // ↓ أقل من 16 (أكثر احترافية SaaS)

    padding: "16px",
    background: "#fff",

    textDecoration: "none",
    color: "#111",

    minHeight: 88,

    // subtle shadow زي الأنظمة العالمية
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",

    // spacing داخلي أفضل
    gap: 4,
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
      {/* Label */}
      <div
        style={{
          fontSize: 12,
          color: "#6b7280",
          fontWeight: 500,
          lineHeight: 1.2,
        }}
      >
        {label}
      </div>

      {/* Value */}
      <div
        style={{
          fontSize: 28, // ↑ أهم تعديل (hierarchy)
          fontWeight: 700,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>

      {/* Helper */}
      {helper && (
        <div
          style={{
            marginTop: 2,
            fontSize: 12,
            color: "#9ca3af",
            lineHeight: 1.2,
          }}
        >
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

  return <div style={cardStyle()}>{content}</div>;
}