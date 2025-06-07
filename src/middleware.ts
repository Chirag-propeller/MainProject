// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
// import jwt from 'jsonwebtoken';
import { jwtVerify } from 'jose'
import { cookies } from "next/headers";
// import { cookies } from 'next/headers'


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // const cookieStore = await cookies();
  // const token1 = cookieStore.get('token')?.value;
  const token = request.cookies.get('token')?.value
  let isValidToken = false;
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.TOKEN_SECRET!)
      await jwtVerify(token, secret)
      // console.log("token is valid")
      isValidToken = true;
    } catch (error) {
      // console.log("error", error);
      // Token is invalid, remove it
      
      (await cookies()).set('token', '', { maxAge: 0 })
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  if(!isValidToken){
    return NextResponse.redirect(new URL('/login', request.url))
  }

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
  if (isAuthRoute && isValidToken) {
    return NextResponse.redirect(new URL('/dashboard/agents', request.url))
  }

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isValidToken) {
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