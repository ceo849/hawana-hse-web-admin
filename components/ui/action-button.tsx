'use client';

import React from "react";
import Link from "next/link";

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
    <Link
      href={href}
      className="action-btn"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        height: 54, // ✅ أفضل للمس
        width: "100%",

        borderRadius: 16,

        fontSize: 15,
        fontWeight: 600,
        letterSpacing: "-0.2px",

        textDecoration: "none",

        border: primary ? "1px solid #111827" : "1px solid #e5e7eb",
        background: primary ? "#111827" : "#ffffff",
        color: primary ? "#ffffff" : "#111827",

        // ✅ Elevation أفضل
        boxShadow: primary
          ? "0 8px 20px rgba(0,0,0,0.12)"
          : "0 4px 10px rgba(0,0,0,0.05)",

        WebkitTapHighlightColor: "transparent",

        transition: "transform 0.12s ease, box-shadow 0.12s ease",
      }}
    >
      {/* Active / Touch feedback */}
      <style>{`
        .action-btn:active {
          transform: scale(0.97);
          box-shadow: 0 3px 8px rgba(0,0,0,0.12);
        }
      `}</style>

      {children}
    </Link>
  );
}