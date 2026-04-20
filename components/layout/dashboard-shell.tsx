'use client';

import { useState, useEffect } from 'react';
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

  // ✅ NEW: Detect Mobile (Additive only)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <>
      {/* ✅ Sidebar يظهر فقط على Desktop */}
      {!isMobile && (
        <Sidebar
          role={role}
          email={email}
          navItems={navItems}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {/* ❗ لا نكسر behavior */}
        <DashboardHeader
          title="Dashboard"
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* ✅ ADDITIVE: إخفاء زر الثلاث شرط في الموبايل فقط */}
        {isMobile && (
          <style>{`
            header button:first-of-type {
              display: none !important;
            }
          `}</style>
        )}

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