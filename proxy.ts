// hawana-hse-web-admin/proxy.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/favicon.ico'];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Allow public routes + Next internal assets + API routes
  if (
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // Protect dashboard
  if (pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('access_token')?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);

      // 👇 أهم سطر: حفظ الصفحة المطلوبة
      loginUrl.searchParams.set('next', `${pathname}${search}`);

      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*'],
};