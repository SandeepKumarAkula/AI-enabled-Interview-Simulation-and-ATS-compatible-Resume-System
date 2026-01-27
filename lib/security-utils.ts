import crypto from 'crypto'
import validator from 'validator'

/**
 * Input validation schemas
 */
export const ValidationRules = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-()]{10,}$/,
  url: /^https?:\/\/.+/,
  alphanumeric: /^[a-zA-Z0-9_\-\.]+$/,
  noSpecialChars: /^[a-zA-Z0-9\s\-.,()]+$/,
}

/**
 * Validate email address
 */
export function validateEmail(email: string): boolean {
  return validator.isEmail(email)
}

/**
 * Validate URL
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHTML(str: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
  }
  return str.replace(/[&<>"'\/]/g, (char) => map[char])
}

/**
 * Sanitize JSON to prevent injection
 */
export function sanitizeJSON(obj: any, maxDepth = 10, currentDepth = 0): any {
  if (currentDepth > maxDepth) {
    throw new Error('Object depth exceeds maximum allowed')
  }

  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'string') return escapeHTML(obj)
  if (typeof obj === 'number' || typeof obj === 'boolean') return obj

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeJSON(item, maxDepth, currentDepth + 1))
  }

  if (typeof obj === 'object') {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      // Validate key to prevent prototype pollution
      if (key !== '__proto__' && key !== 'constructor' && key !== 'prototype') {
        sanitized[key] = sanitizeJSON(value, maxDepth, currentDepth + 1)
      }
    }
    return sanitized
  }

  return obj
}

/**
 * Hash password using bcrypt-like algorithm (for demo - use bcrypt in production)
 */
export function hashPassword(password: string): string {
  // In production, use bcrypt: import bcrypt from 'bcryptjs'
  // This is a simple demonstration
  const salt = crypto.randomBytes(32).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 32, 'sha256')
    .toString('hex')
  return `${salt}.${hash}`
}

/**
 * Verify password
 */
export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split('.')
  const testHash = crypto
    .pbkdf2Sync(password, salt, 100000, 32, 'sha256')
    .toString('hex')
  return testHash === hash
}

/**
 * Generate secure random token
 */
export function generateToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Validate input length
 */
export function validateLength(input: string, min = 1, max = 10000): boolean {
  return input.length >= min && input.length <= max
}

/**
 * Prevent SQL injection - validate common SQL patterns
 */
export function validateNoSQLInjection(input: string): boolean {
  const sqlPatterns = /('|"|--|;|\/\*|\*\/|xp_|sp_|exec|execute)/gi
  return !sqlPatterns.test(input)
}

/**
 * Validate and sanitize file names
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9._\-]/g, '_')
    .substring(0, 255)
}

/**
 * Validate file type (by MIME type and extension)
 */
export function validateFileType(
  fileName: string,
  mimeType: string,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'application/pdf']
): boolean {
  if (!allowedTypes.includes(mimeType)) return false

  const ext = fileName.split('.').pop()?.toLowerCase()
  const validExtensions: { [key: string]: string[] } = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'application/pdf': ['pdf'],
  }

  const allowedExts = validExtensions[mimeType] || []
  return ext ? allowedExts.includes(ext) : false
}

/**
 * Validate file size
 */
export function validateFileSize(sizeInBytes: number, maxSizeInMB = 10): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  return sizeInBytes <= maxSizeInBytes
}

/**
 * Generate secure session ID
 */
export function generateSessionId(): string {
  return crypto.randomUUID()
}

/**
 * Encrypt sensitive data
 */
export function encryptData(data: string, key: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    Buffer.from(key, 'hex'),
    iv
  )
  
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  return `${iv.toString('hex')}.${authTag.toString('hex')}.${encrypted}`
}

/**
 * Decrypt sensitive data
 */
export function decryptData(encryptedData: string, key: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedData.split('.')
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(key, 'hex'),
    iv
  )
  
  decipher.setAuthTag(authTag)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

/**
 * Validate against common OWASP Top 10 vulnerabilities
 */
export function validateOWASP(input: string, maxLength = 5000): { valid: boolean; reason?: string } {
  // A1: Injection
  if (!validateNoSQLInjection(input)) {
    return { valid: false, reason: 'Potential SQL injection detected' }
  }

  // A7: Cross-Site Scripting (XSS)
  if (/<script|javascript:|on\w+\s*=/i.test(input)) {
    return { valid: false, reason: 'Potential XSS attack detected' }
  }

  // Length validation
  if (!validateLength(input, 0, maxLength)) {
    return { valid: false, reason: `Input exceeds maximum length of ${maxLength}` }
  }

  return { valid: true }
}

/**
 * Log security event
 */
export function logSecurityEvent(event: {
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  details: string
  ip?: string
  userId?: string
  timestamp?: Date
}): void {
  const logEntry = {
    ...event,
    timestamp: event.timestamp || new Date(),
  }

  if (process.env.SECURITY_LOGGING === 'true') {
    console.warn('[SECURITY]', JSON.stringify(logEntry))
  }

  // In production, send to logging service (e.g., Sentry, DataDog, ELK)
  if (process.env.NODE_ENV === 'production') {
    // sendToLoggingService(logEntry)
  }
}

/**
 * Validate request headers for common attacks
 */
export function validateRequestHeaders(headers: Record<string, string>): { valid: boolean; reason?: string } {
  // Check for suspicious user agents
  const userAgent = headers['user-agent']?.toLowerCase() || ''
  const suspiciousAgents = ['bot', 'crawler', 'scanner', 'nikto', 'nmap', 'sqlmap']
  
  if (suspiciousAgents.some(agent => userAgent.includes(agent))) {
    return { valid: false, reason: 'Suspicious user agent detected' }
  }

  // Check content length
  const contentLength = parseInt(headers['content-length'] || '0')
  if (contentLength > 100 * 1024 * 1024) { // 100MB
    return { valid: false, reason: 'Content length exceeds maximum allowed' }
  }

  return { valid: true }
}
