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
      .then(async (res) => {
        // Try to read cookie set by the server. If it wasn't stored (some hosts/browsers),
        // fall back to reading token from JSON body and write it into document.cookie
        try {
          const after = getCookieValue('csrfToken')
          if (!after && res.ok) {
            const data = await res.json().catch(() => null)
            const token = data?.csrfToken
            if (token && typeof document !== 'undefined') {
              const secure = location.protocol === 'https:' ? '; Secure' : ''
              // Set cookie with same attributes as server-side (lax, path=/, 24h)
              document.cookie = `csrfToken=${encodeURIComponent(token)}; Path=/; Max-Age=${60 * 60 * 24}; SameSite=Lax${secure}`
            }
          }
        } catch (e) {
          // swallow - best effort fallback
        }
      })
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
