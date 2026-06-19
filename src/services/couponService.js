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

export async function getCoupons(token) {
  const res = await fetch(`${API_URL}/api/coupons`, { headers: authHeaders(token) })
  return handleResponse(res)
}

export async function createCoupon(token, body) {
  const res = await fetch(`${API_URL}/api/coupons`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  })
  return handleResponse(res)
}

export async function updateCoupon(token, id, body) {
  const res = await fetch(`${API_URL}/api/coupons/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  })
  return handleResponse(res)
}

export async function deleteCoupon(token, id) {
  const res = await fetch(`${API_URL}/api/coupons/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  return handleResponse(res)
}

export async function toggleCoupon(token, id) {
  const res = await fetch(`${API_URL}/api/coupons/${id}/toggle`, {
    method: 'PATCH',
    headers: authHeaders(token),
  })
  return handleResponse(res)
}
