'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import LogoutButton from '@/app/dashboard/logout-button';

type DashboardHeaderProps = {
  title: string;
  onMenuClick?: () => void; // ✅ FIX: optional
};

type MenuPosition = {
  top: number;
  right: number;
};

export default function DashboardHeader({
  title,
  onMenuClick,
}: DashboardHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({
    top: 64,
    right: 16,
  });

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!menuOpen || !triggerRef.current) return;

    function updateMenuPosition() {
      if (!triggerRef.current) return;

      const rect = triggerRef.current.getBoundingClientRect();

      setMenuPosition({
        top: rect.bottom + 8,
        right: Math.max(16, window.innerWidth - rect.right),
      });
    }

    updateMenuPosition();

    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);

    return () => {
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [menuOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      const clickedTrigger = triggerRef.current?.contains(target);
      const clickedMenu = menuRef.current?.contains(target);

      if (clickedTrigger || clickedMenu) return;

      setMenuOpen(false);
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
            onClick={onMenuClick ?? (() => {})} // ✅ FIX
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
          ref={triggerRef}
          style={{
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
        </div>
      </header>

      {mounted &&
        menuOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: menuPosition.top,
              right: menuPosition.right,
              width: 220,
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 14,
              boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
              padding: 10,
              zIndex: 9999,
            }}
          >
            <LogoutButton />
          </div>,
          document.body,
        )}
    </>
  );
}