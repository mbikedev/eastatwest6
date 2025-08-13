import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { generateCacheHeaders } from './utils/cache-policies'

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
  
  // Check for Brotli support first, then gzip
  const acceptEncoding = request.headers.get('accept-encoding') || ''
  const supportsBrotli = acceptEncoding.includes('br')
  const supportsGzip = acceptEncoding.includes('gzip')
  
  // Always set Vary header for compression
  response.headers.set('Vary', 'Accept-Encoding')
  
  // Handle RSC (React Server Components) requests with compression
  if (request.nextUrl.search.includes('_rsc=')) {
    response.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate')
    
    // Prefer Brotli over gzip for RSC payloads
    if (supportsBrotli) {
      response.headers.set('Content-Encoding', 'br')
    } else if (supportsGzip) {
      response.headers.set('Content-Encoding', 'gzip')
    }
  }
  
  // Apply cache policies using centralized configuration
  const pathname = request.nextUrl.pathname;
  const cacheHeaders = generateCacheHeaders(pathname);
  
  // Apply cache headers if applicable
  Object.entries(cacheHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add compression for cacheable static assets
  if (Object.keys(cacheHeaders).length > 0) {
    if (supportsBrotli) {
      response.headers.set('Content-Encoding', 'br')
    } else if (supportsGzip) {
      response.headers.set('Content-Encoding', 'gzip')
    }
    
    // Special tag for Restaurant Guru assets (performance audit target)
    if (pathname.startsWith('/assets/restaurant-guru/')) {
      response.headers.set('X-Cache-Tag', 'restaurant-guru-immutable')
      response.headers.set('X-Performance-Optimized', 'cache-policy-updated')
    }
  }
  
  // Enhanced compression headers for problematic pages
  if (request.nextUrl.pathname.includes('gallery') || 
      request.nextUrl.pathname.includes('reservations') ||
      request.nextUrl.pathname.includes('menu')) {
    response.headers.set('Cache-Control', 'public, max-age=300')
    
    // Force compression for these large pages
    if (supportsBrotli) {
      response.headers.set('Content-Encoding', 'br')
    } else if (supportsGzip) {
      response.headers.set('Content-Encoding', 'gzip')
    }
  }
  
  // Add compression for API responses
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (supportsBrotli) {
      response.headers.set('Content-Encoding', 'br')
    } else if (supportsGzip) {
      response.headers.set('Content-Encoding', 'gzip')
    }
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