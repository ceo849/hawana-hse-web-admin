import Link from 'next/link';

export type NavItem = {
  href: string;
  label: string;
};

type SidebarProps = {
  role: string;
  email?: string;
  navItems: NavItem[];
};

export default function Sidebar({ role, email, navItems }: SidebarProps) {
  return (
    <aside
      style={{
        width: 260,
        padding: 16,
        borderRight: '1px solid #eee',
        background: '#fafafa',
      }}
    >
      <div style={{ fontWeight: 800, fontSize: 18 }}>Hawana Admin</div>

      <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
        Phase 4 — Web Admin Skeleton
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: '#444' }}>
        <div>
          Role: <strong>{role}</strong>
        </div>
        {email && <div style={{ marginTop: 4 }}>{email}</div>}
      </div>

      <nav style={{ marginTop: 16, display: 'grid', gap: 8 }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              textDecoration: 'none',
              color: '#111',
              padding: '8px 10px',
              borderRadius: 10,
              border: '1px solid #eee',
              background: '#fff',
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}