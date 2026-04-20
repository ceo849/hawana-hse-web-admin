'use client';

import React from "react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export default function PageHeader({
  title,
  subtitle,
  action,
}: PageHeaderProps) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "#ffffff",

        // subtle separation
        borderBottom: "1px solid #f1f5f9",

        // spacing system
        paddingTop: 12,
        paddingBottom: 10,
        marginBottom: 12,
      }}
    >
      {/* Top Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: 18,
            fontWeight: 700,
            margin: 0,
            color: "#111827",
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h1>

        {/* Action */}
        {action && (
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            {action}
          </div>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div
          style={{
            marginTop: 4,
            fontSize: 12,
            color: "#6b7280",
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}