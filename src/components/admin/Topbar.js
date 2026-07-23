'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Menu, Search,
  Package, ShoppingCart, Star, User, Settings as SettingsIcon,
  LogOut, ChevronDown, CalendarDays,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useToast } from '@/components/providers/ToastProvider'
import { navItems } from '@/config/navItems'

const NOTIFICATIONS = [
  { id: 1, icon: ShoppingCart, text: 'New order #ORD-7841 placed', time: '2m ago', href: '/admin/orders' },
  { id: 2, icon: Package, text: 'A product is out of stock', time: '1h ago', href: '/admin/products' },
  { id: 3, icon: Star, text: '2 reviews awaiting moderation', time: '3h ago', href: '/admin/reviews' },
]

export default function Topbar({ onMenu }) {
  const router = useRouter()
  const toast = useToast()
  const { user, signOut } = useAuth()
  const { choice, isDark, setTheme } = useTheme()

  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [unread, setUnread] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const bellRef = useRef(null)
  const menuRef = useRef(null)
  const themeRef = useRef(null)
  const searchRef = useRef(null)

  const searchResults = query.trim()
    ? navItems.filter((n) => n.label.toLowerCase().includes(query.trim().toLowerCase()))
    : []

  // Close all dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false)
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
      if (themeRef.current && !themeRef.current.contains(e.target)) setThemeOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = () => {
    setMenuOpen(false)
    setShowLogoutConfirm(true)
  }

const confirmLogout = async () => {
  setShowLogoutConfirm(false)

  await signOut()

  toast('Signed out successfully', 'info')
  router.replace('/login')
}

  const cancelLogout = () => {
    setShowLogoutConfirm(false)
  }

  const submitSearch = (e) => {
    e.preventDefault()
    if (searchResults.length > 0) {
      navigateTo(searchResults[0])
    } else if (query.trim()) {
      toast(`No pages match "${query}"`, 'error')
      setQuery('')
      setSearchOpen(false)
    }
  }

  const navigateTo = (item) => {
    router.push(item.href)
    setQuery('')
    setSearchOpen(false)
  }

  const pickTheme = (value, label) => {
    setTheme(value)
    setThemeOpen(false)
    toast(`${label} mode enabled`, 'info')
  }

  const openBell = () => {
    setBellOpen((o) => !o)
    setUnread(false)
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenu}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search bar */}
      <div ref={searchRef} className="relative hidden flex-1 max-w-md sm:block">
        <form onSubmit={submitSearch}>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
            placeholder="Search pages…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSearchOpen(true) }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={(e) => e.key === 'Escape' && (setSearchOpen(false), setQuery(''))}
          />
        </form>

        {/* Live results dropdown */}
        {searchOpen && query.trim() && (
          <div className="absolute left-0 right-0 top-full mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
            {searchResults.length === 0 ? (
              <p className="px-4 py-3 text-sm text-slate-400">No pages match "{query}"</p>
            ) : (
              searchResults.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.href}
                    onClick={() => navigateTo(item)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-pink-50 hover:text-pink-600 dark:text-slate-300 dark:hover:bg-pink-900/20 dark:hover:text-pink-400"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                    {item.label}
                  </button>
                )
              })
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        {/* User menu */}
        <div className="relative ml-1" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user?.name ?? 'Admin'}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-pink-100 dark:ring-pink-900/40"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-600 dark:bg-pink-900/30 dark:text-pink-300">
                {user?.name?.[0]?.toUpperCase() ?? 'A'}
              </div>
            )}
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold leading-none text-slate-800 dark:text-slate-100">
                {user?.name ?? 'Admin User'}
              </p>
              <p className="text-xs text-slate-400">{user?.role ?? 'Super Admin'}</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {user?.name ?? 'Admin User'}
                </p>
                <p className="truncate text-xs text-slate-400">{user?.email ?? ''}</p>
              </div>
              <button
                onClick={() => { setMenuOpen(false); router.push('/admin/profile') }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <User className="h-4 w-4" /> Profile
              </button>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2.5 border-t border-slate-100 px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50 dark:border-slate-800 dark:hover:bg-rose-950/40"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
              Logout Confirmation
            </h3>

            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to logout?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={cancelLogout}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                No
              </button>

              <button
                onClick={confirmLogout}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

// Live date + time — ticks every second
function Clock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const time = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  const date = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="mr-1 hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 dark:border-slate-700 md:flex">
      <CalendarDays className="h-4 w-4 text-pink-500" />
      <div className="leading-tight">
        <p className="text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-100">{time}</p>
        <p className="text-[11px] text-slate-400">{date}</p>
      </div>
    </div>
  )
}
