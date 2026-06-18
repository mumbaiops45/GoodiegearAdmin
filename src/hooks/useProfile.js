'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import { getAdminProfile, updateAdminProfile } from '@/services/profileService'

export function useProfile() {
  const router     = useRouter()
  const updateUser = useAuthStore((s) => s.updateUser)
  const logout     = useAuthStore((s) => s.logout)
  const storeUser  = useAuthStore((s) => s.user)

  const [profile,    setProfile]  = useState(storeUser)
  const [isFetching, setFetching] = useState(true)
  const [isUpdating, setUpdating] = useState(false)
  const [error,      setError]    = useState(null)
  const [success,    setSuccess]  = useState(null)

  // When the backend returns 401 the stored token is stale (e.g. a leftover
  // mock token). Clear the session and send the user back to login.
  const handleUnauthorized = useCallback(() => {
    logout()
    router.push('/admin/login')
  }, [logout, router])

  useEffect(() => {
    // getState() reads the already-hydrated Zustand store.
    // Using the reactive `token` from the component render cycle would be null
    // on the very first render (SSR has no localStorage), causing a 401.
    const token = useAuthStore.getState().token

    if (!token) {
      handleUnauthorized()
      return
    }

    let cancelled = false

    async function load() {
      setFetching(true)
      try {
        const data    = await getAdminProfile(token)
        const fetched = data.user ?? data
        if (cancelled) return
        setProfile(fetched)
        updateUser(fetched)
      } catch (err) {
        if (cancelled) return
        if (err.status === 401) { handleUnauthorized(); return }
        setError(err.message)
      } finally {
        if (!cancelled) setFetching(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [updateUser, handleUnauthorized])

  // Returns { ok: true, message } on success or { ok: false, message } on error
  // so individual form components can show inline feedback right where the user is looking.
  const updateProfile = useCallback(
    async (payload) => {
      const token = useAuthStore.getState().token
      setUpdating(true)
      setError(null)
      setSuccess(null)
      try {
        const data    = await updateAdminProfile(token, payload)
        const updated = data.user ?? data
        setProfile(updated)
        updateUser(updated)
        const msg = data.message ?? 'Profile updated successfully'
        setSuccess(msg)
        return { ok: true, message: msg }
      } catch (err) {
        if (err.status === 401) { handleUnauthorized(); return { ok: false, message: 'Session expired' } }
        setError(err.message)
        return { ok: false, message: err.message }
      } finally {
        setUpdating(false)
      }
    },
    [updateUser, handleUnauthorized]
  )

  return {
    profile,
    isFetching,
    isUpdating,
    error,
    success,
    updateProfile,
    clearError:   () => setError(null),
    clearSuccess: () => setSuccess(null),
  }
}
