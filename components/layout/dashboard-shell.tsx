'use client';

import { useState } from 'react'; // ✅ ADD
import { type SidebarNavItem } from '@/components/layout/sidebar';
import Sidebar from '@/components/layout/sidebar';
import DashboardHeader from '@/components/layout/dashboard-header';

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
  const title = 'Dashboard';

  // ✅ ADD (state management)
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Sidebar
        role={role}
        email={email}
        navItems={navItems}
        isOpen={isOpen} // ✅ UPDATED
        onClose={() => setIsOpen(false)} // ✅ ADD
      />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <DashboardHeader
          title={title}
          onMenuClick={() => setIsOpen(true)} // ✅ ADD
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