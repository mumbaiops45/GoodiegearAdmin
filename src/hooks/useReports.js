'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import { getDashboardReports, getDashboardOverview } from '@/services/dashboardService'
import { getErrorMessage } from '@/utils/getErrorMessage'

export function useReports() {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)

  const [reports,    setReports]    = useState(null) // { avgOrderValue, totalOrders, topProducts }
  const [overview,   setOverview]   = useState(null) // { productsByCategory, salesByMonth }
  const [isFetching, setFetching]   = useState(true)
  const [error,      setError]      = useState(null)

  const fetchAll = useCallback(async () => {
    const token = useAuthStore.getState().token
    setFetching(true)
    setError(null)
    try {
      const [reportsRes, overviewRes] = await Promise.all([
        getDashboardReports(token),
        getDashboardOverview(token),
      ])
      setReports(reportsRes.data ?? null)
      setOverview(overviewRes.data ?? null)
    } catch (err) {
      if (err.status === 401) { logout(); router.push('/admin/login'); return }
      setError(getErrorMessage(err))
    } finally {
      setFetching(false)
    }
  }, [logout, router])

  useEffect(() => { fetchAll() }, [fetchAll])

  return { reports, overview, isFetching, error, refetch: fetchAll }
}
