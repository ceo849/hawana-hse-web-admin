import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const CORE_API = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://hawana-core:3001'
).replace(/\/$/, '');

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value ?? null;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const r = await fetch(`${CORE_API}/api/v1/companies`, {
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
        r.headers.get('content-type') ??
        'application/json; charset=utf-8',
    },
  });
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value ?? null;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const r = await fetch(`${CORE_API}/api/v1/companies`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const bodyText = await r.text();

  return new NextResponse(bodyText, {
    status: r.status,
    headers: {
      'content-type':
        r.headers.get('content-type') ??
        'application/json; charset=utf-8',
    },
  });
}
