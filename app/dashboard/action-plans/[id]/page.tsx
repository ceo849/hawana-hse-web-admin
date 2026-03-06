// app/dashboard/action-plans/[id]/page.tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAccessToken } from '@/lib/server-auth';
import { api } from '@/lib/core-api';

type ActionPlanStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';

type ActionPlan = {
  id: string;
  title: string;
  description?: string | null;
  status: ActionPlanStatus;
  dueDate?: string | null;
  safetyReportId?: string | null;
  assignedToUserId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

type UserLite = {
  id: string;
  fullName?: string | null;
  email?: string | null;
};

type UsersApiResponse = UserLite[] | { data?: UserLite[] };

type PageSearchParams = {
  err?: string;
};

type PageProps = {
  params: { id: string } | Promise<{ id: string }>;
  searchParams?: PageSearchParams | Promise<PageSearchParams>;
};

type ApiErrorBody = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
  path?: string;
};

function normalizeId(raw: unknown): string {
  return String(raw ?? '').trim();
}

function actionPlanPath(id: string): string {
  return `/dashboard/action-plans/${encodeURIComponent(id)}`;
}

function allowedNextStatuses(current: ActionPlanStatus): ActionPlanStatus[] {
  switch (current) {
    case 'OPEN':
      return ['IN_PROGRESS'];
    case 'IN_PROGRESS':
      return ['COMPLETED'];
    case 'COMPLETED':
      return ['VERIFIED'];
    case 'VERIFIED':
    default:
      return [];
  }
}

function toDateInputValue(iso?: string | null): string {
  if (!iso) return '';

  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';

  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}

function formatDateDisplay(iso?: string | null): string {
  if (!iso) return '—';

  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';

  return d.toLocaleString();
}

