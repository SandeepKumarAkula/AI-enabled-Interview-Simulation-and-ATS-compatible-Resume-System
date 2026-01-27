import { NextRequest, NextResponse } from 'next/server'

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

/**
 * Rate limiting middleware - prevents brute force attacks
 */
function checkRateLimit(ip: string, limit = 100, windowMs = 60000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

/**
 * CSRF (double-submit cookie)
 * Client must send x-csrf-token header matching csrfToken cookie.
 * This is stable across server instances (unlike an in-memory token store).
 */
function isCsrfEnabled() {
  return (process.env.CSRF_ENABLED || '').toLowerCase() !== 'false'
}

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeInput(obj)
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item))
  }
  if (typeof obj === 'object' && obj !== null) {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value)
    }
    return sanitized
  }
  return obj
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  return ip.trim()
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const token = request.cookies.get('token')?.value

  // Always allow static asset requests (e.g. public/*.svg, public/*.png) so
  // previews and icons render even on logged-out screens.
  // NOTE: Next already excludes /_next/static and /_next/image via matcher.
  const isStaticAsset = /\.(?:svg|png|jpe?g|webp|gif|ico|txt|xml|map|json|woff2?|ttf|eot)$/i.test(pathname)
  if (isStaticAsset) {
    return NextResponse.next()
  }

  // Basic route protection (server-side). API routes still enforce auth/roles.
  const isProtectedPage =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/templates') ||
    pathname.startsWith('/ai-interview') ||
    pathname.startsWith('/ats') ||
    pathname.startsWith('/intelligent-agent') ||
    pathname.startsWith('/rl-agent')

  if (isProtectedPage && !token) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('next', pathname + (search || ''))
    return NextResponse.redirect(url)
  }

  // NOTE: Do not redirect away from auth screens based only on a token cookie.
  // A stale/invalid token cookie can otherwise cause redirect loops:
  // protected page -> /auth/login?next=... -> redirected back -> repeat.

  // Create response with security headers
  const response = NextResponse.next()

  // Security Headers
  // Prevents clickjacking attacks
  response.headers.set('X-Frame-Options', 'DENY')

  // Prevents MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // Prevents XSS attacks
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Content Security Policy - strict but allows necessary resources
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "connect-src 'self' https: wss:; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self'"
  )

  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions Policy
  // Allow camera/microphone only where needed (AI interview).
  // Blocking these globally causes browser "Permissions policy violation: camera is not allowed".
  const needsMedia = pathname.startsWith('/ai-interview')
  response.headers.set(
    'Permissions-Policy',
    needsMedia
      ? 'geolocation=(), microphone=(self), camera=(self), payment=()'
      : 'geolocation=(), microphone=(), camera=(), payment=()'
  )

  // HSTS - enforce HTTPS (only if in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const clientIP = getClientIP(request)
    const isAllowed = checkRateLimit(clientIP, 100, 60000) // 100 requests per minute

    if (!isAllowed) {
      return new NextResponse('Too many requests', {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '0',
        },
      })
    }

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', '100')
    response.headers.set('X-RateLimit-Remaining', '99')
  }

  // CSRF validation for state-changing API requests.
  // Exempt auth endpoints and CSRF bootstrap endpoint.
  if (isCsrfEnabled() && request.nextUrl.pathname.startsWith('/api/') && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const csrfExempt =
      pathname.startsWith('/api/auth/') ||
      pathname === '/api/csrf'

    if (!csrfExempt) {
      const headerToken = request.headers.get('x-csrf-token') || ''
      const cookieToken = request.cookies.get('csrfToken')?.value || ''

      const ok = headerToken.length > 0 && cookieToken.length > 0 && headerToken === cookieToken
      if (!ok) {
        if (process.env.NODE_ENV === 'production') {
          return new NextResponse(JSON.stringify({ error: 'CSRF token invalid or missing' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      }
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
     * - templates/*.svg|png|jpg... (public template preview assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|templates/.*\\.(?:svg|png|jpe?g|webp|gif|ico)$).*)',
  ],
}
