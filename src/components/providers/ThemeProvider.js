'use client'

// Adapted from OJAIN theme.jsx → Next.js compatible version.
// Key difference: localStorage & window.matchMedia must be guarded for SSR.

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)
const STORAGE_KEY = 'goodiegear.theme'

function getInitialChoice() {
  if (typeof window === 'undefined') return 'system'
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system'
}

function systemPrefersDark() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
}

function resolve(choice) {
  return choice === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : choice
}

export function ThemeProvider({ children }) {
  const [choice, setChoice] = useState('system')

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => { setChoice(getInitialChoice()) }, [])

  useEffect(() => {
    const apply = () =>
      document.documentElement.classList.toggle('dark', resolve(choice) === 'dark')
    apply()
    localStorage.setItem(STORAGE_KEY, choice)

    if (choice === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    }
  }, [choice])

  return (
    <ThemeContext.Provider
      value={{
        choice,
        theme: resolve(choice),
        isDark: resolve(choice) === 'dark',
        setTheme: (next) => setChoice(next),
        toggleTheme: () => setChoice((c) => (resolve(c) === 'dark' ? 'light' : 'dark')),
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
