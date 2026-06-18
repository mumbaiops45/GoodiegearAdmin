'use client'

// Adapted from OJAIN Sidebar.jsx → Next.js version.
// React Router's <NavLink> replaced with Next.js <Link> + usePathname() for active state.
// Leaf icon replaced with GoodieGear "G" brand mark.
// brand-* Tailwind colours replaced with pink-* (GoodieGear palette).

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import { navItems } from '@/config/navItems'
import useAuthStore from '@/store/authStore'

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col',
          'border-r border-slate-200 bg-white text-slate-600',
          'transition-transform duration-200',
          'dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300',
          'lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-pink-500 to-rose-500 shadow">
              <span className="text-base font-black text-white">G</span>
            </div>
            <div>
              <p className="text-base font-extrabold leading-none text-slate-900 dark:text-white">
                GoodieGear
              </p>
              <p className="text-[11px] tracking-wide text-slate-400">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {navItems.map(({ href, label, icon: Icon, badge }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={[
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-pink-500 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
                ].join(' ')}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="flex-1">{label}</span>
                {badge && (
                  <span
                    className={[
                      'rounded-full px-2 py-0.5 text-xs font-semibold',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
                    ].join(' ')}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logged-in user footer */}
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-600 dark:bg-pink-900/30 dark:text-pink-300">
              {user?.name?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                {user?.name ?? 'Admin User'}
              </p>
              <p className="truncate text-xs text-slate-400">{user?.email ?? ''}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
