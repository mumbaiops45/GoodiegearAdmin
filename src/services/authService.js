const API_URL  = process.env.NEXT_PUBLIC_API_URL
const USE_MOCK = process.env.NEXT_PUBLIC_MOCK_AUTH === 'true'
const IS_DEV   = process.env.NODE_ENV === 'development'

// Mock admin — used only when NEXT_PUBLIC_MOCK_AUTH=true
const MOCK_USER        = { id: '1', name: 'GoodieGear Admin', email: 'admin@gudigere.com', role: 'admin' }
const MOCK_CREDENTIALS = { email: 'admin@gudigere.com', password: 'Admin@123' }

async function handleResponse(res) {
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

// Picks the token from whichever field the backend uses.
// Covers: token | accessToken | access_token | jwt | jwtToken
function extractToken(data) {
  return data.token ?? data.accessToken ?? data.access_token ?? data.jwt ?? data.jwtToken ?? null
}

// Picks the user object from whichever field the backend uses.
// Covers: user | admin | data
function extractUser(data) {
  return data.user ?? data.admin ?? data.data ?? null
}

export async function loginAdmin({ email, password }) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800))
    if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
      return { user: MOCK_USER, token: 'mock-token-dev' }
    }
    throw new Error('Invalid email or password')
  }

  const res  = await fetch(`${API_URL}/api/auth/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await handleResponse(res)

  // Log raw response in dev so you can see exactly what field names your backend uses
  if (IS_DEV) console.log('[loginAdmin] raw response:', data)

  const token = extractToken(data)
  const user  = extractUser(data)

  if (!token) {
    console.error('[loginAdmin] No token found in response. Keys received:', Object.keys(data))
    throw new Error('Login succeeded but no token was returned. Check your backend response.')
  }

  return { user, token }
}

export async function logoutAdmin(token) {
  if (USE_MOCK) return { success: true }

  const res = await fetch(`${API_URL}/api/auth/admin-logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  return handleResponse(res)
}
