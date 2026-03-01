import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  // IMPORTANT: set this in .env as NEXT_PUBLIC_API_BASE_URL (example: http://localhost:3005/v1)
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json(
      { ok: false, message: 'NEXT_PUBLIC_API_BASE_URL is missing' },
      { status: 500 },
    );
  }

  const r = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await r.json();

  if (!r.ok) {
    return NextResponse.json(data, { status: r.status });
  }

  const res = NextResponse.json({ ok: true });

  // access cookie
  res.cookies.set('access_token', data.access_token ?? '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // dev
    path: '/',
    maxAge: 60 * 15, // 15m (عدّلها حسب نظامك)
  });

  // refresh cookie (optional)
  if (data.refresh_token) {
    res.cookies.set('refresh_token', data.refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // dev
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30d (عدّلها حسب نظامك)
    });
  }

  return res;
}
