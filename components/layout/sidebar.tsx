'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export type SidebarNavItem = {
  href: string;
  label: string;
};

type SidebarProps = {
  role: string;
  email?: string;
  navItems?: SidebarNavItem[];
};

function getIcon(label: string) {
  const icons: Record<string, string> = {
    Dashboard: '🏠',
    Users: '👥',
    Companies: '🏢',
    'Sites / Projects': '📍',
    'Safety Reports': '⚠️',
    'Action Plans': '🛠',
    Admin: '⚙️',
    'Admin Panel': '⚙️',
  };

  return icons[label] ?? '•';
}

export default function Sidebar({ role, email, navItems = [] }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const uniqueItems = Array.from(
    new Map(navItems.map((i) => [i.href, i])).values()
  );

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          top: 12,
          left: 12,
          width: 40,
          height: 40,
          borderRadius: 10,
          border: '1px solid #eee',
          background: '#fff',
          fontSize: 18,
          cursor: 'pointer',
          zIndex: 1100,
        }}
      >
        ☰
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            zIndex: 1099,
          }}
        />
      )}

      {/* Drawer */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: open ? 0 : -280,
          width: 260,
          height: '100vh',
          background: '#fff',
          padding: 20,
          zIndex: 1101,
          display: 'flex',
          flexDirection: 'column',
          transition: 'left 0.25s ease',
          boxShadow: open ? '2px 0 12px rgba(0,0,0,0.08)' : 'none',
        }}
      >
        {/* Top */}
        <div style={{ marginBottom: 20 }}>
          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            style={{
              alignSelf: 'flex-end',
              marginBottom: 10,
              background: 'none',
              border: 'none',
              fontSize: 18,
              cursor: 'pointer',
            }}
          >
            ✕
          </button>

          {/* Logo */}
          <div style={{ fontWeight: 800, fontSize: 18 }}>Hawana</div>
          <div style={{ fontSize: 12, color: '#777' }}>
            HSE Platform
          </div>
        </div>

        {/* User */}
        <div
          style={{
            padding: 10,
            borderRadius: 10,
            background: '#f9fafb',
            border: '1px solid #eee',
            fontSize: 12,
            marginBottom: 20,
          }}
        >
          <div>
            Role: <strong>{role}</strong>
          </div>
          {email && (
            <div style={{ marginTop: 4, color: '#555' }}>
              {email}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ display: 'grid', gap: 6 }}>
          {uniqueItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 10,
                  textDecoration: 'none',
                  fontWeight: 600,
                  border: isActive ? '1px solid #111' : '1px solid #eee',
                  background: isActive ? '#111' : '#fff',
                  color: isActive ? '#fff' : '#111',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: 16 }}>
                  {getIcon(item.label)}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          style={{
            marginTop: 'auto',
            fontSize: 11,
            color: '#999',
          }}
        >
          Hawana HSE Platform
        </div>
      </aside>
    </>
  );
}