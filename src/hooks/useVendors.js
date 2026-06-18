'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import { getAllVendors, approveVendor } from '@/services/vendorService'

export function useVendors() {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)

  const [vendors,     setVendors]     = useState([])
  const [isFetching,  setFetching]    = useState(true)
  const [fetchError,  setFetchError]  = useState(null)
  const [search,      setSearch]      = useState('')
  const [filterStatus,setFilterStatus]= useState('')

  const [approvingId, setApprovingId] = useState(null) // id currently being approved
  const [successMsg,  setSuccessMsg]  = useState(null)

  // ── detail modal ──────────────────────────────────────────────
  const [detailVendor, setDetailVendor] = useState(null)

  const handleUnauthorized = useCallback(() => {
    logout()
    router.push('/admin/login')
  }, [logout, router])

  const fetchVendors = useCallback(async () => {
    const token = useAuthStore.getState().token
    setFetching(true)
    setFetchError(null)
    try {
      const data = await getAllVendors(token)
      const list = data.vendors ?? data.data ?? (Array.isArray(data) ? data : [])
      setVendors(list)
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setFetchError(err.message)
    } finally {
      setFetching(false)
    }
  }, [handleUnauthorized])

  useEffect(() => { fetchVendors() }, [fetchVendors])

  const handleApprove = useCallback(async (id) => {
    const token = useAuthStore.getState().token
    setApprovingId(id)
    try {
      await approveVendor(token, id)
      setSuccessMsg('Vendor approved successfully')
      fetchVendors()
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setFetchError(err.message)
    } finally {
      setApprovingId(null)
    }
  }, [fetchVendors, handleUnauthorized])

  // auto-dismiss success
  useEffect(() => {
    if (!successMsg) return
    const t = setTimeout(() => setSuccessMsg(null), 3500)
    return () => clearTimeout(t)
  }, [successMsg])

  // client-side filter
  const filtered = vendors.filter((v) => {
    const name  = (v.shopName ?? v.user?.name ?? '').toLowerCase()
    const email = (v.user?.email ?? '').toLowerCase()
    const matchSearch = !search || name.includes(search.toLowerCase()) || email.includes(search.toLowerCase())
    const matchStatus =
      !filterStatus ||
      (filterStatus === 'approved' && v.isApproved === true) ||
      (filterStatus === 'pending'  && v.isApproved === false)
    return matchSearch && matchStatus
  })

  return {
    vendors: filtered, allVendors: vendors,
    isFetching, fetchError,
    search, setSearch, filterStatus, setFilterStatus,
    approvingId, handleApprove,
    detailVendor, setDetailVendor,
    successMsg,
  }
}
