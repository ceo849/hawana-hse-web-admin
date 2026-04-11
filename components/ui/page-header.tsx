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

    justifyContent: "space-between", // ✔ توزيع طبيعي زي SaaS
    alignItems: "flex-start",

    border: "1px solid #e5e7eb",
    borderRadius: 16, // ✔ أنعم

    padding: "16px", // ✔ spacing أفضل
    background: "#fff",

    textDecoration: "none",
    color: "#111",

    minHeight: 96, // ✔ ارتفاع مريح
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
      {/* Top Section */}
      <div>
        {/* Label */}
        <div
          style={{
            fontSize: 12,
            color: "#6b7280",
            fontWeight: 500,
          }}
        >
          {label}
        </div>

        {/* Value */}
        <div
          style={{
            fontSize: 28, // ✔ أكبر وواضح زي الأنظمة العالمية
            fontWeight: 800,
            marginTop: 6,
          }}
        >
          {value}
        </div>
      </div>

      {/* Bottom Helper */}
      {helper && (
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
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
      <a href={href} style={cardStyle()}>
        {content}
      </a>
    );
  }

  return <div style={cardStyle()}>{content}</div>;
}