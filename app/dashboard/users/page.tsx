// app/dashboard/users/page.tsx
import { cookies } from 'next/headers';

type UserDto = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
};

export default async function UsersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  // لازم URL مطلق في الـ Server
  const CORE_BASE =
    (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:3001').replace(/\/$/, '');

  const r = await fetch(`${CORE_BASE}/v1/users`, {
    method: 'GET',
    cache: 'no-store',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!r.ok) {
    const text = await r.text().catch(() => '');
    return (
      <div style={{ fontFamily: 'system-ui' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Users</h1>
        <pre style={{ marginTop: 16, padding: 12, background: '#f7f7f7', borderRadius: 12 }}>
{`Failed to load users (${r.status})
${text}`}
        </pre>
      </div>
    );
  }

  const users = (await r.json()) as UserDto[];

  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800 }}>Users</h1>

      <div style={{ marginTop: 16, border: '1px solid #eee', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #eee' }}>Full Name</th>
              <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #eee' }}>Email</th>
              <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #eee' }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{u.fullName}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{u.email}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}