'use client';

import { useState } from 'react';
import LogoutButton from '@/app/dashboard/logout-button';

type DashboardHeaderProps = {
  title: string;
  onMenuClick: () => void;
};

export default function DashboardHeader({ title, onMenuClick }: DashboardHeaderProps) {
  return (
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
      {/* Left */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <button
          onClick={onMenuClick}
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            border: '1px solid #e5e7eb',
            background: '#fff',
            cursor: 'pointer',
            fontSize: 20,
          }}
        >
          ☰
        </button>

        <div
          style={{
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          {title}
        </div>
      </div>

      {/* Right */}
      <LogoutButton />
    </header>
  );
}