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
    const adminSession = request.cookies.get('admin_session')?.value;
    const portalRole = request.cookies.get('portal_role')?.value || 'superadmin';

    // If not authenticated, redirect to Login page
    if (!adminSession || adminSession !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based route segregation
    if (portalRole === 'external') {
      // External users can ONLY access external portal pages
      const isExternalRoute = pathname.startsWith('/admin/external');
      if (!isExternalRoute) {
        return NextResponse.redirect(new URL('/admin/external', request.url));
      }
    } else if (portalRole === 'internal') {
      // Internal users cannot access User Management or External Portal
      const isSuperadminOnly = pathname.startsWith('/admin/users');
      const isExternalRoute = pathname.startsWith('/admin/external');
      if (isSuperadminOnly || isExternalRoute) {
        return NextResponse.redirect(new URL('/admin/internal', request.url));
      }
    }
    // Superadmin has full access to all portals and user management
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/inbox/:path*', '/phone/:path*'],
};
