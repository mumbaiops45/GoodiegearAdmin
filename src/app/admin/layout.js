// Admin section layout.
// AdminShell is a client component that checks the current path:
//   /admin/login  → renders children only (no sidebar/topbar)
//   everything else → full sidebar + topbar shell
import AdminShell from '@/components/admin/AdminShell'

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>
}
