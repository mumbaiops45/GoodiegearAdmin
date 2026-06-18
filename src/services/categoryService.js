const API_URL = process.env.NEXT_PUBLIC_API_URL

async function handleResponse(res) {
  const data = await res.json()
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed')
    err.status = res.status
    throw err
  }
  return data
}

// GET /api/categories  — public
export async function getCategories() {
  const res = await fetch(`${API_URL}/api/categories`)
  return handleResponse(res)
}

// GET /api/categories/:id  — public
export async function getCategoryById(id) {
  const res = await fetch(`${API_URL}/api/categories/${id}`)
  return handleResponse(res)
}

// POST /api/categories  — auth + admin
// Sends FormData so the image file goes through multer on the backend
export async function createCategory(token, payload) {
  const res = await fetch(`${API_URL}/api/categories`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }, // no Content-Type — browser sets multipart boundary
    body: payload, // FormData
  })
  return handleResponse(res)
}

// PUT /api/categories/:id  — auth + admin
export async function updateCategory(token, id, payload) {
  const res = await fetch(`${API_URL}/api/categories/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: payload, // FormData
  })
  return handleResponse(res)
}

// DELETE /api/categories/:id  — auth + admin
export async function deleteCategory(token, id) {
  const res = await fetch(`${API_URL}/api/categories/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  return handleResponse(res)
}
