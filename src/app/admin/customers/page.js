// 'use client'

// import {
//   Search, Trash2, Users, CheckCircle2, AlertCircle,
//   RefreshCw, Mail, ShieldCheck, Store,
// } from 'lucide-react'
// import { PageHeader, ConfirmDialog } from '@/components/ui'
// import { useCustomers } from '@/hooks/useCustomers'

// export default function CustomersPage() {
//   const c = useCustomers()

//   return (
//     <div>
//       <PageHeader
//         title="Customers"
//         subtitle={`${c.allCustomers.length} registered customers`}
//       />

//       {/* Success */}
//       {c.successMsg && (
//         <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
//           <CheckCircle2 className="h-4 w-4 shrink-0" /> {c.successMsg}
//         </div>
//       )}

//       {/* Error */}
//       {c.fetchError && (
//         <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
//           <AlertCircle className="h-4 w-4 shrink-0" /> {c.fetchError}
//         </div>
//       )}

//       {/* ── Stats ────────────────────────────────────────────── */}
//       <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
//         <StatCard
//           label="Total Customers"
//           value={c.allCustomers.length}
//           color="pink"
//           icon={<Users className="h-5 w-5" />}
//         />
//         <StatCard
//           label="Showing"
//           value={c.customers.length}
//           color="green"
//           icon={<CheckCircle2 className="h-5 w-5" />}
//         />
//       </div>

//       {/* ── Search ───────────────────────────────────────────── */}
//       <div className="mb-5 flex items-center gap-3">
//         <div className="relative flex-1">
//           <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//           <input
//             className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
//             placeholder="Search by name or email…"
//             value={c.search}
//             onChange={(e) => c.setSearch(e.target.value)}
//           />
//         </div>
//         <button
//           onClick={() => c.setSearch('')}
//           title="Clear"
//           className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700"
//         >
//           <RefreshCw className="h-4 w-4" />
//         </button>
//       </div>

