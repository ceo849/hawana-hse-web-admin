'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      // حتى لو السيرفر رجع خطأ، نمنع بقاء المستخدم في dashboard
      if (!res.ok) {
        console.error('Logout failed:', res.status);
      }
    } catch (err) {
      console.error('Network logout error:', err);
    } finally {
      // نخرج المستخدم مهما حدث
      router.replace('/login');
      router.refresh();
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      style={{
        padding: '8px 14px',
        borderRadius: 10,
        border: '1px solid #ddd',
        backgroundColor: '#111',
        color: '#fff',
        fontSize: 14,
        fontWeight: 500,
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
}