'use client';

import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/sidebar';
import DashboardHeader from '@/components/layout/dashboard-header';
import { type SidebarNavItem } from '@/components/layout/sidebar';

type Props = {
  role: string;
  email?: string;
  navItems: SidebarNavItem[];
  children: React.ReactNode;
};

function getPageTitle(pathname: string): string {
  if (pathname === '/dashboard') return 'Dashboard';

  if (pathname.startsWith('/dashboard/users')) return 'Users';
  if (pathname.startsWith('/dashboard/companies')) return 'Companies';
  if (pathname.startsWith('/dashboard/sites-projects')) return 'Sites / Projects';
  if (pathname.startsWith('/dashboard/safety-reports')) return 'Safety Reports';
  if (pathname.startsWith('/dashboard/action-plans')) return 'Action Plans';
  if (pathname.startsWith('/dashboard/billing')) return 'Billing';
  if (pathname.startsWith('/dashboard/admin')) return 'Admin Panel';

  return 'Dashboard';
}

export default function DashboardShell({
  role,
  email,
  navItems,
  children,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const title = useMemo(() => getPageTitle(pathname), [pathname]);

  return (
    <>
      <Sidebar
        role={role}
        email={email}
        navItems={navItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <DashboardHeader
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main
          style={{
            padding: 16,
            maxWidth: 720,
            width: '100%',
            margin: '0 auto',
          }}
        >
          {children}
        </main>
      </div>
    </>
  );
}