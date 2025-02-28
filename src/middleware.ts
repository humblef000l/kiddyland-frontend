import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing';


export default createMiddleware(routing);
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/:locale((?!_next|api|favicon.ico|public).*)'
}