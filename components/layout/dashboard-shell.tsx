'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import DashboardHeader from '@/components/layout/dashboard-header';
import { type SidebarNavItem } from '@/components/layout/sidebar';

type Props = {
  role: string;
  email?: string;
  navItems: SidebarNavItem[];
  children: React.ReactNode;
};

export default function DashboardShell({
  role,
  email,
  navItems,
  children,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          title="Dashboard"
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
