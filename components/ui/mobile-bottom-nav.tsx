'use client';

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";

const QUICK_ACTIONS = [
  { href: "/dashboard/safety-reports/new", label: "Safety Report" },
  { href: "/dashboard/action-plans/new", label: "Action Plan" },
  { href: "/dashboard/sites-projects/new", label: "Site / Project" },
];

export default function MobileBottomNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#111827",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          cursor: "pointer",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        }}
      >
        <Plus size={26} color="#fff" />
      </div>

      {/* Actions Menu */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            zIndex: 60,
          }}
        >
          {QUICK_ACTIONS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{
                background: "#fff",
                padding: "12px 16px",
                borderRadius: 12,
                boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                textDecoration: "none",
                color: "#111",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              + {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}