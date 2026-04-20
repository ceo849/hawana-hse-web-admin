'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

// ✅ ADDITIVE
import LogoutButton from "@/app/dashboard/logout-button";

import {
  Home,
  AlertTriangle,
  Wrench,
  MoreHorizontal,
  MapPin,
  Users,
  Building2,
  Shield,
  Plus,
} from "lucide-react";

const MAIN_NAV = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/safety-reports", label: "Reports", icon: AlertTriangle },
  { href: "/dashboard/action-plans", label: "Actions", icon: Wrench },
];

const MORE_NAV = [
  { href: "/dashboard/sites-projects", label: "Sites", icon: MapPin },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/companies", label: "Companies", icon: Building2 },
  { href: "/dashboard/admin", label: "Admin Panel", icon: Shield },
];

const QUICK_ACTIONS = [
  { href: "/dashboard/safety-reports", label: "Safety Report" },
  { href: "/dashboard/action-plans", label: "Action Plan" },
  { href: "/dashboard/sites-projects", label: "Site" },
];

// ✅ ADDITIVE
function stopAll(e: React.MouseEvent) {
  e.stopPropagation();
}

export default function MobileBottomNav() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  // ✅ ADDITIVE
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Bottom Nav */}
      <div style={{
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
        zIndex: 1000,
      }}>
        {MAIN_NAV.map((item) => {
          const active = pathname === item.href;
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
              }}
            >
              {active && (
                <div style={{
                  position: "absolute",
                  top: -6,
                  width: 32,
                  height: 3,
                  background: "#111827",
                }} />
              )}

              <Icon size={26} strokeWidth={active ? 2.8 : 2} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={() => {
            setOpen(true);
            setFabOpen(false);
          }}
          style={{
            flex: 1,
            background: "none",
            border: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            fontSize: 12,
            color: "#9ca3af",
          }}
        >
          <MoreHorizontal size={26} />
          <span>More</span>
        </button>
      </div>

      {/* FAB */}
      <div
        onClick={() => {
          setFabOpen(!fabOpen);
          setOpen(false);
          navigator.vibrate?.(15);
        }}
        style={{
          position: "fixed",
          bottom: 90,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#111827",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1500,
        }}
      >
        <Plus size={24} color="#fff" />
      </div>

      {/* FAB MENU */}
      {fabOpen && (
        <div style={{
          position: "fixed",
          bottom: 160,
          right: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          zIndex: 1600,
        }}>
          {QUICK_ACTIONS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setFabOpen(false)}
              style={{
                background: "#fff",
                padding: "10px 14px",
                borderRadius: 10,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                textDecoration: "none",
                color: "#111",
                fontSize: 13,
              }}
            >
              + {item.label}
            </Link>
          ))}
        </div>
      )}

      {/* Drawer */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 2000,
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              stopAll(e); // ✅ ADDITIVE
            }}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {MORE_NAV.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 10px",
                    borderRadius: 10,
                    textDecoration: "none",
                    color: "#111827",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  <Icon size={22} />
                  {item.label}
                </Link>
              );
            })}

            {/* ✅ LOGOUT FIX */}
            {mounted && (
              <div
                onClick={(e) => e.stopPropagation()} // ✅ ADDITIVE
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <LogoutButton key={`logout-${open}`} />
              </div>
            )}

          </div>
        </div>
      )}

      {/* ROOT SAFE */}
      {mounted && (
        <div style={{ position: "fixed", bottom: -9999 }}>
          <LogoutButton key={`logout-root-${open}`} />
        </div>
      )}
    </>
  );
}