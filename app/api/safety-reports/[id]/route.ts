import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const CORE_API = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:3001'
).replace(/\/$/, '');

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value ?? null;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const r = await fetch(`${CORE_API}/v1/safety-reports/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const bodyText = await r.text();

  return new NextResponse(bodyText, {
    status: r.status,
    headers: {
      'content-type':
        r.headers.get('content-type') ?? 'application/json; charset=utf-8',
    },
  });
}