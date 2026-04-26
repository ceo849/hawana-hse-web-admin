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
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(17, 24, 39, 0.45)',
            zIndex: 1000,
          }}
        />
      )}

      <aside
        data-sidebar
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          width: 300,
          maxWidth: '82vw',
          height: '100vh',
          background: '#ffffff',
          padding: 18,
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.25s ease',
          boxShadow: isOpen ? '8px 0 24px rgba(0,0,0,0.18)' : 'none',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 18,
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: 22 }}>Hawana</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                HSE Platform
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close sidebar"
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                border: '1px solid #e5e7eb',
                background: '#fff',
                fontSize: 18,
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              padding: 12,
              borderRadius: 14,
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
            }}
          >
            <div style={{ fontSize: 12, color: '#6b7280' }}>Signed in as</div>
            <div style={{ marginTop: 4, fontWeight: 800 }}>{role}</div>
            {email && (
              <div
                style={{
                  marginTop: 4,
                  color: '#374151',
                  fontSize: 12,
                  wordBreak: 'break-word',
                }}
              >
                {email}
              </div>
            )}
          </div>
        </div>

        <nav style={{ display: 'grid', gap: 18 }}>
          {Object.entries(groups).map(([group, items]) => (
            <div key={group}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#9ca3af',
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                  marginBottom: 8,
                  paddingLeft: 4,
                }}
              >
                {group}
              </div>

              <div style={{ display: 'grid', gap: 8 }}>
                {items.map((item) => {
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
                        padding: '11px 12px',
                        borderRadius: 14,
                        textDecoration: 'none',
                        fontWeight: 700,
                        border: isActive
                          ? '1px solid #111827'
                          : '1px solid #f3f4f6',
                        background: isActive ? '#111827' : '#f9fafb',
                        color: isActive ? '#ffffff' : '#111827',
                        minHeight: 46,
                      }}
                    >
                      <span style={{ fontSize: 17 }}>{getIcon(item.label)}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div
          style={{
            marginTop: 'auto',
            paddingTop: 18,
            fontSize: 11,
            color: '#9ca3af',
          }}
        >
          Hawana HSE · SaaS Admin
        </div>
      </aside>
    </>
  );
}