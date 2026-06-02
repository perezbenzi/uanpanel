import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

const DASHBOARD_ROUTES = ['/dashboard', '/products', '/orders']
const AUTH_ROUTES = ['/login', '/signup']

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request })
  const supabase = createClient(request, response)

  // getUser() validates the token against Supabase Auth — use this for authorization,
  // not getSession() which only reads from cookies and is unverified.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isDashboard = DASHBOARD_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + '/')
  )
  const isAuth = AUTH_ROUTES.includes(pathname)

  if (pathname === '/') {
    const dest = user ? '/dashboard' : '/login'
    return NextResponse.redirect(new URL(dest, request.nextUrl))
  }

  if (isDashboard && !user) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  if (isAuth && user) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
