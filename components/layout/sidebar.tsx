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
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1000,
          background: '#111',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '8px 10px',
          cursor: 'pointer',
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
            background: 'rgba(0,0,0,0.4)',
            zIndex: 999,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          padding: 20,
          borderRight: '1px solid #e5e7eb',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'fixed',
          left: open ? 0 : -260,
          top: 0,
          zIndex: 1000,
          transition: 'left 0.25s ease',
        }}
      >
        {/* Close Button */}
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
        <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>
          Hawana
        </div>

        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 20 }}>
          HSE Administration
        </div>

        {/* User */}
        <div
          style={{
            padding: 12,
            borderRadius: 10,
            background: '#f9fafb',
            border: '1px solid #eee',
            fontSize: 13,
            marginBottom: 20,
          }}
        >
          <div>
            Role: <strong>{role}</strong>
          </div>
          {email && (
            <div style={{ marginTop: 4, color: '#555', fontSize: 12 }}>
              {email}
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ display: 'grid', gap: 6 }}>
          {uniqueItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href + '/'));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  textDecoration: 'none',
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: isActive ? '1px solid #111' : '1px solid #eee',
                  background: isActive ? '#111' : '#fff',
                  color: isActive ? '#fff' : '#111',
                  fontWeight: 600,
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
            paddingTop: 20,
          }}
        >
          Hawana HSE Platform
        </div>
      </aside>
    </>
  );
}