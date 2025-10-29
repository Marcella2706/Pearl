import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/chat', '/explore', '/profile']

const publicRoutes = ['/', '/auth']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }
  const token = request.cookies.get('__Pearl_Token')?.value

  if (isProtectedRoute && !token) {
    const authUrl = new URL('/auth', request.url)
    authUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(authUrl)
  }
  
  if (pathname === '/auth' && token) {
    return NextResponse.redirect(new URL('/chat', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
