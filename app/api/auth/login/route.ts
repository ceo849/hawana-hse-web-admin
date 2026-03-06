import { NextResponse } from 'next/server';

const CORE_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:3001'
).replace(/\/$/, '');

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const upstream = await fetch(`${CORE_BASE_URL}/v1/auth/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return NextResponse.json(data, { status: upstream.status });
    }

    const accessToken = String(
      (data as any).access_token ?? (data as any).accessToken ?? '',
    );
    const refreshToken =
      (data as any).refresh_token ?? (data as any).refreshToken ?? null;

    if (!accessToken) {
      return NextResponse.json(
        { ok: false, message: 'Missing access token from backend' },
        { status: 500 },
      );
    }

    const res = NextResponse.json({ ok: true });

    const cookieOptions = {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: false,
      path: '/',
    };

    res.cookies.set('access_token', accessToken, cookieOptions);

    if (refreshToken) {
      res.cookies.set('refresh_token', String(refreshToken), cookieOptions);
    }

    return res;
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Login route error' },
      { status: 500 },
    );
  }
}