//       {/* ── Table ────────────────────────────────────────────── */}
//       <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm">
//             <thead>
//               <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
//                 <th className="px-4 py-3">Customer</th>
//                 <th className="hidden px-4 py-3 sm:table-cell">Email</th>
//                 <th className="hidden px-4 py-3 md:table-cell">Role</th>
//                 <th className="hidden px-4 py-3 lg:table-cell">Joined</th>
//                 <th className="px-4 py-3 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
//               {c.isFetching ? (
//                 <TableSkeleton />
//               ) : c.customers.length === 0 ? (
//                 <tr>
//                   <td colSpan={5} className="px-4 py-16 text-center">
//                     <div className="flex flex-col items-center gap-2 text-slate-400">
//                       <Users className="h-10 w-10 opacity-30" />
//                       <p className="text-sm">
//                         {c.search ? 'No customers match your search' : 'No customers yet'}
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 c.customers.map((customer) => (
//                   <CustomerRow
//                     key={customer._id}
//                     customer={customer}
//                     onDelete={() => c.setDeleteTarget(customer)}
//                   />
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Footer count */}
//         {!c.isFetching && c.customers.length > 0 && (
//           <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
//             <p className="text-xs text-slate-500">
//               Showing{' '}
//               <span className="font-semibold text-slate-700 dark:text-slate-200">{c.customers.length}</span>
//               {' '}of{' '}
//               <span className="font-semibold text-slate-700 dark:text-slate-200">{c.allCustomers.length}</span>
//               {' '}customers
//             </p>
//           </div>
//         )}
//       </div>

//       {/* ── Delete confirm ────────────────────────────────────── */}
//       <ConfirmDialog
//         open={!!c.deleteTarget}
//         onClose={() => c.setDeleteTarget(null)}
//         onConfirm={c.confirmDelete}
//         title="Delete Customer"
//         message={`Are you sure you want to permanently delete "${c.deleteTarget?.name}"? This cannot be undone.`}
//         confirmLabel={c.isDeleting ? 'Deleting…' : 'Delete'}
//       />
//     </div>
//   )
// }

// // ── Stat card ─────────────────────────────────────────────────────────────────

// const STAT_STYLES = {
//   pink:  { wrap: 'bg-pink-50 dark:bg-pink-900/10',  icon: 'text-pink-500',  val: 'text-pink-700 dark:text-pink-300'  },
//   green: { wrap: 'bg-green-50 dark:bg-green-900/10', icon: 'text-green-500', val: 'text-green-700 dark:text-green-300' },
//   blue:  { wrap: 'bg-blue-50 dark:bg-blue-900/10',  icon: 'text-blue-500',  val: 'text-blue-700 dark:text-blue-300'  },
// }

// function StatCard({ label, value, color, icon }) {
//   const s = STAT_STYLES[color]
//   return (
//     <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
//       <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.wrap} ${s.icon}`}>
//         {icon}
//       </div>
//       <div>
//         <p className="text-xs font-medium text-slate-500">{label}</p>
//         <p className={`text-2xl font-black ${s.val}`}>{value}</p>
//       </div>
//     </div>
//   )
// }

// // ── Customer row ──────────────────────────────────────────────────────────────

// function CustomerRow({ customer, onDelete }) {
//   const initials = (customer.name ?? 'U').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
//   const joined   = customer.createdAt
//     ? new Date(customer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
//     : '—'

//   return (
//     <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
//       {/* Name + avatar */}
//       <td className="px-4 py-3">
//         <div className="flex items-center gap-3">
//           <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-pink-400 to-rose-500 text-xs font-bold text-white">
//             {initials}
//           </div>
//           <p className="font-semibold text-slate-800 dark:text-slate-100">{customer.name}</p>
//         </div>
//       </td>

//       {/* Email */}
//       <td className="hidden px-4 py-3 sm:table-cell">
//         <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
//           <Mail className="h-3.5 w-3.5 shrink-0" />
//           {customer.email}
//         </div>
//       </td>

//       {/* Role */}
//       <td className="hidden px-4 py-3 md:table-cell">
//         <RoleBadge role={customer.role} />
//       </td>

//       {/* Joined */}
//       <td className="hidden px-4 py-3 text-sm text-slate-500 lg:table-cell">{joined}</td>

//       {/* Actions */}
//       <td className="px-4 py-3">
//         <div className="flex justify-end">
//           <button
//             onClick={onDelete}
//             className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400"
//           >
//             <Trash2 className="h-3.5 w-3.5" /> Delete
//           </button>
//         </div>
//       </td>
//     </tr>
//   )
// }

// // ── Role badge ────────────────────────────────────────────────────────────────

// function RoleBadge({ role }) {
//   if (role === 'admin') {
//     return (
//       <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
//         <ShieldCheck className="h-3 w-3" /> Admin
//       </span>
//     )
//   }
//   if (role === 'vendor') {
//     return (
//       <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
//         <Store className="h-3 w-3" /> Vendor
//       </span>
//     )
//   }
//   return (
//     <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
//       <Users className="h-3 w-3" /> Customer
//     </span>
//   )
// }

// // ── Skeleton ──────────────────────────────────────────────────────────────────

// function TableSkeleton() {
//   return Array.from({ length: 6 }).map((_, i) => (
//     <tr key={i} className="animate-pulse border-b border-slate-100 dark:border-slate-800">
//       <td className="px-4 py-3">
//         <div className="flex items-center gap-3">
//           <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700" />
//           <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700" />
//         </div>
//       </td>
//       <td className="px-4 py-3"><div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-700" /></td>
//       <td className="px-4 py-3"><div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-700" /></td>
//       <td className="px-4 py-3"><div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" /></td>
//       <td className="px-4 py-3"><div className="ml-auto h-7 w-16 rounded-lg bg-slate-200 dark:bg-slate-700" /></td>
//     </tr>
//   ))
// }



// app/dashboard/customers/page.tsx
'use client'

import {
  Search, Trash2, Users, CheckCircle2, AlertCircle,
  RefreshCw, Mail, ShieldCheck, Store, Download,
} from 'lucide-react'
import { PageHeader, ConfirmDialog } from '@/components/ui'
import { useCustomers } from '@/hooks/useCustomers'

export default function CustomersPage() {
  const c = useCustomers()

  // ─── Export to CSV ──────────────────────────────────────────────────────
  const handleExport = () => {
    if (c.customers.length === 0) {
      alert('No customers to export.')
      return
    }

    const headers = ['Name', 'Email', 'Role', 'Joined Date']
    const rows = c.customers.map((customer) => {
      const name = customer.name ?? 'Unknown'
      const email = customer.email ?? ''
      const role = customer.role ?? 'customer'
      const joined = customer.createdAt
        ? new Date(customer.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          })
        : ''

      return [
        `"${name}"`,
        `"${email}"`,
        `"${role}"`,
        `"${joined}"`,
      ]
    })

    const csvLines = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ]

    const BOM = '\uFEFF'
    const csvContent = BOM + csvLines.join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `customers_export_${new Date().toISOString().slice(0,10)}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle={`${c.allCustomers.length} registered customers`}
        action={
          <button
            onClick={handleExport}
            disabled={c.isFetching || c.customers.length === 0}
            className="flex items-center gap-2 rounded-xl border border-pink-200 bg-white px-4 py-2.5 text-sm font-medium text-pink-600 shadow-sm transition hover:bg-pink-50 disabled:opacity-50 dark:border-pink-800/30 dark:bg-slate-800 dark:text-pink-400 dark:hover:bg-pink-900/20"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        }
      />

      {/* Success */}
      {c.successMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> {c.successMsg}
        </div>
      )}

      {/* Error */}
      {c.fetchError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {c.fetchError}
        </div>
      )}

      {/* ─── Stats ────────────────────────────────────────────── */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard
          label="Total Customers"
          value={c.allCustomers.length}
          color="pink"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Showing"
          value={c.customers.length}
          color="green"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
      </div>

      {/* ─── Search ───────────────────────────────────────────── */}
      <div className="mb-5 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            placeholder="Search by name or email…"
            value={c.search}
            onChange={(e) => c.setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => c.setSearch('')}
          title="Clear"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* ─── Table ────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
                <th className="px-4 py-3">Customer</th>
                <th className="hidden px-4 py-3 sm:table-cell">Email</th>
                <th className="hidden px-4 py-3 md:table-cell">Role</th>
                <th className="hidden px-4 py-3 lg:table-cell">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {c.isFetching ? (
                <TableSkeleton />
              ) : c.customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Users className="h-10 w-10 opacity-30" />
                      <p className="text-sm">
                        {c.search ? 'No customers match your search' : 'No customers yet'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                c.customers.map((customer) => (
                  <CustomerRow
                    key={customer._id}
                    customer={customer}
                    onDelete={() => c.setDeleteTarget(customer)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!c.isFetching && c.customers.length > 0 && (
          <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
            <p className="text-xs text-slate-500">
              Showing{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">{c.customers.length}</span>
              {' '}of{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">{c.allCustomers.length}</span>
              {' '}customers
            </p>
          </div>
        )}
      </div>

      {/* ─── Delete confirm ────────────────────────────────────── */}
      <ConfirmDialog
        open={!!c.deleteTarget}
        onClose={() => c.setDeleteTarget(null)}
        onConfirm={c.confirmDelete}
        title="Delete Customer"
        message={`Are you sure you want to permanently delete "${c.deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel={c.isDeleting ? 'Deleting…' : 'Delete'}
      />
    </div>
  )
}

