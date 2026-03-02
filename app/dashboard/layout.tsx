import type { ReactNode } from 'react';
import { cookies } from 'next/headers';

import Sidebar, { type SidebarNavItem } from '@/components/layout/sidebar';
import { decodeJwtPayload } from '@/src/auth/jwt';

import LogoutButton from './logout-button';

type Role = 'OWNER' | 'MANAGER' | 'WORKER' | 'VIEWER' | 'UNKNOWN';

type NavItem = SidebarNavItem & {
  roles: Role[];
};

const NAV: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', roles: ['OWNER', 'MANAGER', 'WORKER', 'VIEWER'] },
  { href: '/admin', label: 'Admin Panel', roles: ['OWNER'] },
];

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  const payload = decodeJwtPayload(accessToken ?? null);

  const role = (payload?.role as Role | undefined) ?? 'UNKNOWN';
  const email = payload?.email ?? undefined;

  const navItems: SidebarNavItem[] = NAV
    .filter((item) => item.roles.includes(role))
    .map(({ href, label }) => ({ href, label }));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui' }}>
      <Sidebar role={role} email={email} navItems={navItems} />

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