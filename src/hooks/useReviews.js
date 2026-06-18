'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import { getAllReviews, approveReview, rejectReview } from '@/services/reviewService'

export function useReviews() {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)

  const [reviews,      setReviews]      = useState([])
  const [isFetching,   setFetching]     = useState(true)
  const [fetchError,   setFetchError]   = useState(null)
  const [search,       setSearch]       = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const [actionId,   setActionId]   = useState(null) // id currently being approved/rejected
  const [successMsg, setSuccessMsg] = useState(null)
  const [detailReview, setDetailReview] = useState(null)

  const handleUnauthorized = useCallback(() => {
    logout()
    router.push('/admin/login')
  }, [logout, router])

  const fetchReviews = useCallback(async () => {
    const token = useAuthStore.getState().token
    setFetching(true)
    setFetchError(null)
    try {
      const data = await getAllReviews(token, filterStatus ? { status: filterStatus } : {})
      const list = data.reviews ?? data.data ?? (Array.isArray(data) ? data : [])
      setReviews(list)
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setFetchError(err.message)
    } finally {
      setFetching(false)
    }
  }, [handleUnauthorized, filterStatus])

  useEffect(() => { fetchReviews() }, [fetchReviews])

  const handleApprove = useCallback(async (id) => {
    const token = useAuthStore.getState().token
    setActionId(id)
    try {
      await approveReview(token, id)
      setSuccessMsg('Review approved and published.')
      fetchReviews()
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setFetchError(err.message)
    } finally {
      setActionId(null)
    }
  }, [fetchReviews, handleUnauthorized])

  const handleReject = useCallback(async (id) => {
    const token = useAuthStore.getState().token
    setActionId(id)
    try {
      await rejectReview(token, id)
      setSuccessMsg('Review rejected.')
      fetchReviews()
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setFetchError(err.message)
    } finally {
      setActionId(null)
    }
  }, [fetchReviews, handleUnauthorized])

  useEffect(() => {
    if (!successMsg) return
    const t = setTimeout(() => setSuccessMsg(null), 3500)
    return () => clearTimeout(t)
  }, [successMsg])

  const filtered = reviews.filter((r) => {
    const product  = (r.product?.title ?? r.productTitle ?? '').toLowerCase()
    const customer = (r.user?.name ?? r.userName ?? r.user?.email ?? '').toLowerCase()
    const comment  = (r.comment ?? r.text ?? '').toLowerCase()
    const q = search.toLowerCase()
    return !search || product.includes(q) || customer.includes(q) || comment.includes(q)
  })

  return {
    reviews: filtered, allReviews: reviews,
    isFetching, fetchError,
    search, setSearch,
    filterStatus, setFilterStatus,
    actionId, handleApprove, handleReject,
    detailReview, setDetailReview,
    successMsg, refresh: fetchReviews,
  }
}
