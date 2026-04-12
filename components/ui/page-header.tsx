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
    <div style={{ marginBottom: 16 }}>
      {/* Title */}
      <h1
        style={{
          fontSize: 22,
          fontWeight: 700,
          margin: 0,
        }}
      >
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p
          style={{
            marginTop: 4,
            fontSize: 13,
            color: "#6b7280",
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Actions */}
      {action && (
        <div style={{ marginTop: 12 }}>
          {action}
        </div>
      )}
    </div>
  );
}