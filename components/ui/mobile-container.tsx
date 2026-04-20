'use client';

import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function MobileContainer({ children }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        background: '#f3f4f6',
        minHeight: '100vh',
      }}
    >
      {/* App Frame */}
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#ffffff',

          // iPhone feel
          borderRadius: 24,
          overflow: 'hidden',

          // subtle elevation
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',

          // prevent content overflow issues
          position: 'relative',
        }}
      >
        {/* Safe Area Top */}
        <div
          style={{
            height: 'env(safe-area-inset-top)',
            background: '#ffffff',
          }}
        />

        {/* Scrollable Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',

            // padding system (mobile optimized)
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 12,
            paddingBottom: `calc(16px + env(safe-area-inset-bottom))`,
            boxSizing: 'border-box',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}