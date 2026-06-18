const API_URL = process.env.NEXT_PUBLIC_API_URL

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` }
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

// GET /api/banners?placement=Home+Hero  — public
export async function getBanners(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== '' && v != null)
  ).toString()
  const res = await fetch(`${API_URL}/api/banners${query ? `?${query}` : ''}`)
  return handleResponse(res)
}

// GET /api/banners/:id  — public
export async function getBanner(id) {
  const res = await fetch(`${API_URL}/api/banners/${id}`)
  return handleResponse(res)
}

// POST /api/banners  — auth + admin, multipart
export async function createBanner(token, formData) {
  const res = await fetch(`${API_URL}/api/banners`, {
    method: 'POST',
    headers: authHeaders(token),
    body: formData,
  })
  return handleResponse(res)
}

// PUT /api/banners/:id  — auth + admin, multipart
export async function updateBanner(token, id, formData) {
  const res = await fetch(`${API_URL}/api/banners/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: formData,
  })
  return handleResponse(res)
}

// DELETE /api/banners/:id  — auth + admin
export async function deleteBanner(token, id) {
  const res = await fetch(`${API_URL}/api/banners/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
  })
  return handleResponse(res)
}

// PATCH /api/banners/:id/toggle  — auth + admin
export async function toggleBanner(token, id) {
  const res = await fetch(`${API_URL}/api/banners/${id}/toggle`, {
    method: 'PATCH',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
  })
  return handleResponse(res)
}
