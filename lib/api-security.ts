import { NextRequest, NextResponse } from 'next/server'
import { sanitizeJSON, validateOWASP, logSecurityEvent } from './security-utils'

/**
 * Secure API response wrapper
 */
export function createSecureResponse<T>(
  data: T,
  status = 200,
  headers?: Record<string, string>
) {
  return NextResponse.json(data, {
    status,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      ...headers,
    },
  })
}

/**
 * Secure error response
 */
export function createSecureErrorResponse(
  error: unknown,
  status = 500
) {
  // Never expose internal error details in production
  const isDevelopment = process.env.NODE_ENV === 'development'
  const message = error instanceof Error ? error.message : 'An error occurred'
  
  const errorResponse = {
    error: isDevelopment ? message : 'Internal server error',
    status,
    timestamp: new Date().toISOString(),
  }

  return createSecureResponse(errorResponse, status)
}

/**
 * Validate and parse request body safely
 */
export async function parseSecureRequestBody(request: NextRequest): Promise<{
  valid: boolean
  data?: any
  error?: string
}> {
  try {
    const contentType = request.headers.get('content-type')
    
    // Only accept JSON
    if (!contentType?.includes('application/json')) {
      return {
        valid: false,
        error: 'Content-Type must be application/json',
      }
    }

    // Check content length
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 1024 * 1024) { // 1MB limit
      return {
        valid: false,
        error: 'Request body too large',
      }
    }

    const body = await request.json()
    
    // Sanitize the parsed JSON
    const sanitized = sanitizeJSON(body)
    
    return {
      valid: true,
      data: sanitized,
    }
  } catch (error) {
    return {
      valid: false,
      error: 'Invalid JSON in request body',
    }
  }
}

/**
 * Validate request query parameters
 */
export function validateQueryParams(
  params: Record<string, string | string[] | undefined>,
  allowedParams: string[]
): { valid: boolean; data?: Record<string, string>; error?: string } {
  const validated: Record<string, string> = {}

  for (const [key, value] of Object.entries(params)) {
    // Only allow whitelisted parameters
    if (!allowedParams.includes(key)) {
      logSecurityEvent({
        type: 'suspicious_query_param',
        severity: 'medium',
        details: `Unexpected query parameter: ${key}`,
      })
      continue
    }

    // Validate value format
    const strValue = Array.isArray(value) ? value[0] : value
    if (!strValue) continue

    const validation = validateOWASP(strValue, 1000)
    if (!validation.valid) {
      return {
        valid: false,
        error: validation.reason,
      }
    }

    validated[key] = strValue
  }

  return {
    valid: true,
    data: validated,
  }
}

/**
 * Get client IP from request
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded ? forwarded.split(',')[0].trim() : request.ip || 'unknown'
}

/**
 * Validate API key
 */
export function validateAPIKey(request: NextRequest): { valid: boolean; key?: string } {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    return { valid: false }
  }

  const key = authHeader.slice(7) // Remove 'Bearer '
  
  // Validate key format (example: 32 character hex)
  if (!/^[a-f0-9]{32}$/.test(key)) {
    return { valid: false }
  }

  // In production, validate against database
  // const isValid = await validateKeyInDatabase(key)
  // return { valid: isValid, key: isValid ? key : undefined }

  return { valid: true, key }
}

/**
 * Implement CORS policy
 */
export function validateCORS(
  request: NextRequest,
  allowedOrigins: string[] = ['http://localhost:3000']
): { valid: boolean; headers?: Record<string, string> } {
  const origin = request.headers.get('origin')

  if (!origin) {
    // No origin header - might be same-origin or direct request
    return { valid: true }
  }

  // In development, allow localhost
  if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
    return {
      valid: true,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'true',
      },
    }
  }

  // Check against whitelist
  if (!allowedOrigins.includes(origin)) {
    logSecurityEvent({
      type: 'cors_violation',
      severity: 'medium',
      details: `Request from disallowed origin: ${origin}`,
    })
    return { valid: false }
  }

  return {
    valid: true,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Allow-Credentials': 'true',
    },
  }
}

/**
 * Rate limiting helper
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  limit = 100,
  windowMs = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 }
  }

  record.count++
  return { allowed: true, remaining: limit - record.count }
}

/**
 * Validate JSON Web Token (JWT) - simple version
 * In production, use jsonwebtoken package
 */
export function validateJWT(token: string, secret: string): { valid: boolean; payload?: any } {
  try {
    // This is a simplified example. Use jsonwebtoken package in production
    const parts = token.split('.')
    if (parts.length !== 3) {
      return { valid: false }
    }

    // In production:
    // import jwt from 'jsonwebtoken'
    // const decoded = jwt.verify(token, secret)
    // return { valid: true, payload: decoded }

    return { valid: true }
  } catch {
    return { valid: false }
  }
}

/**
 * Sanitize user input from request
 */
export function sanitizeUserInput(input: any): any {
  if (typeof input === 'string') {
    return input
      .substring(0, 5000) // Limit length
      .replace(/[<>]/g, '') // Remove dangerous chars
      .trim()
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeUserInput)
  }

  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeUserInput(value)
    }
    return sanitized
  }

  return input
}
