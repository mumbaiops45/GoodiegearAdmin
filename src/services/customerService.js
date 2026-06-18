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

// GET /api/admin/customers
export async function getAllCustomers(token) {
  const res = await fetch(`${API_URL}/api/admin/customers`, {
    headers: authHeaders(token),
  })
  return handleResponse(res)
}

// DELETE /api/admin/users/:id
export async function deleteUser(token, id) {
  const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  return handleResponse(res)
}
