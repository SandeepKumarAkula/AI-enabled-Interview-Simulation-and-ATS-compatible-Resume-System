/**
 * SECURE API ROUTE TEMPLATE
 * 
 * This template demonstrates security best practices for all API routes:
 * 1. Input validation and sanitization
 * 2. Authentication checks
 * 3. Rate limiting
 * 4. Error handling without exposing sensitive info
 * 5. CORS validation
 * 6. Request logging for security audits
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  createSecureResponse,
  createSecureErrorResponse,
  parseSecureRequestBody,
  validateQueryParams,
  getClientIP,
  checkRateLimit,
  validateCORS,
} from '@/lib/api-security'
import { logSecurityEvent, validateOWASP } from '@/lib/security-utils'

/**
 * GET endpoint example
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Check CORS
    const corsValidation = validateCORS(request)
    if (!corsValidation.valid) {
      return createSecureErrorResponse({ error: 'CORS policy violation' }, 403)
    }

    // 2. Rate limiting
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(clientIP, 100, 60000)
    if (!rateLimit.allowed) {
      logSecurityEvent({
        type: 'rate_limit_exceeded',
        severity: 'medium',
        details: `Rate limit exceeded for IP: ${clientIP}`,
        ip: clientIP,
      })
      return createSecureErrorResponse({ error: 'Too many requests' }, 429)
    }

    // 3. Validate query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams)
    const queryValidation = validateQueryParams(searchParams, ['search', 'limit', 'offset'])
    
    if (!queryValidation.valid) {
      logSecurityEvent({
        type: 'invalid_query_params',
        severity: 'low',
        details: queryValidation.error || 'Invalid query parameters',
        ip: clientIP,
      })
      return createSecureErrorResponse({ error: queryValidation.error }, 400)
    }

    // 4. Your business logic here
    const data = {
      message: 'Success',
      // ... your data
    }

    // 5. Return secure response
    return createSecureResponse(data, 200, corsValidation.headers)
  } catch (error) {
    logSecurityEvent({
      type: 'api_error',
      severity: 'high',
      details: `GET endpoint error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ip: getClientIP(request),
    })
    return createSecureErrorResponse(error)
  }
}

/**
 * POST endpoint example
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Check CORS
    const corsValidation = validateCORS(request)
    if (!corsValidation.valid) {
      return createSecureErrorResponse({ error: 'CORS policy violation' }, 403)
    }

    // 2. Rate limiting (stricter for mutations)
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(clientIP, 20, 60000) // 20 requests per minute
    if (!rateLimit.allowed) {
      logSecurityEvent({
        type: 'rate_limit_exceeded_post',
        severity: 'medium',
        details: `Rate limit exceeded for IP: ${clientIP}`,
        ip: clientIP,
      })
      return createSecureErrorResponse({ error: 'Too many requests' }, 429)
    }

    // 3. Parse and validate request body
    const bodyParse = await parseSecureRequestBody(request)
    if (!bodyParse.valid) {
      logSecurityEvent({
        type: 'invalid_request_body',
        severity: 'low',
        details: bodyParse.error || 'Invalid request body',
        ip: clientIP,
      })
      return createSecureErrorResponse({ error: bodyParse.error }, 400)
    }

    const body = bodyParse.data

    // 4. Validate individual fields against OWASP
    if (body.name) {
      const nameValidation = validateOWASP(body.name, 100)
      if (!nameValidation.valid) {
        return createSecureErrorResponse({ error: nameValidation.reason }, 400)
      }
    }

    if (body.email) {
      const emailValidation = validateOWASP(body.email, 255)
      if (!emailValidation.valid) {
        return createSecureErrorResponse({ error: emailValidation.reason }, 400)
      }
    }

    // 5. Your business logic here
    // - Authenticate user
    // - Validate permissions
    // - Process data
    // - Save to database

    const result = {
      success: true,
      message: 'Data processed successfully',
      // ... your result data
    }

    // 6. Return secure response
    return createSecureResponse(result, 201, corsValidation.headers)
  } catch (error) {
    logSecurityEvent({
      type: 'api_error_post',
      severity: 'high',
      details: `POST endpoint error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ip: getClientIP(request),
    })
    return createSecureErrorResponse(error)
  }
}

/**
 * OPTIONS endpoint for CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  const corsValidation = validateCORS(request)
  
  if (!corsValidation.valid) {
    return new NextResponse(null, { status: 403 })
  }

  return new NextResponse(null, {
    status: 200,
    headers: corsValidation.headers,
  })
}
