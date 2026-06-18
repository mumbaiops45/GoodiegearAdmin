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

// GET /api/products?page=1&limit=10&search=&category=&isActive=
export async function getProducts(params = {}, token) {
  const { page = 1, limit = 10, ...rest } = params
  const query = new URLSearchParams(
    Object.entries({ page, limit, ...rest }).filter(([, v]) => v !== '' && v != null)
  ).toString()
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const res = await fetch(`${API_URL}/api/products?${query}`, { headers })
  return handleResponse(res)
}

// GET /api/products/:id
export async function getSingleProduct(id) {
  const res = await fetch(`${API_URL}/api/products/${id}`)
  return handleResponse(res)
}

// POST /api/products  (auth + vendor)
export async function createProduct(token, body) {
  const res = await fetch(`${API_URL}/api/products`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  })
  return handleResponse(res)
}

// PUT /api/products/:id  (auth + vendor)
export async function updateProduct(token, id, body) {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(body),
  })
  return handleResponse(res)
}

// DELETE /api/products/:id  (auth + vendor)
export async function deleteProduct(token, id) {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  return handleResponse(res)
}

// POST /api/products/upload/:id  (auth + vendor, multipart)
export async function uploadProductImage(token, id, imageFile) {
  const fd = new FormData()
  fd.append('image', imageFile)
  const res = await fetch(`${API_URL}/api/products/upload/${id}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }, // no Content-Type — browser sets multipart boundary
    body: fd,
  })
  return handleResponse(res)
}
