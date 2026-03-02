// app/api/safety-reports/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const CORE_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:3001/v1'
).replace(/\/$/, '');

export async function GET() {
  const token = cookies().get('access_token')?.value ?? null;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const upstream = await fetch(`${CORE_BASE_URL}/safety-reports`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  const body = await upstream.text();

  return new NextResponse(body, {
    status: upstream.status,
    headers: {
      'content-type':
        upstream.headers.get('content-type') ??
        'application/json; charset=utf-8',
    },
  });
}
