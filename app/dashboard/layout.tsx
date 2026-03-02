
import type { ReactNode } from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { decodeJwtPayload } from '@/src/auth/jwt';
import LogoutButton from './logout-button';

type NavItem = {
  href: string;
  label: string;
  roles: string[];
};

const NAV: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    roles: ['OWNER', 'MANAGER', 'WORKER', 'VIEWER'],
  },
  {
    href: '/admin',
    label: 'Admin Panel',
    roles: ['OWNER'],
  },
];

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value ?? null;

  const payload = decodeJwtPayload(accessToken);
  const role = payload?.role ?? 'UNKNOWN';
  const email = payload?.email ?? '';

  const visibleNav = NAV.filter((item) => item.roles.includes(role));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui' }}>
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
          {visibleNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                textDecoration: 'none',
                color: '#111',
                padding: '8px 10px',
                borderRadius: 10,
                border: '1px solid #eee',
                background: '#fff',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            borderBottom: '1px solid #eee',
            background: '#fff',
          }}
        >
          <div style={{ fontWeight: 700 }}>Dashboard</div>
          <LogoutButton />
        </header>

        <main style={{ padding: 24 }}>{children}</main>
      </div>
    </div>
  );
}