import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui' }}>
      <aside
        style={{
          width: 240,
          padding: 16,
          borderRight: '1px solid #eee',
          background: '#fafafa',
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 18 }}>Hawana Admin</div>
        <div style={{ marginTop: 12, fontSize: 13, color: '#666' }}>
          Sidebar (Phase 4)
        </div>

        <nav style={{ marginTop: 16, display: 'grid', gap: 8 }}>
          <a href="/dashboard" style={{ textDecoration: 'none', color: '#111' }}>
            Dashboard
          </a>
        </nav>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            borderBottom: '1px solid #eee',
            background: '#fff',
          }}
        >
          <div style={{ fontWeight: 700 }}>Header</div>
        </header>

        <main style={{ padding: 24 }}>{children}</main>
      </div>
    </div>
  );
}
