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

// GET /api/reviews?status=Pending  — auth + admin
export async function getAllReviews(token, params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== '' && v != null)
  ).toString()
  const res = await fetch(`${API_URL}/api/reviews${query ? `?${query}` : ''}`, {
    headers: authHeaders(token),
  })
  return handleResponse(res)
}

// GET /api/reviews/:id  — auth + admin
export async function getReview(token, id) {
  const res = await fetch(`${API_URL}/api/reviews/${id}`, {
    headers: authHeaders(token),
  })
  return handleResponse(res)
}

// PATCH /api/reviews/:id/approve  — auth + admin
export async function approveReview(token, id) {
  const res = await fetch(`${API_URL}/api/reviews/${id}/approve`, {
    method: 'PATCH',
    headers: authHeaders(token),
  })
  return handleResponse(res)
}

// PATCH /api/reviews/:id/reject  — auth + admin
export async function rejectReview(token, id) {
  const res = await fetch(`${API_URL}/api/reviews/${id}/reject`, {
    method: 'PATCH',
    headers: authHeaders(token),
  })
  return handleResponse(res)
}
