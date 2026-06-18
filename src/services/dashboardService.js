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

// GET /api/dashboard/stats — KPI cards
export async function getDashboardStats(token) {
  const res = await fetch(`${API_URL}/api/dashboard/stats`, {
    headers: authHeaders(token),
  })
  return handleResponse(res)
}

// GET /api/dashboard/overview — charts + recent orders + pending reviews
export async function getDashboardOverview(token) {
  const res = await fetch(`${API_URL}/api/dashboard/overview`, {
    headers: authHeaders(token),
  })
  return handleResponse(res)
}

// GET /api/dashboard/reports — avg order value + top products
export async function getDashboardReports(token) {
  const res = await fetch(`${API_URL}/api/dashboard/reports`, {
    headers: authHeaders(token),
  })
  return handleResponse(res)
}
