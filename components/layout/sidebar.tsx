'use client';

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
  onClose: () => void;
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

export default function Sidebar({
  role,
  email,
  navItems = [],
  isOpen,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  const uniqueItems = Array.from(
    new Map(navItems.map((i) => [i.href, i])).values()
  );

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            zIndex: 1000,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          width: 260,
          height: '100vh',
          background: '#fff',
          padding: 20,
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.25s ease',
          boxShadow: isOpen ? '2px 0 12px rgba(0,0,0,0.15)' : 'none',

          // ✅ ADDITIVE: mobile scroll fix
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Top */}
        <div style={{ marginBottom: 20 }}>
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              alignSelf: 'flex-end',
              marginBottom: 10,
              background: 'none',
              border: 'none',
              fontSize: 18,
              cursor: 'pointer',

              // ✅ ADDITIVE: better touch target
              padding: 6,
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
                onClick={onClose}
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

                  // ✅ ADDITIVE: better mobile tap
                  minHeight: 44,
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