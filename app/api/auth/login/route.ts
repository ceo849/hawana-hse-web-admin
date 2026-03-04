import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { ok: false, message: 'NEXT_PUBLIC_API_BASE_URL is missing' },
        { status: 500 },
      );
    }

    const upstream = await fetch(`${baseUrl}/v1/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return NextResponse.json(data, { status: upstream.status });
    }

    const res = NextResponse.json({ ok: true });

    // Access Token Cookie
    res.cookies.set('access_token', data.access_token ?? '', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // dev only
      path: '/',
    });

    // Refresh Token Cookie (optional)
    if (data.refresh_token) {
      res.cookies.set('refresh_token', data.refresh_token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // dev only
        path: '/',
      });
    }

    return res;
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: 'Login route error' },
      { status: 500 },
    );
  }
}