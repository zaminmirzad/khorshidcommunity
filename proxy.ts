import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export const proxy = createMiddleware(routing);

export const config = {
  matcher: [
    '/((?!api|_next|images|favicon\\.ico|logo\\.jpg|sign-in|sign-up|admin|dashboard|.*\\..*).*)',
  ],
};
