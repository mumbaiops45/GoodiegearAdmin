'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import { getAllOrders, updateOrderStatus } from '@/services/orderService'

export function useOrders() {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)

  const [orders,        setOrders]        = useState([])
  const [isFetching,    setFetching]      = useState(true)
  const [fetchError,    setFetchError]    = useState(null)
  const [search,        setSearch]        = useState('')
  const [filterStatus,  setFilterStatus]  = useState('')
  const [filterPayment, setFilterPayment] = useState('')

  const [detailOrder,   setDetailOrder]   = useState(null)
  const [updatingId,    setUpdatingId]    = useState(null)
  const [updateError,   setUpdateError]   = useState(null)
  const [successMsg,    setSuccessMsg]    = useState(null)

  const handleUnauthorized = useCallback(() => {
    logout()
    router.push('/admin/login')
  }, [logout, router])

  const fetchOrders = useCallback(async () => {
    const token = useAuthStore.getState().token
    setFetching(true)
    setFetchError(null)
    try {
      const data = await getAllOrders(token)
      const raw  = data.orders ?? data.data ?? (Array.isArray(data) ? data : [])
      // sort oldest-first so ORD-1 is the first-ever order
      const asc  = [...raw].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      const withIds = asc.map((o, i) => ({ ...o, displayId: `ORD-${i + 1}` }))
      setOrders(withIds.reverse()) // latest first in display
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setFetchError(err.message)
    } finally {
      setFetching(false)
    }
  }, [handleUnauthorized])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  useEffect(() => {
    if (!successMsg) return
    const t = setTimeout(() => setSuccessMsg(null), 3500)
    return () => clearTimeout(t)
  }, [successMsg])

  const handleStatusUpdate = useCallback(async (id, newStatus) => {
    const token = useAuthStore.getState().token
    setUpdatingId(id)
    setUpdateError(null)
    try {
      await updateOrderStatus(token, id, newStatus)
      setSuccessMsg(`Order status updated to "${newStatus}".`)
      setOrders((prev) =>
        prev.map((o) => o._id === id ? { ...o, orderStatus: newStatus } : o)
      )
      setDetailOrder(null)
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setUpdateError(err.message)
    } finally {
      setUpdatingId(null)
    }
  }, [handleUnauthorized])

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase()
    const matchSearch = !search ||
      (o.displayId ?? '').toLowerCase().includes(q) ||
      (o.user?.name  ?? '').toLowerCase().includes(q) ||
      (o.user?.email ?? '').toLowerCase().includes(q)
    const matchStatus  = !filterStatus  || o.orderStatus   === filterStatus
    const matchPayment = !filterPayment || o.paymentStatus === filterPayment
    return matchSearch && matchStatus && matchPayment
  })

  // counts per status for tab badges
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.orderStatus] = (acc[o.orderStatus] ?? 0) + 1
    return acc
  }, {})

  return {
    orders: filtered, allOrders: orders, total: orders.length,
    isFetching, fetchError,
    search, setSearch,
    filterStatus, setFilterStatus,
    filterPayment, setFilterPayment,
    statusCounts,
    detailOrder, setDetailOrder,
    updatingId, updateError, handleStatusUpdate,
    successMsg,
    refresh: fetchOrders,
  }
}
