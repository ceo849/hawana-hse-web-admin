'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/src/lib/api-client';
import { login } from '@/src/auth/api';
import { authStorage } from '@/src/auth/storage';

export default function LoginPage() {
  const [email, setEmail] = useState('viewer@hawana.com');
  const [password, setPassword] = useState('Hawana@2026');
  const [result, setResult] = useState<string>('');
  const [healthStatus, setHealthStatus] = useState<string>('checking...');
  const [loading, setLoading] = useState(false);

  // 🔹 Contract Consumption Test (GET /v1/health)
  useEffect(() => {
    async function checkHealth() {
      try {
        const data = await apiClient.get<{ status: string; timestamp: string }>(
          '/health',
        );
        setHealthStatus(`OK: ${data.status}`);
      } catch (err: any) {
        setHealthStatus(`ERROR: ${err?.status ?? 'unknown'}`);
      }
    }

    checkHealth();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const data = await login({ email, password });

      const token = data?.access_token;
      if (!token) {
        setResult('ERROR: token missing in response');
        return;
      }

      authStorage.setAccessToken(token);

      if (data.refresh_token) {
        authStorage.setRefreshToken(data.refresh_token);
      }

      setResult(`SUCCESS: saved token, length = ${token.length}`);
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