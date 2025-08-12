import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If there's no user and the user is trying to access a protected route,
  // redirect them to the login page
  if (!user && request.nextUrl.pathname.startsWith('/protected')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  // If there's a user and they're trying to access the login page,
  // redirect them to the dashboard
  if (user && request.nextUrl.pathname === '/login') {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  // Add compression and optimization headers
  const response = supabaseResponse
  
  // Enable compression for all text-based content
  if (request.headers.get('accept-encoding')?.includes('gzip')) {
    response.headers.set('Vary', 'Accept-Encoding')
  }
  
  // Add specific headers for PDF files to enable compression
  if (request.nextUrl.pathname.endsWith('.pdf')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  // Add compression-friendly headers for HTML pages
  if (request.nextUrl.pathname.includes('gallery') || 
      request.nextUrl.pathname.includes('reservations') ||
      request.nextUrl.pathname.includes('menu')) {
    response.headers.set('Cache-Control', 'public, max-age=300')
    response.headers.set('Vary', 'Accept-Encoding')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 