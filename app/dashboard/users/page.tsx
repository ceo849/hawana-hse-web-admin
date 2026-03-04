// app/dashboard/users/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type UserDto = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
};

type UsersResponse = {
  data: UserDto[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export default async function UsersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  // بوابة دخول: بدون توكن = Redirect
  if (!token) {
    redirect('/login');
  }

  const r = await fetch('http://localhost:3000/api/users', {
    method: 'GET',
    cache: 'no-store',
    headers: {
      cookie: cookieStore.toString(),
    },
  });

  if (!r.ok) {
    const text = await r.text().catch(() => '');
    return (
      <div style={{ fontFamily: 'system-ui' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Users</h1>
        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: '#f7f7f7',
            borderRadius: 12,
          }}
        >
{`Failed to load users (${r.status})
${text}`}
        </pre>
      </div>
    );
  }

  // هنا التصحيح المهم
  const json = (await r.json()) as UsersResponse;
  const users: UserDto[] = Array.isArray(json?.data) ? json.data : [];

  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800 }}>Users</h1>

      <div
        style={{
          marginTop: 16,
          border: '1px solid #eee',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th
                style={{
                  textAlign: 'left',
                  padding: 12,
                  borderBottom: '1px solid #eee',
                }}
              >
                Full Name
              </th>
              <th
                style={{
                  textAlign: 'left',
                  padding: 12,
                  borderBottom: '1px solid #eee',
                }}
              >
                Email
              </th>
              <th
                style={{
                  textAlign: 'left',
                  padding: 12,
                  borderBottom: '1px solid #eee',
                }}
              >
                Role
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: 12 }}>
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                    {u.fullName}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                    {u.email}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #eee' }}>
                    {u.role}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}