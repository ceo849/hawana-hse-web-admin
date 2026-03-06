'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type ApiErrorBody = {
  statusCode?: number;
  message?: string | string[];
  error?: string;
  path?: string;
  timestamp?: string;
};

function extractErrorMessage(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return 'Request failed';

  try {
    const parsed = JSON.parse(trimmed) as ApiErrorBody;
    const message = parsed.message;

    if (Array.isArray(message)) return message.join('\n');
    if (typeof message === 'string' && message.trim()) return message;

    if (typeof parsed.error === 'string' && parsed.error.trim()) {
      return parsed.error;
    }
  } catch {
    // non-JSON response
  }

  return trimmed;
}

export default function NewSafetyReportPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = useMemo(() => {
    return title.trim().length > 0 && !loading;
  }, [title, loading]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/safety-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
        }),
      });

      if (response.status === 401) {
        router.push('/login');
        router.refresh();
        return;
      }

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(
          extractErrorMessage(text) || `Failed (${response.status})`,
        );
      }

      router.push('/dashboard/safety-reports');
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unexpected error';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: 720 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0 }}>
          Create Safety Report
        </h1>
        <div style={{ marginTop: 8, color: '#555', fontSize: 14 }}>
          Create a new safety report (server-side validation enforced).
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
        <div>
          <label style={{ fontWeight: 700, display: 'block' }}>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g., Unsafe condition near loading area"
            style={{
              width: '100%',
              marginTop: 6,
              padding: 12,
              borderRadius: 10,
              border: '1px solid #d1d5db',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 700, display: 'block' }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            placeholder="Details..."
            style={{
              width: '100%',
              marginTop: 6,
              padding: 12,
              borderRadius: 10,
              border: '1px solid #d1d5db',
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>

        {error && (
          <pre
            style={{
              margin: 0,
              padding: 12,
              borderRadius: 12,
              background: '#fff5f5',
              border: '1px solid #fecaca',
              color: '#991b1b',
              fontSize: 13,
              whiteSpace: 'pre-wrap',
            }}
          >
            {error}
          </pre>
        )}

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              border: 'none',
              background: '#111',
              color: '#fff',
              fontWeight: 800,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              opacity: canSubmit ? 1 : 0.6,
              minWidth: 180,
            }}
          >
            {loading ? 'Creating...' : 'Create / Submit'}
          </button>

          <Link
            href="/dashboard/safety-reports"
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              textDecoration: 'none',
              fontWeight: 800,
              color: '#111',
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}