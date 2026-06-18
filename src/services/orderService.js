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

// GET /api/admin/orders
export async function getAllOrders(token) {
  const res = await fetch(`${API_URL}/api/admin/orders`, {
    headers: authHeaders(token),
  })
  return handleResponse(res)
}

// PUT /api/admin/orders/:id/status
export async function updateOrderStatus(token, id, orderStatus) {
  const res = await fetch(`${API_URL}/api/admin/orders/${id}/status`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ orderStatus }),
  })
  return handleResponse(res)
}
