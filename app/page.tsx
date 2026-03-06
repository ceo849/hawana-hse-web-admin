'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/src/lib/api-client';

export default function Home() {
  const [status, setStatus] = useState('checking...');

  useEffect(() => {
    async function checkHealth() {
      try {
        const data = await apiClient.get<{ status: string }>('/health');
        setStatus(`OK: ${data.status}`);
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'status' in err) {
          const e = err as { status?: number };
          setStatus(`ERROR: ${e.status ?? 'unknown'}`);
        } else {
          setStatus('ERROR: unknown');
        }
      }
    }

    checkHealth();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800">
        API Status: {status}
      </h1>
    </div>
  );
}