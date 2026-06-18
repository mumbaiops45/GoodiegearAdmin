const API_URL  = process.env.NEXT_PUBLIC_API_URL
const USE_MOCK = process.env.NEXT_PUBLIC_MOCK_AUTH === 'true'

// Mock profile — only used when NEXT_PUBLIC_MOCK_AUTH=true
const MOCK_PROFILE = {
  id: '1',
  name: 'GoodieGear Admin',
  email: 'admin@gudigere.com',
  role: 'admin',
  profilePhoto: null,
}

// Attach status to the error so callers can detect 401 and redirect to login
async function handleResponse(res) {
  const data = await res.json()
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed')
    err.status = res.status
    throw err
  }
  return data
}

export async function getAdminProfile(token) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400))
    return { user: MOCK_PROFILE }
  }

  const res = await fetch(`${API_URL}/api/admin/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return handleResponse(res)
}

// payload: plain object { name, email, password } OR FormData { name, profilePhoto }
export async function updateAdminProfile(token, payload) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600))
    const isFormData = payload instanceof FormData
    const updated = {
      ...MOCK_PROFILE,
      name:         isFormData ? payload.get('name')  : (payload.name  ?? MOCK_PROFILE.name),
      email:        isFormData ? MOCK_PROFILE.email   : (payload.email ?? MOCK_PROFILE.email),
      profilePhoto: isFormData && payload.get('profilePhoto')
        ? URL.createObjectURL(payload.get('profilePhoto'))
        : MOCK_PROFILE.profilePhoto,
    }
    Object.assign(MOCK_PROFILE, updated)
    return { message: 'Profile updated successfully', user: updated }
  }

  const isFormData = payload instanceof FormData

  const res = await fetch(`${API_URL}/api/admin/profile`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      // Do NOT set Content-Type for FormData — browser sets boundary automatically
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    },
    body: isFormData ? payload : JSON.stringify(payload),
  })
  return handleResponse(res)
}
