import React from "react";

type ActionButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

export default function ActionButton({
  href,
  children,
  variant = "primary",
}: ActionButtonProps) {
  const primary = variant === "primary";

  return (
    <a
      href={href}
      style={{
        display: "inline-block",
        padding: "10px 16px",
        borderRadius: 10,
        fontWeight: 700,
        textDecoration: "none",
        border: primary ? "1px solid #111" : "1px solid #ddd",
        background: primary ? "#111" : "#fff",
        color: primary ? "#fff" : "#111",
      }}
    >
      {children}
    </a>
  );
}
