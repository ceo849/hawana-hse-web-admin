'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/src/lib/api-client';

type LoginErrorPayload = {
  message?: string | string[];
  error?: string;
};

function normalizeNextPath(nextParam: string | null): string {
  // default
  if (!nextParam) return '/dashboard';

  // لازم يكون internal path فقط (يبدأ بـ /) لتجنب open redirect
  if (!nextParam.startsWith('/')) return '/dashboard';

  // منع تحويل إلى api أو login (حالات سيئة/غير مفيدة)
  if (nextParam.startsWith('/api')) return '/dashboard';
  if (nextParam.startsWith('/login')) return '/dashboard';

  return nextParam;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nextParam = searchParams.get('next');
  const nextPath = useMemo(() => normalizeNextPath(nextParam), [nextParam]);

  const [email, setEmail] = useState('viewer@hawana.com');
  const [password, setPassword] = useState('Hawana@2026');
  const [result, setResult] = useState<string>('');
  const [healthStatus, setHealthStatus] = useState<string>('checking...');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkHealth() {
      try {
        const data = await apiClient.get<{ status: string }>('/health');
        setHealthStatus(`OK: ${data.status}`);
      } catch {
        setHealthStatus('ERROR');
      }
    }
    checkHealth();
  }, []);

  function normalizeLoginError(data: LoginErrorPayload, status: number): string {
    if (Array.isArray(data?.message)) return data.message.join(' | ');
    if (typeof data?.message === 'string' && data.message.trim()) return data.message;
    if (typeof data?.error === 'string' && data.error.trim()) return data.error;
    return `Login failed (${status})`;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginErrorPayload = await r.json().catch(() => ({}));

      if (!r.ok) {
        throw new Error(normalizeLoginError(data, r.status));
      }

      // النجاح الحقيقي = cookies اتكتبت من route.ts (HttpOnly)
      router.replace(nextPath);
      router.refresh();
    } catch (err: any) {
      setResult(`ERROR: ${err?.message ?? 'unknown error'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-4 text-xl font-semibold">Hawana HSE Admin</h1>

        <div className="mb-6 rounded bg-gray-50 p-3 text-sm">
          API Status: <strong>{healthStatus}</strong>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              className="w-full rounded border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              inputMode="email"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              className="w-full rounded border px-3 py-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        {result && (
          <pre className="mt-4 whitespace-pre-wrap rounded bg-gray-50 p-3 text-sm">
            {result}
          </pre>
        )}
      </div>
    </div>
  );
}