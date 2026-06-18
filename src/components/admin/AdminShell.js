'use client'

// AdminShell conditionally renders Sidebar + Topbar.
// The login page shares the /admin/* path but must NOT show the shell,
// so we check the current pathname and render children-only for /admin/login.
//
// This replaces the OJAIN <Layout> + <RequireAuth> pattern.
// In Next.js, route protection is handled by middleware.js (already set up).

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AdminShell({ children }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Login page: no chrome, just the page content
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar onMenu={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
