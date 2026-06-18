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

// GET /api/vendors/all  — auth + admin
export async function getAllVendors(token) {
  const res = await fetch(`${API_URL}/api/vendors/all`, {
    headers: authHeaders(token),
  })
  return handleResponse(res)
}

// PUT /api/vendors/approve/:id  — auth + admin
export async function approveVendor(token, id) {
  const res = await fetch(`${API_URL}/api/vendors/approve/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
  })
  return handleResponse(res)
}
