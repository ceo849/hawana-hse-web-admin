// app/dashboard/safety-reports/[id]/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const CORE_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:3001'
).replace(/\/$/, '');

type SafetyReportStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | string;

type SiteProjectLite = {
  id: string;
  name: string;
  location?: string | null;
};

type SafetyReport = {
  id: string;
  title?: string | null;
  description?: string | null;
  status?: SafetyReportStatus | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  siteProjectId?: string | null;
  siteProject?: SiteProjectLite | null;
};

type ActionPlanStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED' | string;

type ActionPlan = {
  id: string;
  title: string;
  status?: ActionPlanStatus | null;
  safetyReportId?: string | null;
  createdAt?: string | null;
};

type PageProps = {
  params: Promise<{ id: string }>;
};

function getCookieValue(cookieStore: any, name: string): string | null {
  if (cookieStore && typeof cookieStore.get === 'function') {
    return cookieStore.get(name)?.value ?? null;
  }
  if (cookieStore && typeof cookieStore[Symbol.iterator] === 'function') {
    for (const entry of cookieStore as any) {
      if (Array.isArray(entry) && entry[0] === name) return entry?.[1]?.value ?? null;
    }
  }
  return null;
}

async function safeText(res: Response): Promise<string> {
  try {
    return (await res.text()).trim();
  } catch {
    return '';
  }
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

function formatSiteProject(siteProject?: SiteProjectLite | null) {
  if (!siteProject) return '-';
  if (siteProject.location) return `${siteProject.name} (${siteProject.location})`;
  return siteProject.name;
}

function formatDate(value?: string | null) {
  if (!value) return '-';

  const d = new Date(value);

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export default async function SafetyReportDetailPage({ params }: PageProps) {
  const cookieStore = await cookies();
  const token = getCookieValue(cookieStore, 'access_token');
  if (!token) redirect('/login');

  const { id } = await params;
  const reportId = String(id ?? '').trim();
  if (!reportId) redirect('/dashboard/safety-reports');

  const srRes = await fetch(
    `${CORE_BASE_URL}/v1/safety-reports/${encodeURIComponent(reportId)}`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    },
  );

  if (srRes.status === 401) redirect('/login');

  if (!srRes.ok) {
    const text = await safeText(srRes);
    return (
      <div style={{ fontFamily: 'system-ui', padding: 24 }}>
        <div style={{ marginBottom: 12, fontSize: 13, color: '#666' }}>
          <a href="/dashboard">Dashboard</a> /
          <a href="/dashboard/safety-reports"> Safety Reports</a> /
          <span> Report Details</span>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>
          Safety Report
        </h1>

        <pre
          style={{
            padding: 12,
            background: '#f7f7f7',
            borderRadius: 12,
            overflowX: 'auto',
          }}
        >{`Failed to load safety report (${srRes.status})
${text}`}</pre>

        <div style={{ marginTop: 14 }}>
          <a href="/dashboard/safety-reports" style={{ textDecoration: 'underline' }}>
            ← Back to Safety Reports
          </a>
        </div>
      </div>
    );
  }

  const sr = (await srRes.json()) as SafetyReport;
  const statusStyle = getSafetyReportStatusStyle(sr.status);

  let actionPlans: ActionPlan[] = [];
  try {
    const apUrl = new URL(`${CORE_BASE_URL}/v1/action-plans`);
    apUrl.searchParams.set('safetyReportId', sr.id);

    const apRes = await fetch(apUrl.toString(), {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (apRes.status === 401) redirect('/login');

    if (apRes.ok) {
      const all = (await apRes.json()) as ActionPlan[];
      actionPlans = (Array.isArray(all) ? all : [])
        .filter((ap) => ap?.safetyReportId === sr.id)
        .sort((a, b) => String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')));
    }
  } catch {
    // ignore
  }

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24 }}>
      <div style={{ marginBottom: 12, fontSize: 13, color: '#666' }}>
        <a href="/dashboard">Dashboard</a> /
        <a href="/dashboard/safety-reports"> Safety Reports</a> /
        <span> Report Details</span>
      </div>

      <h1 style={{ fontSize: 34, fontWeight: 900, marginBottom: 10 }}>
        Safety Report
      </h1>

      <div
        style={{
          marginBottom: 14,
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
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
          {sr.status ?? '-'}
        </span>

        <a
          href={`/dashboard/action-plans/new?safetyReportId=${encodeURIComponent(sr.id)}`}
          style={{
            display: 'inline-block',
            padding: '10px 12px',
            borderRadius: 10,
            border: '1px solid #111',
            background: '#111',
            color: '#fff',
            fontWeight: 800,
            textDecoration: 'none',
          }}
        >
          + Create Action Plan
        </a>

        <a href="/dashboard/safety-reports" style={{ textDecoration: 'underline' }}>
          ← Back
        </a>
      </div>

      <div
        style={{
          border: '1px solid #eee',
          borderRadius: 14,
          padding: 16,
          background: '#fff',
          maxWidth: 900,
        }}
      >
        <div style={{ display: 'grid', gap: 10 }}>
          <Row label="ID" value={sr.id} />
          <Row label="Title" value={sr.title ?? '-'} />
          <Row label="Site / Project" value={formatSiteProject(sr.siteProject)} />
          <Row label="Status" value={sr.status ?? '-'} />
          <Row label="Description" value={sr.description ?? '-'} />
          <Row label="Created" value={formatDate(sr.createdAt)} />
          <Row label="Updated" value={formatDate(sr.updatedAt)} />
        </div>
      </div>

      <div style={{ marginTop: 18, maxWidth: 900 }}>
        <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>
          Related Action Plans
        </div>

        {actionPlans.length === 0 ? (
          <div
            style={{
              border: '1px dashed #d1d5db',
              borderRadius: 12,
              padding: 18,
              background: '#fafafa',
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 6 }}>
              No action plans linked yet
            </div>
            <div style={{ fontSize: 13, color: '#555', marginBottom: 12 }}>
              Create the first action plan for this safety report.
            </div>
            <a
              href={`/dashboard/action-plans/new?safetyReportId=${encodeURIComponent(sr.id)}`}
              style={{
                display: 'inline-block',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid #111',
                background: '#111',
                color: '#fff',
                fontWeight: 800,
                textDecoration: 'none',
              }}
            >
              + Create Action Plan
            </a>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {actionPlans.map((ap) => (
              <div
                key={ap.id}
                style={{
                  border: '1px solid #eee',
                  borderRadius: 12,
                  padding: 14,
                  background: '#fff',
                }}
              >
                <div style={{ fontWeight: 900 }}>{ap.title}</div>
                <div style={{ marginTop: 6, fontSize: 13 }}>
                  <b>Status:</b> {ap.status ?? '—'}
                </div>
                <div style={{ marginTop: 10 }}>
                  <a
                    href={`/dashboard/action-plans/${encodeURIComponent(ap.id)}`}
                    style={{ textDecoration: 'underline' }}
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12 }}>
      <div style={{ fontWeight: 800, color: '#333' }}>{label}</div>
      <div style={{ color: '#111', wordBreak: 'break-word' }}>{value}</div>
    </div>
  );
}