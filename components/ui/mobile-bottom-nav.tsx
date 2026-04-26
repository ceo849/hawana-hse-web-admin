'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  AlertTriangle,
  Wrench,
} from "lucide-react";

const MAIN_NAV = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/safety-reports", label: "Reports", icon: AlertTriangle },
  { href: "/dashboard/action-plans", label: "Actions", icon: Wrench },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 76,
        padding: "10px 16px",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(229,231,235,0.8)",
        boxShadow: "0 -6px 20px rgba(0,0,0,0.06)",
        display: "flex",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      {MAIN_NAV.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => navigator.vibrate?.(10)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: active ? 700 : 500,
              color: active ? "#111827" : "#9ca3af",
              position: "relative",
              textDecoration: "none",
            }}
          >
            {active && (
              <div
                style={{
                  position: "absolute",
                  top: -6,
                  width: 32,
                  height: 3,
                  background: "#111827",
                }}
              />
            )}

            <Icon size={26} strokeWidth={active ? 2.8 : 2} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}