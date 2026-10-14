import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect /admin and /inbox from unauthorized access (only allow /admin/login)
  const isProtected = 
    (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) || 
    pathname.startsWith('/inbox');

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
  matcher: ['/admin/:path*', '/inbox/:path*'],
};
