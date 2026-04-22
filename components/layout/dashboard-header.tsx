'use client';

import { useEffect, useRef, useState } from 'react';
import LogoutButton from '@/app/dashboard/logout-button';

type DashboardHeaderProps = {
  title: string;
  onMenuClick: () => void;
};

export default function DashboardHeader({
  title,
  onMenuClick,
}: DashboardHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return;

      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

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
        gap: 8,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          minWidth: 0,
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
            minWidth: 44,
            minHeight: 44,
          }}
          aria-label="Open menu"
        >
          ☰
        </button>

        <div
          style={{
            fontWeight: 600,
            fontSize: 18,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 180,
          }}
        >
          {title}
        </div>
      </div>

      <div
        ref={menuRef}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <div
          onClick={() => setMenuOpen((prev) => !prev)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setMenuOpen((prev) => !prev);
            }
          }}
          aria-label="Open account menu"
          style={{
            minWidth: 44,
            minHeight: 44,
            padding: '0 12px',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            background: '#fff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: '#111827',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            U
          </div>

          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#111827',
            }}
          >
            Account
          </span>
        </div>

        {menuOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              width: 220,
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 14,
              boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
              padding: 10,
            }}
          >
            <LogoutButton />
          </div>
        )}
      </div>
    </header>
  );
}