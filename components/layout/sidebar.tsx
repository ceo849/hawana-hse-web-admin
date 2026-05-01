'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type SidebarNavItem = {
  href: string;
  label: string;
};

type SidebarProps = {
  role: string;
  email?: string;
  navItems?: SidebarNavItem[];

  isOpen: boolean;

  // ✅ FIX: optional بدل required
  onClose?: () => void;

  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

function getIcon(label: string) {
  const icons: Record<string, string> = {
    Dashboard: '🏠',
    Users: '👥',
    Companies: '🏢',
    'Sites / Projects': '📍',
    'Safety Reports': '⚠️',
    'Action Plans': '🛠',
    Billing: '💳',
    'Admin Panel': '⚙️',
  };

  return icons[label] ?? '•';
}

function getGroup(label: string) {
  if (['Dashboard', 'Users', 'Companies', 'Sites / Projects'].includes(label)) {
    return 'Core';
  }

  if (['Safety Reports', 'Action Plans'].includes(label)) {
    return 'Operations';
  }

  return 'System';
}

export default function Sidebar({
  role,
  email,
  navItems = [],
  isOpen,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  const uniqueItems = Array.from(
    new Map(navItems.map((i) => [i.href, i])).values(),
  );

  const groups = uniqueItems.reduce<Record<string, SidebarNavItem[]>>(
    (acc, item) => {
      const group = getGroup(item.label);
      acc[group] = acc[group] ?? [];
      acc[group].push(item);
      return acc;
    },
    {},
  );

  return (
    <>
      {isOpen && (
        <div
          onClick={() => onClose?.()} // ✅ FIX
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(17, 24, 39, 0.42)',
            zIndex: 1000,
          }}
        />
      )}

      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          width: 288,
          maxWidth: '84vw',
          height: '100vh',
          background: '#ffffff',
          padding: 16,
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.25s ease',
          boxShadow: isOpen ? '8px 0 24px rgba(0,0,0,0.16)' : 'none',
          overflowY: 'auto',
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: 20 }}>Hawana</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 1 }}>
                HSE Platform
              </div>
            </div>

            <button
              onClick={() => onClose?.()} // ✅ FIX
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                background: '#fff',
                fontSize: 17,
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              padding: 11,
              borderRadius: 14,
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
            }}
          >
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>
              Signed in as
            </div>
            <div style={{ marginTop: 4, fontWeight: 800, fontSize: 15 }}>
              {role}
            </div>
            {email && (
              <div style={{ marginTop: 3, color: '#4b5563', fontSize: 12 }}>
                {email}
              </div>
            )}
          </div>
        </div>

        <nav style={{ display: 'grid', gap: 14 }}>
          {Object.entries(groups).map(([group, items]) => (
            <div key={group}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#9ca3af',
                  marginBottom: 7,
                }}
              >
                {group}
              </div>

              <div style={{ display: 'grid', gap: 7 }}>
                {items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + '/');

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => onClose?.()} // ✅ FIX
                      prefetch={false}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 11px',
                        borderRadius: 13,
                        textDecoration: 'none',
                        fontSize: 15,
                        fontWeight: 700,
                        border: isActive
                          ? '1px solid #111827'
                          : '1px solid #f3f4f6',
                        background: isActive ? '#111827' : '#f9fafb',
                        color: isActive ? '#ffffff' : '#111827',
                      }}
                    >
                      <span style={{ width: 22 }}>
                        {getIcon(item.label)}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: 16, fontSize: 11 }}>
          Hawana HSE · SaaS Admin
        </div>
      </aside>
    </>
  );
}