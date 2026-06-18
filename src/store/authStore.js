import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Field renamed: admin → user to match backend response shape { token, user }.
const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setLoading: (isLoading) => set({ isLoading }),

      setAuth: (user, token) => {
        if (!token) {
          console.error('[authStore] setAuth called with empty token — login flow broken')
          return
        }
        // Sync token to cookie so Next.js middleware can read it server-side
        document.cookie = `admin-token=${token}; path=/; max-age=${60 * 60 * 24}; SameSite=Strict`
        set({ user, token, isAuthenticated: true, error: null, isLoading: false })
      },

      // Update user fields after profile edit without resetting the token
      updateUser: (user) => set({ user }),

      setError: (error) => set({ error, isLoading: false }),

      clearError: () => set({ error: null }),

      logout: () => {
        document.cookie = 'admin-token=; path=/; max-age=0'
        set({ user: null, token: null, isAuthenticated: false, error: null })
      },
    }),
    {
      name: 'admin-auth',
      partialize: (s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }),
    }
  )
)

export default useAuthStore
