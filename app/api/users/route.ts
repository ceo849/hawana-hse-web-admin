// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const CORE_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:3001').replace(/\/$/, '');

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value ?? null;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const upstream = await fetch(`${CORE_BASE_URL}/v1/users`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  const bodyText = await upstream.text();

  return new NextResponse(bodyText, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') ?? 'application/json; charset=utf-8',
    },
  });
}