function normalizeUsersResponse(data: UsersApiResponse): UserLite[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

async function readApiErrorText(response: Response): Promise<string> {
  try {
    const json = (await response.json()) as ApiErrorBody;

    if (json) {
      const message = Array.isArray(json.message)
        ? json.message.join(' | ')
        : json.message ?? json.error ?? '';

      const path = json.path ? ` path=${json.path}` : '';
      const statusCode = json.statusCode ? ` statusCode=${json.statusCode}` : '';
      const result = `${message}${statusCode}${path}`.trim();

      if (result) return result;
      return JSON.stringify(json);
    }
  } catch {
    // ignore
  }

  try {
    return (await response.text()).trim();
  } catch {
    return '';
  }
}

function redirectWithError(id: string, label: string, status: number, detail: string): never {
  const clean = `${label} (${status}) ${detail}`.trim();
  redirect(`${actionPlanPath(id)}?err=${encodeURIComponent(clean)}`);
}

export default async function ActionPlanPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const id = normalizeId(resolvedParams.id);

  if (!id) {
    redirect('/dashboard/action-plans');
  }

  const token = await requireAccessToken();

  async function changeStatus(formData: FormData) {
    'use server';

    const tokenInner = await requireAccessToken();
    const nextStatusRaw = normalizeId(formData.get('nextStatus'));

    if (!nextStatusRaw) {
      redirect(actionPlanPath(id));
    }

    const allowedStatuses: ActionPlanStatus[] = [
      'OPEN',
      'IN_PROGRESS',
      'COMPLETED',
      'VERIFIED',
    ];

    if (!allowedStatuses.includes(nextStatusRaw as ActionPlanStatus)) {
      redirectWithError(id, 'Invalid status value', 400, `status=${nextStatusRaw}`);
    }

    const response = await fetch(api(`/v1/action-plans/${id}/status`), {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${tokenInner}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: nextStatusRaw }),
      cache: 'no-store',
    });

    if (response.status === 401) {
      redirect('/login');
    }

    if (!response.ok) {
      const detail = await readApiErrorText(response);
      redirectWithError(id, 'Status update failed', response.status, detail);
    }

    redirect(actionPlanPath(id));
  }

  async function updateDueDate(formData: FormData) {
    'use server';

    const tokenInner = await requireAccessToken();
    const dueDateRaw = normalizeId(formData.get('dueDate'));

    const payload = {
      dueDate: dueDateRaw
        ? new Date(`${dueDateRaw}T00:00:00.000Z`).toISOString()
        : null,
    };

    const response = await fetch(api(`/v1/action-plans/${id}/due-date`), {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${tokenInner}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (response.status === 401) {
      redirect('/login');
    }

    if (!response.ok) {
      const detail = await readApiErrorText(response);
      redirectWithError(id, 'Due date update failed', response.status, detail);
    }

    redirect(actionPlanPath(id));
  }

  const response = await fetch(api(`/v1/action-plans/${id}`), {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (response.status === 401) {
    redirect('/login');
  }

  if (!response.ok) {
    const detail = await readApiErrorText(response);

    return (
      <div style={{ padding: 24, fontFamily: 'system-ui' }}>
        <Link
          href="/dashboard/action-plans"
          style={{ textDecoration: 'underline' }}
        >
          ← Back
        </Link>

        <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 16 }}>
          Action Plan
        </h1>

        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: '#f7f7f7',
            borderRadius: 12,
            overflowX: 'auto',
          }}
        >{`Failed to load action plan (${response.status})\n${detail}`}</pre>
      </div>
    );
  }

  const actionPlan = (await response.json()) as ActionPlan;

  let users: UserLite[] = [];

  try {
    const usersResponse = await fetch(api('/v1/users'), {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (usersResponse.ok) {
      const data = (await usersResponse.json()) as UsersApiResponse;
      users = normalizeUsersResponse(data);
    }
  } catch {
    // ignore
  }

  const assignedUser = actionPlan.assignedToUserId
    ? users.find((user) => user.id === actionPlan.assignedToUserId)
    : undefined;

  const nextStatuses = allowedNextStatuses(actionPlan.status);
  const err = normalizeId(resolvedSearchParams.err);
  const dueDateLocked = actionPlan.status === 'VERIFIED';

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <Link
        href="/dashboard/action-plans"
        style={{ textDecoration: 'underline' }}
      >
        ← Back
      </Link>

      <h1 style={{ fontSize: 44, fontWeight: 900, marginTop: 16 }}>
        {actionPlan.title}
      </h1>

      {err ? (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 12,
            border: '1px solid #f3c2c2',
            background: '#fff5f5',
            color: '#7a1c1c',
            fontSize: 13,
            whiteSpace: 'pre-wrap',
          }}
        >
          {err}
        </div>
      ) : null}

      <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
        <div>
          <b>Status:</b> {actionPlan.status}
        </div>

        <div>
          <b>Assigned To:</b>{' '}
          {assignedUser
            ? `${assignedUser.fullName ?? '—'} — ${assignedUser.email ?? '—'}`
            : actionPlan.assignedToUserId
            ? actionPlan.assignedToUserId
            : '—'}
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <b>Change Status</b>

        {nextStatuses.length === 0 ? (
          <div style={{ marginTop: 8, fontSize: 13, color: '#555' }}>
            No allowed transitions
          </div>
        ) : (
          <form
            action={changeStatus}
            style={{
              marginTop: 10,
              display: 'flex',
              gap: 10,
              alignItems: 'center',
            }}
          >
            <select
              name="nextStatus"
              defaultValue={nextStatuses[0]}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid #ddd',
                minWidth: 180,
              }}
            >
              {nextStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <button
              type="submit"
              style={{
                padding: '10px 16px',
                borderRadius: 12,
                border: '1px solid #111',
                background: '#111',
                color: '#fff',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Update
            </button>
          </form>
        )}
      </div>

      <div style={{ marginTop: 18 }}>
        <b>Due Date:</b> {formatDateDisplay(actionPlan.dueDate)}

        <div style={{ marginTop: 10 }}>
          <form
            action={updateDueDate}
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <input
              type="date"
              name="dueDate"
              defaultValue={toDateInputValue(actionPlan.dueDate)}
              disabled={dueDateLocked}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid #ddd',
                minWidth: 220,
                opacity: dueDateLocked ? 0.6 : 1,
              }}
            />

            <button
              type="submit"
              disabled={dueDateLocked}
              style={{
                padding: '10px 16px',
                borderRadius: 12,
                border: '1px solid #111',
                background: dueDateLocked ? '#777' : '#111',
                color: '#fff',
                fontWeight: 800,
                cursor: dueDateLocked ? 'not-allowed' : 'pointer',
                opacity: dueDateLocked ? 0.7 : 1,
              }}
            >
              Save Due Date
            </button>

            <span style={{ fontSize: 12, color: '#666' }}>
              {dueDateLocked
                ? '(Locked: VERIFIED plan)'
                : '(سيتم حفظ التاريخ أو مسحه لو تركته فارغًا)'}
            </span>
          </form>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <b>Description</b>
        <p style={{ marginTop: 8, lineHeight: 1.6 }}>
          {actionPlan.description?.trim()
            ? actionPlan.description
            : 'No description'}
        </p>
      </div>

      <div style={{ marginTop: 20, fontSize: 12, color: '#555' }}>
        <div>ID: {actionPlan.id}</div>
        <div>Safety Report: {actionPlan.safetyReportId ?? '—'}</div>
        <div>Created: {formatDateDisplay(actionPlan.createdAt)}</div>
        <div>Updated: {formatDateDisplay(actionPlan.updatedAt)}</div>
      </div>
    </div>
  );
}