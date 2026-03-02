import LogoutButton from '@/app/dashboard/logout-button';

type DashboardHeaderProps = {
  title: string;
};

export default function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <header
      style={{
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        borderBottom: '1px solid #eee',
        background: '#fff',
      }}
    >
      <div style={{ fontWeight: 700 }}>{title}</div>
      <LogoutButton />
    </header>
  );
}