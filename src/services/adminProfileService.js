const API_URL = process.env.NEXT_PUBLIC_API_URL

function authHeaders(token) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

async function handleResponse(res) {
  const data = await res.json()
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed')
    err.status = res.status
    throw err
  }
  return data
}

// GET /api/admin/profile
export async function getAdminProfile(token) {
  const res = await fetch(`${API_URL}/api/admin/profile`, {
    headers: authHeaders(token),
  })
  return handleResponse(res)
}

// PUT /api/admin/profile  (multipart — name + optional profilePhoto)
export async function updateAdminProfile(token, formData) {
  const res = await fetch(`${API_URL}/api/admin/profile`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  return handleResponse(res)
}
