import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decodeJwtPayload } from '@/src/auth/jwt';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value ?? null;

  const payload = decodeJwtPayload(accessToken);
  const role = payload?.role ?? null;

  // Server-side Role Guard
  if (role !== 'OWNER') {
    redirect('/dashboard');
  }

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>
        Admin Panel – OWNER Only
      </h1>

      <p style={{ marginTop: 12 }}>
        Server-side role protection active.
      </p>
    </div>
  );
}