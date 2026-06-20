'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import { getDashboardStats, getDashboardOverview } from '@/services/dashboardService'
import { getErrorMessage } from '@/utils/getErrorMessage'

export function useDashboard() {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)

  const [stats,      setStats]      = useState([])   // array of { key, label, value }
  const [overview,   setOverview]   = useState(null) // { ordersByStatus, productsByCategory, salesByMonth, pendingReviews, recentOrders }
  const [isFetching, setFetching]   = useState(true)
  const [error,      setError]      = useState(null)

  const fetchAll = useCallback(async () => {
    const token = useAuthStore.getState().token
    setFetching(true)
    setError(null)
    try {
      const [statsRes, overviewRes] = await Promise.all([
        getDashboardStats(token),
        getDashboardOverview(token),
      ])
      setStats(statsRes.data ?? [])
      setOverview(overviewRes.data ?? null)
    } catch (err) {
      if (err.status === 401) { logout(); router.push('/admin/login'); return }
      setError(getErrorMessage(err))
    } finally {
      setFetching(false)
    }
  }, [logout, router])

  useEffect(() => { fetchAll() }, [fetchAll])

  return { stats, overview, isFetching, error, refetch: fetchAll }
}
