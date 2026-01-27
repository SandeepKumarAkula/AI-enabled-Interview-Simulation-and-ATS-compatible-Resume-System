export function setToken(_token: string) {
  // Intentionally no-op. Server now sets HttpOnly cookie on login.
}

export function getToken(): string | null {
  // Deprecated: use cookie-based session. Keep function for compatibility.
  return null
}

export function clearToken() {
  // No-op for cookie-based auth; to logout, call the logout API.
}

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

let csrfBootstrapPromise: Promise<void> | null = null
async function ensureCsrfToken() {
  const existing = getCookieValue('csrfToken')
  if (existing) return

  if (!csrfBootstrapPromise) {
    csrfBootstrapPromise = fetch('/api/csrf', { credentials: 'include' })
      .then(() => undefined)
      .finally(() => {
        csrfBootstrapPromise = null
      })
  }

  await csrfBootstrapPromise
}

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  // Prefer cookie-based auth (browser will send HttpOnly cookie automatically).
  const token = getToken()
  const headers = new Headers(init?.headers as HeadersInit)
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const method = (init?.method || 'GET').toUpperCase()
  const urlStr = typeof input === 'string' ? input : (input as Request).url
  const isStateChanging = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)
  const isCsrfRoute = urlStr.includes('/api/csrf')

  if (isStateChanging && !isCsrfRoute) {
    await ensureCsrfToken()
    const csrf = getCookieValue('csrfToken')
    if (csrf) headers.set('x-csrf-token', csrf)
  }

  const res = await fetch(input, { ...init, headers, credentials: 'include' })
  return res
}

export async function logout() {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
}
