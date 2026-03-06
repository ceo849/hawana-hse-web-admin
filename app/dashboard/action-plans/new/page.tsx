// app/dashboard/action-plans/new/page.tsx
import { redirect } from 'next/navigation';
import { requireAccessToken } from '@/lib/server-auth';
import { api } from '@/lib/core-api';

type PageSearchParams = {
  safetyReportId?: string;
  err?: string;
};

type PageProps = {
  searchParams?: PageSearchParams | Promise<PageSearchParams>;
};

type UserLite = {
  id: string;
  email?: string | null;
  fullName?: string | null;
  role?: string | null;
};

type UsersApiResponse = UserLite[] | { data?: UserLite[] };

type ActionPlanPayload = {
  title: string;
  description: string;
  safetyReportId: string;
  dueDate?: string;
  assignedToUserId?: string;
};

function userLabel(user: UserLite): string {
  const name = (user.fullName ?? '').trim();
  const email = (user.email ?? '').trim();

  if (name && email) return `${name} — ${email}`;
  if (name) return name;
  return email || user.id;
}

function normalizeUsersResponse(data: UsersApiResponse): UserLite[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

export default async function NewActionPlanPage({ searchParams }: PageProps) {
  const token = await requireAccessToken();

  const sp = await Promise.resolve(searchParams ?? {});
  const safetyReportId = String(sp.safetyReportId ?? '').trim();
  const err = String(sp.err ?? '').trim();

  let users: UserLite[] = [];

  try {
    const response = await fetch(api('/v1/users'), {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (response.ok) {
      const data = (await response.json()) as UsersApiResponse;
      users = normalizeUsersResponse(data);
    }
  } catch {
    // ignore
  }

  async function createActionPlan(formData: FormData) {
    'use server';

    const tokenInner = await requireAccessToken();

    const title = String(formData.get('title') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();
    const srId = String(formData.get('safetyReportId') ?? '').trim();
    const dueDateRaw = String(formData.get('dueDate') ?? '').trim();
    const assignedToUserId = String(formData.get('assignedToUserId') ?? '').trim();

    const base = `/dashboard/action-plans/new?safetyReportId=${encodeURIComponent(
      srId || safetyReportId,
    )}`;

    if (!title) {
      redirect(`${base}&err=${encodeURIComponent('Title is required')}`);
    }

    if (!srId) {
      redirect(
        `${base}&err=${encodeURIComponent('Safety Report ID is required')}`,
      );
    }

    const payload: ActionPlanPayload = {
      title,
      description,
      safetyReportId: srId,
    };

    if (dueDateRaw) {
      payload.dueDate = new Date(
        `${dueDateRaw}T00:00:00.000Z`,
      ).toISOString();
    }

    if (assignedToUserId) {
      payload.assignedToUserId = assignedToUserId;
    }

    const res = await fetch(api('/v1/action-plans'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenInner}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (res.status === 401) redirect('/login');

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      redirect(
        `${base}&err=${encodeURIComponent(
          `Failed to create Action Plan (${res.status}) ${text}`,
        )}`,
      );
    }

    redirect('/dashboard/action-plans');
  }

  return (
    <div style={{ padding: 40, fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 42, fontWeight: 900, marginBottom: 12 }}>
        Create Action Plan
      </h1>

      {err ? (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 12,
            background: '#fff5f5',
            border: '1px solid #ffd6d6',
            color: '#b00020',
            fontWeight: 700,
          }}
        >
          {err}
        </div>
      ) : null}

      <form action={createActionPlan} style={{ maxWidth: 800 }}>
        <input
          name="title"
          placeholder="Title"
          required
          style={{
            width: '100%',
            padding: '16px',
            marginBottom: 12,
            borderRadius: 10,
            border: '1px solid #ddd',
          }}
        />

        <input
          name="safetyReportId"
          placeholder="Safety Report ID"
          required
          defaultValue={safetyReportId}
          readOnly
          style={{
            width: '100%',
            padding: '16px',
            marginBottom: 8,
            borderRadius: 10,
            border: '1px solid #ddd',
            background: '#f7f7f7',
          }}
        />

        <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
          Safety Report ID يتم تمريره تلقائيًا من صفحة الـ Safety Report.
        </div>

        <label style={{ display: 'block', fontSize: 12, color: '#666' }}>
          Assigned To (User) (اختياري)
        </label>

        {users.length > 0 ? (
          <select
            name="assignedToUserId"
            defaultValue=""
            style={{
              width: '100%',
              padding: '16px',
              marginTop: 6,
              marginBottom: 12,
              borderRadius: 10,
              border: '1px solid #ddd',
              background: '#fff',
            }}
          >
            <option value="">— Not assigned —</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {userLabel(user)}
              </option>
            ))}
          </select>
        ) : (
          <input
            name="assignedToUserId"
            placeholder="User ID responsible for this action"
            style={{
              width: '100%',
              padding: '16px',
              marginTop: 6,
              marginBottom: 12,
              borderRadius: 10,
              border: '1px solid #ddd',
            }}
          />
        )}

        <textarea
          name="description"
          placeholder="Description"
          rows={5}
          style={{
            width: '100%',
            padding: '16px',
            marginBottom: 12,
            borderRadius: 10,
            border: '1px solid #ddd',
          }}
        />

        <label style={{ display: 'block', fontSize: 12, color: '#666' }}>
          Due Date (اختياري)
        </label>

        <input
          type="date"
          name="dueDate"
          style={{
            width: '100%',
            padding: '16px',
            marginTop: 6,
            marginBottom: 16,
            borderRadius: 10,
            border: '1px solid #ddd',
          }}
        />

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 12,
            border: 'none',
            background: '#111',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Create
        </button>
      </form>
    </div>
  );
}