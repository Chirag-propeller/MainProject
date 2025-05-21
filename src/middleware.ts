// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
// import { cookies } from 'next/headers'


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // const cookieStore = await cookies();
  // const token1 = cookieStore.get('token')?.value;
  const token = request.cookies.get('token')?.value

  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    return NextResponse.redirect(new URL('/dashboard/agents', request.url));
  }

  // Define routes
  const authRoutes = ['/login', '/signup']
  const protectedRoutes = ['/dashboard']
  const publicRoutes = ['/']

  // Check route types
  const isAuthRoute = authRoutes.includes(pathname)
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  const isPublicRoute = publicRoutes.includes(pathname)

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard/agent', request.url))
  }

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Public routes are accessible to everyone
  if (isPublicRoute) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/((?!api|_next|favicon.ico).*)'
  ],
}