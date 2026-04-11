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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        height: 52,
        width: "100%",

        borderRadius: 14,

        fontSize: 15,
        fontWeight: 600,
        letterSpacing: "-0.2px", // ✔ تحسين قراءة

        textDecoration: "none",

        border: primary ? "1px solid #111" : "1px solid #e5e7eb",
        background: primary ? "#111" : "#fff",
        color: primary ? "#fff" : "#111",

        boxShadow: primary
          ? "0 2px 6px rgba(0,0,0,0.12)"
          : "0 1px 2px rgba(0,0,0,0.04)", // ✔ حتى secondary له depth خفيف

        WebkitTapHighlightColor: "transparent", // ✔ تحسين موبايل

        transition: "all 0.15s ease",
      }}
    >
      {children}
    </a>
  );
}