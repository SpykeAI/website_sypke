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

  // 1. Client Portal protection (Redirect unauthenticated users to /clientportal/login)
  if (pathname.startsWith('/clientportal')) {
    // Allow public access to client portal login page
    if (pathname.startsWith('/clientportal/login')) {
      const adminSession = request.cookies.get('admin_session')?.value;
      const portalRole = request.cookies.get('portal_role')?.value;
      if (adminSession === 'authenticated' && portalRole === 'external') {
        return NextResponse.redirect(new URL('/clientportal', request.url));
      }
      return NextResponse.next();
    }

    const adminSession = request.cookies.get('admin_session')?.value;
    const portalRole = request.cookies.get('portal_role')?.value;

    // If not authenticated or not external/superadmin, redirect to Client Portal Login
    if (!adminSession || adminSession !== 'authenticated' || (portalRole !== 'external' && portalRole !== 'superadmin')) {
      return NextResponse.redirect(new URL('/clientportal/login', request.url));
    }

    return NextResponse.next();
  }

  // 2. Protect /admin, /inbox, and /phone from unauthorized access in production (only allow /admin/login)
  const isAdminProtected = 
    (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) || 
    pathname.startsWith('/inbox') ||
    pathname.startsWith('/phone');

  if (isAdminProtected) {
    const adminSession = request.cookies.get('admin_session')?.value;
    const portalRole = request.cookies.get('portal_role')?.value || 'superadmin';

    // If not authenticated, redirect to Admin Login page
    if (!adminSession || adminSession !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based route segregation
    if (portalRole === 'external') {
      // External users can ONLY access external client portal pages
      return NextResponse.redirect(new URL('/clientportal', request.url));
    } else if (portalRole === 'internal') {
      // Internal users cannot access User Management or External Portal
      const isSuperadminOnly = pathname.startsWith('/admin/users');
      const isExternalRoute = pathname.startsWith('/admin/external') || pathname.startsWith('/clientportal');
      if (isSuperadminOnly || isExternalRoute) {
        return NextResponse.redirect(new URL('/admin/internal', request.url));
      }
    }
    // Superadmin has full access to all portals and user management
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/clientportal',
    '/clientportal/:path*',
    '/inbox',
    '/inbox/:path*',
    '/phone',
    '/phone/:path*'
  ],
};
