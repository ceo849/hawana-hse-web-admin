'use client';

import { useState } from 'react';
import LogoutButton from '@/app/dashboard/logout-button';

type DashboardHeaderProps = {
  title: string;
};

export default function DashboardHeader({ title }: DashboardHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          borderBottom: '1px solid #e5e7eb',
          background: '#fff',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        {/* Left: Menu + Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10, // ↓ أقل = tighter SaaS spacing
          }}
        >
          {/* Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            style={{
              width: 40, // ↑ حجم قياسي
              height: 40,
              borderRadius: 10,
              border: '1px solid #e5e7eb',
              background: '#fff',
              cursor: 'pointer',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              fontSize: 20, // ↑ الأيقونة أوضح
              lineHeight: 1,
            }}
          >
            ☰
          </button>

          {/* Title */}
          <div
            style={{
              fontWeight: 600, // ↓ أقل حدة من 700
              fontSize: 18,    // ↑ أوضح
              letterSpacing: '-0.2px',
            }}
          >
            {title}
          </div>
        </div>

        {/* Right: Logout */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <LogoutButton />
        </div>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.25)', // ↓ أخف
            backdropFilter: 'blur(2px)',   // ✔ احترافي
            zIndex: 19,
          }}
        />
      )}
    </>
  );
}