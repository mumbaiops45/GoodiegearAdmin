'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import { loginAdmin, logoutAdmin } from '@/services/authService'

export function useAuth() {
  const router = useRouter()
  const { user, token, isAuthenticated, isLoading, error, setAuth, setError, setLoading, logout, clearError } =
    useAuthStore()

  const login = useCallback(
    async (credentials) => {
      setLoading(true)
      clearError()
      try {
        const data = await loginAdmin(credentials)
        setAuth(data.user, data.token)
        router.push('/admin/dashboard')
      } catch (err) {
        setError(err.message)
      }
    },
    [setLoading, clearError, setAuth, setError, router]
  )

  const signOut = useCallback(async () => {
    try {
      if (token) await logoutAdmin(token)
    } finally {
      logout()
      router.push('/admin/login')
    }
  }, [token, logout, router])

  return { user, token, isAuthenticated, isLoading, error, login, signOut, clearError }
}
