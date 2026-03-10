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
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 28,
        gap: 20,
        flexWrap: "wrap",
      }}
    >
      <div style={{ minWidth: 240 }}>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 800,
            margin: 0,
            letterSpacing: "-0.3px",
          }}
        >
          {title}
        </h1>

        {subtitle ? (
          <p
            style={{
              marginTop: 6,
              color: "#6b7280",
              fontSize: 14,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      {action ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {action}
        </div>
      ) : null}
    </div>
  );
}