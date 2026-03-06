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
};

export default function Sidebar({ role, email, navItems = [] }: SidebarProps) {
  const pathname = usePathname();

  const uniqueItems = Array.from(
    new Map(navItems.map((i) => [i.href, i])).values()
  );

  return (
    <aside
      style={{
        width: 260,
        padding: 16,
        borderRight: '1px solid #eee',
        background: '#fafafa',
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 18 }}>Hawana Admin</div>

      <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
        Phase 4 — Web Admin Skeleton
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: '#444' }}>
        <div>
          Role: <strong>{role}</strong>
        </div>
        {email && <div style={{ marginTop: 4 }}>{email}</div>}
      </div>

      <nav style={{ marginTop: 16, display: 'grid', gap: 8 }}>
        {uniqueItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href + '/'));

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: 'none',
                padding: '8px 10px',
                borderRadius: 10,
                border: '1px solid #eee',
                background: isActive ? '#111' : '#fff',
                color: isActive ? '#fff' : '#111',
                fontWeight: isActive ? 700 : 500,
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}