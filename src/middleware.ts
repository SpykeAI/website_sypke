import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get('host') || '';

  // Allow direct access on localhost without login for local testing
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1') || process.env.NODE_ENV === 'development';
  if (isLocalhost) {
    return NextResponse.next();
  }

  // Protect /admin, /inbox, and /phone from unauthorized access in production (only allow /admin/login)
  const isProtected = 
    (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) || 
    pathname.startsWith('/inbox') ||
    pathname.startsWith('/phone');

  if (isProtected) {
    // Read the secure superadmin session cookie
    const adminSession = request.cookies.get('admin_session')?.value;
    
    // If not authenticated, redirect to Superadmin Login page
    if (!adminSession || adminSession !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/inbox/:path*', '/phone/:path*'],
};
