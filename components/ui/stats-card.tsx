'use client';

import React from "react";
import Link from "next/link";

type StatsCardProps = {
  label: string;
  value: number;
  helper?: string;
  href?: string;
};

function cardStyle() {
  return {
    display: "flex",
    flexDirection: "column" as const,

    justifyContent: "center",
    alignItems: "flex-start", // ✅ بدل center → Mobile natural

    border: "1px solid #e5e7eb",
    borderRadius: 16, // ✅ زيادة الاحترافية

    padding: "14px 16px",
    background: "#ffffff",

    textDecoration: "none",
    color: "#111827",

    minHeight: 80,

    // ✅ Elevation أفضل
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",

    gap: 6,

    cursor: "pointer",

    // ✅ Touch optimization
    WebkitTapHighlightColor: "transparent",

    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  };
}

export default function StatsCard({
  label,
  value,
  helper,
  href,
}: StatsCardProps) {
  const content = (
    <>
      {/* Active / Touch feedback */}
      <style>{`
        .stats-card:active {
          transform: scale(0.98);
          box-shadow: 0 3px 10px rgba(0,0,0,0.08);
        }
      `}</style>

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
          fontSize: 26, // ✅ أوضح للموبايل
          fontWeight: 700,
          color: "#111827",
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>

      {/* Helper */}
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
      <Link href={href} style={cardStyle()} className="stats-card">
        {content}
      </Link>
    );
  }

  return (
    <div style={cardStyle()} className="stats-card">
      {content}
    </div>
  );
}