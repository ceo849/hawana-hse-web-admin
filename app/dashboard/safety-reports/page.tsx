// app/dashboard/safety-reports/page.tsx
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const CORE_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:3001'
).replace(/\/$/, '');

type SafetyReport = {
  id: string;
  title?: string | null;
  description?: string | null;
  status?: string | null;
  createdAt?: string | null;
};

type SafetyReportsResponse = {
  data: SafetyReport[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type SearchParams = {
  page?: string;
  limit?: string;
};

function toInt(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

async function safeText(res: Response): Promise<string> {
  try {
    return (await res.text()).trim();
  } catch {
    return '';
  }
}

export default async function SafetyReportsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value ?? null;

  if (!token) redirect('/login');

  const sp = (await searchParams) ?? {};
  const page = toInt(sp.page ?? '1', 1);
  const limit = Math.min(Math.max(toInt(sp.limit ?? '20', 20), 1), 100);

  const url = new URL(`${CORE_BASE_URL}/v1/safety-reports`);
  url.searchParams.set('page', String(page));
  url.searchParams.set('limit', String(limit));

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (res.status === 401) redirect('/login');

  if (!res.ok) {
    const text = await safeText(res);

    return (
      <div style={{ fontFamily: 'system-ui' }}>
        <Header />

        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: '#f7f7f7',
            borderRadius: 12,
            overflowX: 'auto',
          }}
        >{`Failed to load safety reports (${res.status})
${text}`}</pre>
      </div>
    );
  }

  const json = (await res.json()) as SafetyReportsResponse;
  const items = Array.isArray(json?.data) ? json.data : [];
  const meta = json?.meta ?? { total: 0, page, limit, totalPages: 1 };

  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <Header />

      <div
        style={{
          border: '1px solid #eee',
          borderRadius: 14,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 140px 180px 120px',
            gap: 12,
            padding: 14,
            fontWeight: 800,
            background: '#fafafa',
          }}
        >
          <div>Title</div>
          <div>Status</div>
          <div>Created</div>
          <div>Actions</div>
        </div>

        {items.length === 0 ? (
          <div style={{ padding: 14 }}>No safety reports.</div>
        ) : (
          items.map((report) => {
            const created = report.createdAt
              ? new Date(report.createdAt).toLocaleString()
              : '-';

            const status = (report.status ?? 'UNKNOWN').toUpperCase();

            return (
              <div
                key={report.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 140px 180px 120px',
                  gap: 12,
                  padding: 14,
                  borderTop: '1px solid #eee',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {report.title ?? 'Untitled'}
                  </div>
                  <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                    {report.description ?? '-'}
                  </div>
                </div>

                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      background: '#fff7ed',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    {status}
                  </span>
                </div>

                <div style={{ fontSize: 13, color: '#444' }}>{created}</div>

                <div>
                  <Link href={`/dashboard/safety-reports/${report.id}`}>
                    View
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ marginTop: 14, fontSize: 13, color: '#444' }}>
        Page {meta.page} / {meta.totalPages} — Total: {meta.total}
      </div>
    </div>
  );
}

function Header() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}
    >
      <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>
        Safety Reports
      </h1>

      <Link
        href="/dashboard/safety-reports/new"
        style={{
          padding: '10px 14px',
          borderRadius: 10,
          border: '1px solid #e5e7eb',
          textDecoration: 'none',
          fontWeight: 700,
        }}
      >
        New Safety Report
      </Link>
    </div>
  );
}