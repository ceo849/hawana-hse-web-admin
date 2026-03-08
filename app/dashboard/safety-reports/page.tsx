// app/dashboard/safety-reports/page.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const CORE_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:3001'
).replace(/\/$/, '');

type SafetyReport = {
  id: string;
  title: string | null;
  description: string | null;
  status: string | null;
  createdAt: string | null;
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
  status?: string;
};

function isSafetyReport(value: unknown): value is SafetyReport {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    (typeof candidate.title === 'string' || candidate.title === null) &&
    (typeof candidate.description === 'string' ||
      candidate.description === null) &&
    (typeof candidate.status === 'string' || candidate.status === null) &&
    (typeof candidate.createdAt === 'string' || candidate.createdAt === null)
  );
}

function parseSafetyReportsResponse(value: unknown): SafetyReportsResponse {
  if (typeof value !== 'object' || value === null) {
    return { data: [], meta: undefined };
  }

  const candidate = value as Record<string, unknown>;
  const data = Array.isArray(candidate.data)
    ? candidate.data.filter(isSafetyReport)
    : [];

  const metaRaw =
    typeof candidate.meta === 'object' && candidate.meta !== null
      ? (candidate.meta as Record<string, unknown>)
      : null;

  const meta = metaRaw
    ? {
        total:
          typeof metaRaw.total === 'number' ? metaRaw.total : data.length,
        page: typeof metaRaw.page === 'number' ? metaRaw.page : 1,
        limit: typeof metaRaw.limit === 'number' ? metaRaw.limit : 20,
        totalPages:
          typeof metaRaw.totalPages === 'number' ? metaRaw.totalPages : 1,
      }
    : undefined;

  return { data, meta };
}

function toInt(v: unknown, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function normalizeStatus(value?: string) {
  const v = String(value ?? '').trim().toUpperCase();

  if (v === 'OPEN' || v === 'IN_PROGRESS' || v === 'CLOSED') {
    return v;
  }

  return '';
}

function getCookieValue(cookieStore: any, name: string): string | null {
  if (cookieStore && typeof cookieStore.get === 'function') {
    return cookieStore.get(name)?.value ?? null;
  }

  if (cookieStore && typeof cookieStore[Symbol.iterator] === 'function') {
    for (const entry of cookieStore as any) {
      if (Array.isArray(entry) && entry[0] === name) {
        return entry?.[1]?.value ?? null;
      }
    }
  }

  return null;
}

function getSafetyReportStatusStyle(status?: string | null) {
  const normalized = String(status ?? '').toUpperCase();

  if (normalized === 'OPEN') {
    return {
      background: '#f3f4f6',
      color: '#111827',
      border: '1px solid #d1d5db',
    };
  }

  if (normalized === 'IN_PROGRESS') {
    return {
      background: '#dbeafe',
      color: '#1d4ed8',
      border: '1px solid #93c5fd',
    };
  }

  if (normalized === 'CLOSED') {
    return {
      background: '#dcfce7',
      color: '#166534',
      border: '1px solid #86efac',
    };
  }

  return {
    background: '#f3f4f6',
    color: '#111827',
    border: '1px solid #d1d5db',
  };
}

function formatDate(value?: string | null) {
  if (!value) return '-';

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

async function safeText(res: Response) {
  try {
    return (await res.text()).trim();
  } catch {
    return '';
  }
}

export default async function SafetyReportsPage(props: {
  searchParams?: Promise<SearchParams> | SearchParams;
}) {
  const cookieStore = await cookies();
  const token = getCookieValue(cookieStore, 'access_token');

  if (!token) redirect('/login');

  const sp: SearchParams = props.searchParams
    ? await Promise.resolve(props.searchParams)
    : {};

  const page = toInt(sp.page ?? '1', 1);
  const limit = Math.min(Math.max(toInt(sp.limit ?? '20', 20), 1), 100);
  const selectedStatus = normalizeStatus(sp.status);

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
            whiteSpace: 'pre-wrap',
          }}
        >{`Failed to load safety reports (${res.status})
${text}`}</pre>
      </div>
    );
  }

  const json = parseSafetyReportsResponse(await res.json());
  const items = json.data;

  const filteredItems = selectedStatus
    ? items.filter((r) => String(r.status ?? '').toUpperCase() === selectedStatus)
    : items;

  const meta = json.meta ?? { total: 0, page, limit, totalPages: 1 };

  return (
    <div style={{ fontFamily: 'system-ui' }}>
      <Header />

      <form
        method="GET"
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: 16,
          padding: 14,
          border: '1px solid #eee',
          borderRadius: 12,
          background: '#fafafa',
        }}
      >
        <label style={{ fontWeight: 700 }}>Status</label>

        <select
          name="status"
          defaultValue={selectedStatus}
          style={{
            padding: '10px 12px',
            borderRadius: 10,
            border: '1px solid #ddd',
            minWidth: 180,
          }}
        >
          <option value="">All statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="CLOSED">CLOSED</option>
        </select>

        <button
          type="submit"
          style={{
            padding: '10px 16px',
            borderRadius: 10,
            border: '1px solid #111',
            background: '#111',
            color: '#fff',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          Apply
        </button>

        <a
          href="/dashboard/safety-reports"
          style={{
            padding: '10px 16px',
            borderRadius: 10,
            border: '1px solid #ddd',
            background: '#fff',
            color: '#111',
            fontWeight: 700,
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Reset
        </a>
      </form>

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
            gridTemplateColumns: '1.2fr 150px 170px 240px 120px',
            gap: 12,
            padding: 14,
            fontWeight: 800,
            background: '#fafafa',
          }}
        >
          <div>Title</div>
          <div>Status</div>
          <div>Created At</div>
          <div>Report ID</div>
          <div>Actions</div>
        </div>

        {filteredItems.length === 0 ? (
          <div style={{ padding: 14 }}>
            {selectedStatus
              ? `No safety reports match status: ${selectedStatus}`
              : 'No safety reports.'}
          </div>
        ) : (
          filteredItems.map((r) => {
            const created = formatDate(r.createdAt);
            const status = (r.status ?? 'UNKNOWN').toUpperCase();
            const statusStyle = getSafetyReportStatusStyle(status);

            return (
              <div
                key={r.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 150px 170px 240px 120px',
                  gap: 12,
                  padding: 14,
                  borderTop: '1px solid #eee',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{r.title ?? 'Untitled'}</div>
                  <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                    {r.description ?? '-'}
                  </div>
                </div>

                <div>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '6px 10px',
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 800,
                      ...statusStyle,
                    }}
                  >
                    {status}
                  </span>
                </div>

                <div style={{ fontSize: 13, color: '#444' }}>{created}</div>

                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 12,
                    color: '#444',
                    wordBreak: 'break-all',
                  }}
                >
                  {r.id}
                </div>

                <div>
                  <a
                    href={`/dashboard/safety-reports/${r.id}`}
                    style={{
                      color: '#2563eb',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    View
                  </a>
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

      <a
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
      </a>
    </div>
  );
}