'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import { getAllCustomers, deleteUser } from '@/services/customerService'
import { getErrorMessage } from '@/utils/getErrorMessage'

export function useCustomers() {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)

  const [customers,    setCustomers]    = useState([])
  const [isFetching,   setFetching]     = useState(true)
  const [fetchError,   setFetchError]   = useState(null)
  const [search,       setSearch]       = useState('')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting,   setDeleting]     = useState(false)

  const [successMsg,   setSuccessMsg]   = useState(null)

  const handleUnauthorized = useCallback(() => {
    logout()
    router.push('/admin/login')
  }, [logout, router])

  const fetchCustomers = useCallback(async () => {
    const token = useAuthStore.getState().token
    setFetching(true)
    setFetchError(null)
    try {
      const data = await getAllCustomers(token)
      const raw  = data.customers ?? data.users ?? data.data ?? (Array.isArray(data) ? data : [])
      const list = raw.filter((u) => u.role === 'customer')
      setCustomers(list)
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setFetchError(getErrorMessage(err))
    } finally {
      setFetching(false)
    }
  }, [handleUnauthorized])

  useEffect(() => { fetchCustomers() }, [fetchCustomers])

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return
    const token = useAuthStore.getState().token
    setDeleting(true)
    try {
      await deleteUser(token, deleteTarget._id)
      setSuccessMsg(`"${deleteTarget.name}" removed`)
      setDeleteTarget(null)
      fetchCustomers()
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setFetchError(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }, [deleteTarget, fetchCustomers, handleUnauthorized])

  // auto-dismiss success
  useEffect(() => {
    if (!successMsg) return
    const t = setTimeout(() => setSuccessMsg(null), 3500)
    return () => clearTimeout(t)
  }, [successMsg])

  // client-side search
  const filtered = customers.filter((c) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (c.name  ?? '').toLowerCase().includes(q) ||
      (c.email ?? '').toLowerCase().includes(q)
    )
  })

  return {
    customers: filtered,
    allCustomers: customers,
    isFetching,
    fetchError,
    search, setSearch,
    deleteTarget, setDeleteTarget,
    isDeleting, confirmDelete,
    successMsg,
  }
}
