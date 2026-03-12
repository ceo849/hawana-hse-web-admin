// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';

const CORE_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://hawana-core:3001'
).replace(/\/$/, '');

function getCookieValue(cookieHeader: string, name: string): string | null {
  const parts = cookieHeader.split(';').map((part) => part.trim());
  const match = parts.find((part) => part.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.slice(name.length + 1));
}

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') ?? '';
  const token = getCookieValue(cookieHeader, 'access_token');

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const segments = url.pathname.split('/').filter(Boolean);
  const id = segments[segments.length - 1];

  if (!id) {
    return NextResponse.json({ message: 'Missing user id' }, { status: 400 });
  }

  const upstream = await fetch(`${CORE_BASE_URL}/v1/users/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const bodyText = await upstream.text();

  return new NextResponse(bodyText, {
    status: upstream.status,
    headers: {
      'content-type':
        upstream.headers.get('content-type') ??
        'application/json; charset=utf-8',
    },
  });
}