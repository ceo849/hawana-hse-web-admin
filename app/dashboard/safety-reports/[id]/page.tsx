// app/dashboard/safety-reports/[id]/page.tsx
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const CORE_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:3001'
).replace(/\/$/, '');

type SafetyReportStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | string;

type SafetyReport = {
  id: string;
  title?: string | null;
  description?: string | null;
  status?: SafetyReportStatus | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type ActionPlanStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'VERIFIED'
  | string;

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

async function safeText(res: Response): Promise<string> {
  try {
    return (await res.text()).trim();
  } catch {
    return '';
  }
}

export default async function SafetyReportDetailPage({
  params,
}: PageProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value ?? null;

  if (!token) redirect('/login');

  const { id } = await params;
  const safeId = String(id ?? '').trim();

  if (!safeId) redirect('/dashboard/safety-reports');

  const srRes = await fetch(
    `${CORE_BASE_URL}/v1/safety-reports/${encodeURIComponent(safeId)}`,
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
          <Link
            href="/dashboard/safety-reports"
            style={{ textDecoration: 'underline' }}
          >
            ← Back to Safety Reports
          </Link>
        </div>
      </div>
    );
  }

  const safetyReport = (await srRes.json()) as SafetyReport;

  let actionPlans: ActionPlan[] = [];

  try {
    const apUrl = new URL(`${CORE_BASE_URL}/v1/action-plans`);
    apUrl.searchParams.set('safetyReportId', safetyReport.id);

    const apRes = await fetch(apUrl.toString(), {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (apRes.status === 401) redirect('/login');

    if (apRes.ok) {
      const all = (await apRes.json()) as ActionPlan[];
      actionPlans = (Array.isArray(all) ? all : [])
        .filter((actionPlan) => actionPlan?.safetyReportId === safetyReport.id)
        .sort((a, b) =>
          String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')),
        );
    }
  } catch {
    // ignore
  }

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24 }}>
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
        <Link
          href={`/dashboard/action-plans/new?safetyReportId=${encodeURIComponent(
            safetyReport.id,
          )}`}
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
        </Link>

        <Link
          href="/dashboard/safety-reports"
          style={{ textDecoration: 'underline' }}
        >
          ← Back
        </Link>
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
          <Row label="ID" value={safetyReport.id} />
          <Row label="Title" value={safetyReport.title ?? '-'} />
          <Row label="Status" value={safetyReport.status ?? '-'} />
          <Row label="Description" value={safetyReport.description ?? '-'} />
          <Row label="Created" value={safetyReport.createdAt ?? '-'} />
          <Row label="Updated" value={safetyReport.updatedAt ?? '-'} />
        </div>
      </div>

      <div style={{ marginTop: 18, maxWidth: 900 }}>
        <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>
          Related Action Plans
        </div>

        {actionPlans.length === 0 ? (
          <div style={{ fontSize: 13, color: '#555' }}>
            No action plans linked to this safety report.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {actionPlans.map((actionPlan) => (
              <div
                key={actionPlan.id}
                style={{
                  border: '1px solid #eee',
                  borderRadius: 12,
                  padding: 14,
                  background: '#fff',
                }}
              >
                <div style={{ fontWeight: 900 }}>{actionPlan.title}</div>
                <div style={{ marginTop: 6, fontSize: 13 }}>
                  <b>Status:</b> {actionPlan.status ?? '—'}
                </div>
                <div style={{ marginTop: 10 }}>
                  <Link
                    href={`/dashboard/action-plans/${encodeURIComponent(
                      actionPlan.id,
                    )}`}
                    style={{ textDecoration: 'underline' }}
                  >
                    View
                  </Link>
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