// ─── Stat card ─────────────────────────────────────────────────────────────────

const STAT_STYLES = {
  pink:  { wrap: 'bg-pink-50 dark:bg-pink-900/10',  icon: 'text-pink-500',  val: 'text-pink-700 dark:text-pink-300'  },
  green: { wrap: 'bg-green-50 dark:bg-green-900/10', icon: 'text-green-500', val: 'text-green-700 dark:text-green-300' },
  blue:  { wrap: 'bg-blue-50 dark:bg-blue-900/10',  icon: 'text-blue-500',  val: 'text-blue-700 dark:text-blue-300'  },
}

function StatCard({ label, value, color, icon }) {
  const s = STAT_STYLES[color]
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.wrap} ${s.icon}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className={`text-2xl font-black ${s.val}`}>{value}</p>
      </div>
    </div>
  )
}

// ── Customer row ──────────────────────────────────────────────────────────────

function CustomerRow({ customer, onDelete }) {
  const initials = (customer.name ?? 'U').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
  const joined   = customer.createdAt
    ? new Date(customer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

  return (
    <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
      {/* Name + avatar */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-xs font-bold text-white">
            {initials}
          </div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">{customer.name}</p>
        </div>
      </td>

      {/* Email */}
      <td className="hidden px-4 py-3 sm:table-cell">
        <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
          <Mail className="h-3.5 w-3.5 shrink-0" />
          {customer.email}
        </div>
      </td>

      {/* Role */}
      <td className="hidden px-4 py-3 md:table-cell">
        <RoleBadge role={customer.role} />
      </td>

      {/* Joined */}
      <td className="hidden px-4 py-3 text-sm text-slate-500 lg:table-cell">{joined}</td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex justify-end">
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </td>
    </tr>
  )
}

// ── Role badge ────────────────────────────────────────────────────────────────

function RoleBadge({ role }) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
        <ShieldCheck className="h-3 w-3" /> Admin
      </span>
    )
  }
  if (role === 'vendor') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
        <Store className="h-3 w-3" /> Vendor
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
      <Users className="h-3 w-3" /> Customer
    </span>
  )
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────

function TableSkeleton() {
  return Array.from({ length: 6 }).map((_, i) => (
    <tr key={i} className="animate-pulse border-b border-slate-100 dark:border-slate-800">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </td>
      <td className="px-4 py-3"><div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-700" /></td>
      <td className="px-4 py-3"><div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-700" /></td>
      <td className="px-4 py-3"><div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" /></td>
      <td className="px-4 py-3"><div className="ml-auto h-7 w-16 rounded-lg bg-slate-200 dark:bg-slate-700" /></td>
    </tr>
  ))
}