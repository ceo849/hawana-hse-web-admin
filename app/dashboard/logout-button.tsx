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

      if (!res.ok) {
        console.error('Logout failed:', res.status);
      }
    } catch (err) {
      console.error('Network logout error:', err);
    } finally {
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        height: 40,                // ✔ نفس نظام الهيدر
        padding: '0 14px',

        borderRadius: 10,
        border: '1px solid #e5e7eb',

        backgroundColor: '#111',
        color: '#fff',

        fontSize: 14,
        fontWeight: 600,          // ✔ أقوى بصريًا
        letterSpacing: '-0.2px',

        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,

        transition: 'all 0.15s ease',

        boxShadow: '0 1px 2px rgba(0,0,0,0.08)', // ✔ depth خفيف
      }}
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
}