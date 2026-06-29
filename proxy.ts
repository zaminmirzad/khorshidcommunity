import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const PROTECTED = ['/dashboard', '/admin'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Build a mutable response so Supabase can refresh session cookies
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the session — must use getUser(), not getSession()
  const { data: { user } } = await supabase.auth.getUser();

  // Protect /dashboard and /admin
  if (PROTECTED.some((p) => pathname.startsWith(p))) {
    if (!user) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return response;
  }

  // /sign-in: redirect authenticated users to dashboard, otherwise pass through as-is
  if (pathname === '/sign-in') {
    if (user) return NextResponse.redirect(new URL('/dashboard', request.url));
    return response;
  }

  // Run next-intl for all localized public routes
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|_next|images|favicon\\.ico|logo\\.jpg|sign-up|auth|.*\\..*).*)',
  ],
};
