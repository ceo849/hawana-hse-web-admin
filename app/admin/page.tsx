import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decodeJwtPayload } from '@/src/auth/jwt';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value ?? null;

  // لو مفيش توكن: روح لوجن مباشرة (بدون لفّة على /dashboard)
  if (!accessToken) {
    redirect('/login?next=/admin');
  }

  const payload = decodeJwtPayload(accessToken);
  const role = payload?.role ?? null;

  // OWNER only — بدون redirect لتفادي loop
  if (role !== 'OWNER') {
    return (
      <div style={{ padding: 24, fontFamily: 'system-ui' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>403 — Forbidden</h1>
        <p style={{ marginTop: 10 }}>
          This page is OWNER only.
        </p>
        <a href="/dashboard" style={{ textDecoration: 'underline' }}>
          Back to Dashboard
        </a>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800 }}>
        Admin Panel — OWNER Only
      </h1>

      <p style={{ marginTop: 12 }}>
        Server-side role protection active.
      </p>
    </div>
  );
}