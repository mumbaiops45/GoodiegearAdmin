// // // 'use client'

// // // import { ShoppingCart, Users, Store, IndianRupee, AlertCircle, RefreshCw, MessageSquare } from 'lucide-react'
// // // import {
// // //   ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
// // //   PieChart, Pie, Cell, Tooltip as PieTooltip,
// // // } from 'recharts'
// // // import { useAuth } from '@/hooks/useAuth'
// // // import { useDashboard } from '@/hooks/useDashboard'

// // // const KPI_CONFIG = {
// // //   revenue:   { icon: IndianRupee,  from: 'from-rose-500',    to: 'to-pink-400'    },
// // //   orders:    { icon: ShoppingCart, from: 'from-violet-600',  to: 'to-purple-400'  },
// // //   customers: { icon: Users,        from: 'from-sky-500',     to: 'to-cyan-400'    },
// // //   vendors:   { icon: Store,        from: 'from-emerald-500', to: 'to-teal-400'    },
// // // }

// // // const STATUS_PIE  = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
// // // const STATUS_META = {
// // //   Pending:    'bg-amber-100  text-amber-700',
// // //   Processing: 'bg-blue-100   text-blue-700',
// // //   Shipped:    'bg-indigo-100 text-indigo-700',
// // //   Delivered:  'bg-green-100  text-green-700',
// // //   Cancelled:  'bg-rose-100   text-rose-700',
// // // }

// // // export default function DashboardPage() {
// // //   const { user }                                        = useAuth()
// // //   const { stats, overview, isFetching, error, refetch } = useDashboard()

// // //   const salesByMonth   = overview?.salesByMonth   ?? []
// // //   const ordersByStatus = overview?.ordersByStatus  ?? []
// // //   const pendingReviews = overview?.pendingReviews  ?? 0
// // //   const recentOrders   = overview?.recentOrders    ?? []

// // //   const hour     = new Date().getHours()
// // //   const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
// // //   const today    = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

// // //   return (
// // //     <div className="space-y-6">

// // //       {/* ── Top bar ───────────────────────────────────────────────── */}
// // //       <div className="flex items-start justify-between gap-3">
// // //         <div className="min-w-0">
// // //           <p className="text-xs font-medium text-slate-400">{greeting} · {today}</p>
// // //           <h1 className="mt-0.5 truncate text-xl font-black text-slate-800 sm:text-2xl">
// // //             Welcome back, {user?.name ?? 'Admin'}
// // //           </h1>
// // //         </div>
// // //         <button
// // //           onClick={refetch}
// // //           disabled={isFetching}
// // //           className="shrink-0 flex items-center gap-2 rounded-full bg-slate-800 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50 sm:px-4"
// // //         >
// // //           <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
// // //           <span className="hidden sm:inline">Refresh</span>
// // //         </button>
// // //       </div>

// // //       {error && (
// // //         <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
// // //           <AlertCircle className="h-4 w-4 shrink-0" /> {error}
// // //         </div>
// // //       )}

// // //       {/* ── KPI cards — full gradient, white text ─────────────────── */}
// // //       <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
// // //         {isFetching
// // //           ? Array.from({ length: 4 }).map((_, i) => (
// // //               <div key={i} className="animate-pulse h-36 rounded-3xl bg-slate-100" />
// // //             ))
// // //           : stats.map((s) => {
// // //               const c = KPI_CONFIG[s.key] ?? KPI_CONFIG.orders
// // //               return (
// // //                 <div key={s.key} className={`relative overflow-hidden rounded-3xl bg-linear-to-br ${c.from} ${c.to} p-5 shadow-md`}>
// // //                   {/* background icon */}
// // //                   <c.icon className="absolute -right-3 -top-3 h-20 w-20 text-white/10" strokeWidth={1.5} />
// // //                   <div className="relative">
// // //                     <div className="mb-3 inline-flex rounded-2xl bg-white/20 p-2">
// // //                       <c.icon className="h-4 w-4 text-white" />
// // //                     </div>
// // //                     <p className="text-xl font-black text-white sm:text-2xl">{s.value}</p>
// // //                     <p className="mt-0.5 text-xs font-medium text-white/70">{s.label}</p>
// // //                   </div>
// // //                 </div>
// // //               )
// // //             })}
// // //       </div>

// // //       {/* ── Charts row ───────────────────────────────────────────── */}
// // //       <div className="grid gap-5 lg:grid-cols-3">

// // //         {/* Area chart — full width on left */}
// // //         <div className="lg:col-span-2 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
// // //           <div className="mb-1 flex items-center justify-between">
// // //             <h3 className="font-bold text-slate-800">Monthly Sales</h3>
// // //             <div className="flex gap-3 text-xs text-slate-400">
// // //               <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-pink-400" />Revenue</span>
// // //               <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-violet-400" />Orders</span>
// // //             </div>
// // //           </div>
// // //           <p className="mb-5 text-xs text-slate-400">Revenue and order volume by month</p>

// // //           {isFetching ? <Skel h={240} /> : salesByMonth.length === 0 ? <Empty h={240} /> : (
// // //             <ResponsiveContainer width="100%" height={240}>
// // //               <AreaChart data={salesByMonth} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
// // //                 <defs>
// // //                   <linearGradient id="dsg" x1="0" y1="0" x2="0" y2="1">
// // //                     <stop offset="0%"   stopColor="#f43f5e" stopOpacity={0.2} />
// // //                     <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
// // //                   </linearGradient>
// // //                   <linearGradient id="dog" x1="0" y1="0" x2="0" y2="1">
// // //                     <stop offset="0%"   stopColor="#8b5cf6" stopOpacity={0.15} />
// // //                     <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
// // //                   </linearGradient>
// // //                 </defs>
// // //                 <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
// // //                 <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
// // //                 <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={44} tickFormatter={fmtNum} />
// // //                 <Tooltip
// // //                   contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: 12 }}
// // //                   formatter={(v, name) => [name === 'sales' ? `₹${v.toLocaleString('en-IN')}` : v, name === 'sales' ? 'Revenue' : 'Orders']}
// // //                 />
// // //                 <Area type="monotone" dataKey="sales"  stroke="#f43f5e" strokeWidth={2.5} fill="url(#dsg)" dot={false} activeDot={{ r: 5, fill: '#f43f5e', stroke: '#fff', strokeWidth: 2 }} />
// // //                 <Area type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={2}   fill="url(#dog)" dot={false} activeDot={{ r: 4, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }} />
// // //               </AreaChart>
// // //             </ResponsiveContainer>
// // //           )}
// // //         </div>

// // //         {/* Order status — donut + pill list */}
// // //         <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
// // //           <h3 className="mb-0.5 font-bold text-slate-800">Order Status</h3>
// // //           <p className="mb-4 text-xs text-slate-400">All orders by current status</p>

// // //           {isFetching ? <Skel h={160} /> : ordersByStatus.length === 0 ? <Empty h={160} /> : (
// // //             <ResponsiveContainer width="100%" height={160}>
// // //               <PieChart>
// // //                 <Pie data={ordersByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={46} outerRadius={68} paddingAngle={3}>
// // //                   {ordersByStatus.map((_, i) => <Cell key={i} fill={STATUS_PIE[i % STATUS_PIE.length]} />)}
// // //                 </Pie>
// // //                 <PieTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: 12 }} />
// // //               </PieChart>
// // //             </ResponsiveContainer>
// // //           )}

// // //           <div className="mt-3 flex flex-wrap gap-2">
// // //             {isFetching
// // //               ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />)
// // //               : ordersByStatus.map((o) => (
// // //                   <span key={o.status} className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_META[o.status] ?? 'bg-slate-100 text-slate-500'}`}>
// // //                     {o.status} · {o.count}
// // //                   </span>
// // //                 ))}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* ── Bottom row ───────────────────────────────────────────── */}
// // //       <div className="grid gap-5 lg:grid-cols-3">

// // //         {/* Recent orders — clean table */}
// // //         <div className="lg:col-span-2 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
// // //           <div className="px-6 py-4">
// // //             <h3 className="font-bold text-slate-800">Recent Orders</h3>
// // //             <p className="text-xs text-slate-400">Last 6 orders placed</p>
// // //           </div>
// // //           <div className="overflow-x-auto">
// // //             <table className="w-full text-sm">
// // //               <thead>
// // //                 <tr className="border-y border-slate-50 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
// // //                   <th className="px-4 py-2.5 text-left sm:px-6">Customer</th>
// // //                   <th className="px-4 py-2.5 text-left sm:px-6">Status</th>
// // //                   <th className="px-4 py-2.5 text-right sm:px-6">Amount</th>
// // //                   <th className="hidden px-6 py-2.5 text-right sm:table-cell">Date</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {isFetching
// // //                   ? Array.from({ length: 5 }).map((_, i) => (
// // //                       <tr key={i} className="animate-pulse border-b border-slate-50">
// // //                         <td className="px-6 py-3">
// // //                           <div className="flex items-center gap-3">
// // //                             <div className="h-8 w-8 shrink-0 rounded-full bg-slate-100" />
// // //                             <div className="space-y-1.5">
// // //                               <div className="h-3 w-28 rounded bg-slate-100" />
// // //                               <div className="h-2.5 w-20 rounded bg-slate-50" />
// // //                             </div>
// // //                           </div>
// // //                         </td>
// // //                         <td className="px-6 py-3"><div className="h-5 w-20 rounded-full bg-slate-100" /></td>
// // //                         <td className="px-6 py-3 text-right"><div className="ml-auto h-4 w-14 rounded bg-slate-100" /></td>
// // //                         <td className="px-6 py-3 text-right"><div className="ml-auto h-3.5 w-12 rounded bg-slate-50" /></td>
// // //                       </tr>
// // //                     ))
// // //                   : recentOrders.length === 0
// // //                   ? <tr><td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-400">No orders yet</td></tr>
// // //                   : recentOrders.map((o) => <OrderRow key={o._id} order={o} />)
// // //                 }
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //         </div>

// // //         {/* Right column */}
// // //         <div className="flex flex-col gap-4">
// // //           {/* Pending reviews — gradient card */}
// // //           <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-amber-400 to-orange-400 p-6 shadow-md">
// // //             <MessageSquare className="absolute -right-3 -top-3 h-20 w-20 text-white/10" strokeWidth={1.5} />
// // //             <div className="relative">
// // //               <div className="mb-3 inline-flex rounded-2xl bg-white/20 p-2">
// // //                 <MessageSquare className="h-4 w-4 text-white" />
// // //               </div>
// // //               {isFetching
// // //                 ? <div className="mb-1 h-10 w-14 animate-pulse rounded-lg bg-white/20" />
// // //                 : <p className="text-4xl font-black text-white">{pendingReviews}</p>
// // //               }
// // //               <p className="mt-1 text-sm font-bold text-white">Pending Reviews</p>
// // //               <p className="mt-0.5 text-xs text-white/70">Awaiting approval</p>
// // //             </div>
// // //           </div>

// // //           {/* Summary list */}
// // //           <div className="flex-1 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
// // //             <h3 className="mb-4 font-bold text-slate-800">Quick Summary</h3>
// // //             <div className="space-y-3">
// // //               {isFetching
// // //                 ? Array.from({ length: 4 }).map((_, i) => (
// // //                     <div key={i} className="flex animate-pulse items-center justify-between">
// // //                       <div className="h-3.5 w-24 rounded bg-slate-100" />
// // //                       <div className="h-4 w-16 rounded bg-slate-100" />
// // //                     </div>
// // //                   ))
// // //                 : stats.map((s) => {
// // //                     const c = KPI_CONFIG[s.key] ?? KPI_CONFIG.orders
// // //                     return (
// // //                       <div key={s.key} className="flex items-center justify-between">
// // //                         <div className="flex items-center gap-2">
// // //                           <div className={`flex h-7 w-7 items-center justify-center rounded-xl bg-linear-to-br ${c.from} ${c.to}`}>
// // //                             <c.icon className="h-3.5 w-3.5 text-white" />
// // //                           </div>
// // //                           <span className="text-sm text-slate-500">{s.label}</span>
// // //                         </div>
// // //                         <span className="text-sm font-bold text-slate-800">{s.value}</span>
// // //                       </div>
// // //                     )
// // //                   })}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // // ── Order row ─────────────────────────────────────────────────────────────────

// // // function OrderRow({ order }) {
// // //   const name     = order.user?.name  ?? order.user?.email ?? 'Guest'
// // //   const email    = order.user?.email ?? ''
// // //   const price    = `₹${Number(order.totalPrice ?? 0).toLocaleString('en-IN')}`
// // //   const status   = order.orderStatus ?? 'Pending'
// // //   const date     = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'
// // //   const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?'

// // //   return (
// // //     <tr className="border-b border-slate-50 transition-colors hover:bg-slate-50/60">
// // //       <td className="px-4 py-3 sm:px-6">
// // //         <div className="flex items-center gap-2 sm:gap-3">
// // //           <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-pink-400 to-rose-500 text-[11px] font-bold text-white">
// // //             {initials}
// // //           </div>
// // //           <div className="min-w-0">
// // //             <p className="truncate max-w-25 text-sm font-semibold text-slate-800 sm:max-w-40">{name}</p>
// // //             {email && <p className="hidden truncate text-[11px] text-slate-400 sm:block">{email}</p>}
// // //           </div>
// // //         </div>
// // //       </td>
// // //       <td className="px-4 py-3 sm:px-6">
// // //         <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_META[status] ?? 'bg-slate-100 text-slate-500'}`}>
// // //           {status}
// // //         </span>
// // //       </td>
// // //       <td className="px-4 py-3 text-right text-sm font-bold text-slate-800 sm:px-6">{price}</td>
// // //       <td className="hidden px-6 py-3 text-right text-xs text-slate-400 sm:table-cell">{date}</td>
// // //     </tr>
// // //   )
// // // }

// // // function Skel({ h }) {
// // //   return <div className="animate-pulse rounded-2xl bg-slate-50" style={{ height: h }} />
// // // }
// // // function Empty({ h }) {
// // //   return <div className="flex items-center justify-center text-sm text-slate-400" style={{ height: h }}>No data yet</div>
// // // }
// // // function fmtNum(n) {
// // //   if (n >= 10_00_000) return `${(n / 10_00_000).toFixed(1)}L`
// // //   if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`
// // //   return String(n)
// // // }


// // // app/dashboard/page.tsx




// // // app/dashboard/page.tsx




// // 'use client'

// // import { ShoppingCart, Users, Store, IndianRupee, AlertCircle, RefreshCw, MessageSquare } from 'lucide-react'
// // import {
// //   ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
// //   PieChart, Pie, Cell, Tooltip as PieTooltip,
// // } from 'recharts'
// // import { useAuth } from '@/hooks/useAuth'
// // import { useDashboard } from '@/hooks/useDashboard'

// // // ─── KPI config – white cards, pink icon ────────────────────────────────
// // const KPI_CONFIG = {
// //   revenue:   { icon: IndianRupee,  label: 'Total Revenue' },
// //   orders:    { icon: ShoppingCart, label: 'Total Orders' },
// //   customers: { icon: Users,        label: 'Customers' },
// //   vendors:   { icon: Store,        label: 'Active Vendors' },
// // }

// // // ─── Status badges – soft pastels (unchanged, they already look good) ──
// // const STATUS_META = {
// //   Pending:    'bg-amber-50 text-amber-700',
// //   Processing: 'bg-blue-50  text-blue-700',
// //   Shipped:    'bg-indigo-50 text-indigo-700',
// //   Delivered:  'bg-emerald-50 text-emerald-700',
// //   Cancelled:  'bg-rose-50  text-rose-700',
// // }

// // // ─── Pie chart – pink scale ──────────────────────────────────────────────
// // const STATUS_PIE = ['#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777']

// // export default function DashboardPage() {
// //   const { user }                                        = useAuth()
// //   const { stats, overview, isFetching, error, refetch } = useDashboard()

// //   const salesByMonth   = overview?.salesByMonth   ?? []
// //   const ordersByStatus = overview?.ordersByStatus  ?? []
// //   const pendingReviews = overview?.pendingReviews  ?? 0
// //   const recentOrders   = overview?.recentOrders    ?? []

// //   const hour     = new Date().getHours()
// //   const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
// //   const today    = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

// //   return (
// //     <div className="space-y-6">

// //       {/* ── Top bar ───────────────────────────────────────────────── */}
// //       <div className="flex items-start justify-between gap-3">
// //         <div>
// //           <p className="text-xs font-medium text-slate-400">{greeting} · {today}</p>
// //           <h1 className="mt-0.5 text-xl font-bold text-slate-800 sm:text-2xl">
// //             Welcome back, {user?.name ?? 'Admin'}
// //           </h1>
// //         </div>
// //         <button
// //           onClick={refetch}
// //           disabled={isFetching}
// //           className="shrink-0 flex items-center gap-2 rounded-lg bg-pink-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-pink-700 disabled:opacity-50"
// //         >
// //           <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
// //           <span>Refresh</span>
// //         </button>
// //       </div>

// //       {error && (
// //         <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
// //           <AlertCircle className="h-4 w-4 shrink-0" /> {error}
// //         </div>
// //       )}

// //       {/* ── KPI cards – white cards, border, shadow, icon on right ──────── */}
// //       <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
// //         {isFetching
// //           ? Array.from({ length: 4 }).map((_, i) => (
// //               <div key={i} className="animate-pulse h-28 rounded-lg bg-slate-100" />
// //             ))
// //           : stats.map((s) => {
// //               const c = KPI_CONFIG[s.key] ?? KPI_CONFIG.orders
// //               return (
// //                 <div
// //                   key={s.key}
// //                   className="relative rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
// //                 >
// //                   <div className="flex items-start justify-between">
// //                     <div>
// //                       <p className="text-2xl font-bold text-slate-800">{s.value}</p>
// //                       <p className="text-xs font-medium text-slate-500">{c.label}</p>
// //                     </div>
// //                     <c.icon className="h-6 w-6 text-pink-500" strokeWidth={1.5} />
// //                   </div>
// //                 </div>
// //               )
// //             })}
// //       </div>

// //       {/* ── Charts row ───────────────────────────────────────────── */}
// //       <div className="grid gap-5 lg:grid-cols-3">

// //         {/* Area chart – single line (revenue) with pink gradient */}
// //         <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
// //           <div className="mb-1 flex items-center justify-between">
// //             <h3 className="font-semibold text-slate-800">Monthly Sales</h3>
// //             <span className="text-xs text-slate-400">Revenue and order volume by month</span>
// //           </div>

// //           {isFetching ? <Skel h={240} /> : salesByMonth.length === 0 ? <Empty h={240} /> : (
// //             <ResponsiveContainer width="100%" height={240}>
// //               <AreaChart data={salesByMonth} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
// //                 <defs>
// //                   <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
// //                     <stop offset="0%"   stopColor="#ec4899" stopOpacity={0.2} />
// //                     <stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
// //                   </linearGradient>
// //                 </defs>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
// //                 <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
// //                 <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={44} tickFormatter={fmtNum} />
// //                 <Tooltip
// //                   contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: 12 }}
// //                   formatter={(v) => `₹${v.toLocaleString('en-IN')}`}
// //                   labelFormatter={(l) => `Month: ${l}`}
// //                 />
// //                 <Area
// //                   type="monotone"
// //                   dataKey="sales"
// //                   stroke="#ec4899"
// //                   strokeWidth={2.5}
// //                   fill="url(#salesGrad)"
// //                   dot={false}
// //                   activeDot={{ r: 5, fill: '#ec4899', stroke: '#fff', strokeWidth: 2 }}
// //                 />
// //               </AreaChart>
// //             </ResponsiveContainer>
// //           )}
// //         </div>

// //         {/* Order status – donut + pill list */}
// //         <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
// //           <h3 className="mb-0.5 font-semibold text-slate-800">Order Status</h3>
// //           <p className="mb-3 text-xs text-slate-400">All orders by current status</p>

// //           {isFetching ? <Skel h={160} /> : ordersByStatus.length === 0 ? <Empty h={160} /> : (
// //             <ResponsiveContainer width="100%" height={160}>
// //               <PieChart>
// //                 <Pie
// //                   data={ordersByStatus}
// //                   dataKey="count"
// //                   nameKey="status"
// //                   cx="50%"
// //                   cy="50%"
// //                   innerRadius={46}
// //                   outerRadius={68}
// //                   paddingAngle={3}
// //                 >
// //                   {ordersByStatus.map((_, i) => (
// //                     <Cell key={i} fill={STATUS_PIE[i % STATUS_PIE.length]} />
// //                   ))}
// //                 </Pie>
// //                 <PieTooltip
// //                   contentStyle={{
// //                     borderRadius: 8,
// //                     border: '1px solid #e2e8f0',
// //                     boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
// //                     fontSize: 12,
// //                   }}
// //                 />
// //               </PieChart>
// //             </ResponsiveContainer>
// //           )}

// //           <div className="mt-3 flex flex-wrap gap-2">
// //             {isFetching
// //               ? Array.from({ length: 4 }).map((_, i) => (
// //                   <div key={i} className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
// //                 ))
// //               : ordersByStatus.map((o) => (
// //                   <span
// //                     key={o.status}
// //                     className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_META[o.status] ?? 'bg-slate-100 text-slate-500'}`}
// //                   >
// //                     {o.status} · {o.count}
// //                   </span>
// //                 ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* ── Bottom row ───────────────────────────────────────────── */}
// //       <div className="grid gap-5 lg:grid-cols-3">

// //         {/* Recent orders – clean table */}
// //         <div className="lg:col-span-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
// //           <div className="px-6 py-4 border-b border-slate-100">
// //             <h3 className="font-semibold text-slate-800">Recent Orders</h3>
// //             <p className="text-xs text-slate-400">Last 6 orders placed</p>
// //           </div>
// //           <div className="overflow-x-auto">
// //             <table className="w-full text-sm">
// //               <thead>
// //                 <tr className="border-b border-slate-100 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
// //                   <th className="px-4 py-2.5 sm:px-6">Customer</th>
// //                   <th className="px-4 py-2.5 sm:px-6">Status</th>
// //                   <th className="px-4 py-2.5 text-right sm:px-6">Amount</th>
// //                   <th className="hidden px-6 py-2.5 text-right sm:table-cell">Date</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {isFetching
// //                   ? Array.from({ length: 5 }).map((_, i) => (
// //                       <tr key={i} className="animate-pulse border-b border-slate-50">
// //                         <td className="px-6 py-3">
// //                           <div className="flex items-center gap-3">
// //                             <div className="h-8 w-8 shrink-0 rounded-full bg-slate-100" />
// //                             <div className="space-y-1.5">
// //                               <div className="h-3 w-28 rounded bg-slate-100" />
// //                               <div className="h-2.5 w-20 rounded bg-slate-50" />
// //                             </div>
// //                           </div>
// //                         </td>
// //                         <td className="px-6 py-3"><div className="h-5 w-20 rounded-full bg-slate-100" /></td>
// //                         <td className="px-6 py-3 text-right"><div className="ml-auto h-4 w-14 rounded bg-slate-100" /></td>
// //                         <td className="px-6 py-3 text-right"><div className="ml-auto h-3.5 w-12 rounded bg-slate-50" /></td>
// //                       </tr>
// //                     ))
// //                   : recentOrders.length === 0
// //                   ? <tr><td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-400">No orders yet</td></tr>
// //                   : recentOrders.map((o) => <OrderRow key={o._id} order={o} />)
// //                 }
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>

// //         {/* Right column – Pending reviews + Quick Summary */}
// //         <div className="flex flex-col gap-4">
// //           {/* Pending reviews – white card with pink icon */}
// //           <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
// //             <div className="flex items-center gap-3">
// //               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-pink-600">
// //                 <MessageSquare className="h-5 w-5" />
// //               </div>
// //               <div>
// //                 {isFetching ? (
// //                   <div className="mb-1 h-6 w-12 animate-pulse rounded bg-slate-100" />
// //                 ) : (
// //                   <p className="text-2xl font-bold text-slate-800">{pendingReviews}</p>
// //                 )}
// //                 <p className="text-xs font-medium text-slate-500">Pending Reviews</p>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Quick Summary – list of KPIs in compact form */}
// //           <div className="flex-1 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
// //             <h3 className="mb-4 font-semibold text-slate-800">Quick Summary</h3>
// //             <div className="space-y-3">
// //               {isFetching
// //                 ? Array.from({ length: 4 }).map((_, i) => (
// //                     <div key={i} className="flex animate-pulse items-center justify-between">
// //                       <div className="h-3.5 w-24 rounded bg-slate-100" />
// //                       <div className="h-4 w-16 rounded bg-slate-100" />
// //                     </div>
// //                   ))
// //                 : stats.map((s) => (
// //                     <div key={s.key} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
// //                       <span className="text-sm text-slate-500">{KPI_CONFIG[s.key]?.label ?? s.label}</span>
// //                       <span className="text-sm font-semibold text-slate-800">{s.value}</span>
// //                     </div>
// //                   ))}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // // ── Order row ─────────────────────────────────────────────────────────────────

// // function OrderRow({ order }) {
// //   const name     = order.user?.name  ?? order.user?.email ?? 'Guest'
// //   const email    = order.user?.email ?? ''
// //   const price    = `₹${Number(order.totalPrice ?? 0).toLocaleString('en-IN')}`
// //   const status   = order.orderStatus ?? 'Pending'
// //   const date     = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'
// //   const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?'

// //   return (
// //     <tr className="border-b border-slate-50 transition-colors hover:bg-slate-50/60">
// //       <td className="px-4 py-3 sm:px-6">
// //         <div className="flex items-center gap-2 sm:gap-3">
// //           <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xs font-bold text-pink-700">
// //             {initials}
// //           </div>
// //           <div className="min-w-0">
// //             <p className="truncate text-sm font-medium text-slate-800 sm:max-w-40">{name}</p>
// //             {email && <p className="hidden truncate text-[11px] text-slate-400 sm:block">{email}</p>}
// //           </div>
// //         </div>
// //       </td>
// //       <td className="px-4 py-3 sm:px-6">
// //         <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_META[status] ?? 'bg-slate-100 text-slate-500'}`}>
// //           {status}
// //         </span>
// //       </td>
// //       <td className="px-4 py-3 text-right text-sm font-bold text-slate-800 sm:px-6">{price}</td>
// //       <td className="hidden px-6 py-3 text-right text-xs text-slate-400 sm:table-cell">{date}</td>
// //     </tr>
// //   )
// // }

// // // ── Helpers ──────────────────────────────────────────────────────────────────

// // function Skel({ h }) {
// //   return <div className="animate-pulse rounded-lg bg-slate-50" style={{ height: h }} />
// // }
// // function Empty({ h }) {
// //   return <div className="flex items-center justify-center text-sm text-slate-400" style={{ height: h }}>No data yet</div>
// // }
// // function fmtNum(n) {
// //   if (n >= 10_00_000) return `${(n / 10_00_000).toFixed(1)}L`
// //   if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`
// //   return String(n)
// // }


// // app/dashboard/page.tsx



// 'use client'

// import { ShoppingCart, Users, Store, IndianRupee, AlertCircle, RefreshCw, MessageSquare } from 'lucide-react'
// import {
//   ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
//   PieChart, Pie, Cell, Tooltip as PieTooltip,
// } from 'recharts'
// import { useAuth } from '@/hooks/useAuth'
// import { useDashboard } from '@/hooks/useDashboard'

// // ─── KPI config – white cards, pink icon ────────────────────────────────
// const KPI_CONFIG = {
//   revenue:   { icon: IndianRupee,  label: 'Total Revenue' },
//   orders:    { icon: ShoppingCart, label: 'Total Orders' },
//   customers: { icon: Users,        label: 'Customers' },
//   vendors:   { icon: Store,        label: 'Active Vendors' },
// }

// // ─── Status badges – soft pastels ──────────────────────────────────────
// const STATUS_META = {
//   Pending:    'bg-amber-50 text-amber-700',
//   Processing: 'bg-blue-50  text-blue-700',
//   Shipped:    'bg-indigo-50 text-indigo-700',
//   Delivered:  'bg-emerald-50 text-emerald-700',
//   Cancelled:  'bg-rose-50  text-rose-700',
// }

// // ─── Pie chart – pink scale ──────────────────────────────────────────────
// const STATUS_PIE = ['#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777']

// export default function DashboardPage() {
//   const { user }                                        = useAuth()
//   const { stats, overview, isFetching, error, refetch } = useDashboard()

//   const salesByMonth   = overview?.salesByMonth   ?? []
//   const ordersByStatus = overview?.ordersByStatus  ?? []
//   const pendingReviews = overview?.pendingReviews  ?? 0
//   const recentOrders   = overview?.recentOrders    ?? []

//   const hour     = new Date().getHours()
//   const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
//   const today    = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

//   return (
//     <div className="space-y-6">

//       {/* ── Top bar ───────────────────────────────────────────────── */}
//       <div className="flex items-start justify-between gap-3">
//         <div>
//           <p className="text-xs font-medium text-slate-400">{greeting} · {today}</p>
//           <h1 className="mt-0.5 text-xl font-bold text-slate-800 sm:text-2xl">
//             Welcome back, {user?.name ?? 'Admin'}
//           </h1>
//         </div>
//         <button
//           onClick={refetch}
//           disabled={isFetching}
//           className="shrink-0 flex items-center gap-2 rounded-lg bg-pink-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-pink-700 disabled:opacity-50"
//         >
//           <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
//           <span>Refresh</span>
//         </button>
//       </div>

//       {error && (
//         <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
//           <AlertCircle className="h-4 w-4 shrink-0" /> {error}
//         </div>
//       )}

//       {/* ── KPI cards – white cards, border, shadow, icon on right ──────── */}
//       <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//         {isFetching
//           ? Array.from({ length: 4 }).map((_, i) => (
//               <div key={i} className="animate-pulse h-28 rounded-lg bg-slate-100" />
//             ))
//           : stats.map((s) => {
//               const c = KPI_CONFIG[s.key] ?? KPI_CONFIG.orders
//               return (
//                 <div
//                   key={s.key}
//                   className="relative rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
//                 >
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <p className="text-2xl font-bold text-slate-800">{s.value}</p>
//                       <p className="text-xs font-medium text-slate-500">{c.label}</p>
//                     </div>
//                     <c.icon className="h-6 w-6 text-pink-500" strokeWidth={1.5} />
//                   </div>
//                 </div>
//               )
//             })}
//       </div>

//       {/* ── Charts row ───────────────────────────────────────────── */}
//       <div className="grid gap-5 lg:grid-cols-3">

//         {/* Area chart – single line (revenue) with pink gradient */}
//         <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="mb-1 flex items-center justify-between">
//             <h3 className="font-semibold text-slate-800">Monthly Sales</h3>
//             <span className="text-xs text-slate-400">Revenue and order volume by month</span>
//           </div>

//           {isFetching ? <Skel h={240} /> : salesByMonth.length === 0 ? <Empty h={240} /> : (
//             <ResponsiveContainer width="100%" height={240}>
//               <AreaChart data={salesByMonth} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
//                 <defs>
//                   <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%"   stopColor="#ec4899" stopOpacity={0.2} />
//                     <stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
//                 <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
//                 <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={44} tickFormatter={fmtNum} />
//                 <Tooltip
//                   contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: 12 }}
//                   formatter={(v) => `₹${v.toLocaleString('en-IN')}`}
//                   labelFormatter={(l) => `Month: ${l}`}
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="sales"
//                   stroke="#ec4899"
//                   strokeWidth={2.5}
//                   fill="url(#salesGrad)"
//                   dot={false}
//                   activeDot={{ r: 5, fill: '#ec4899', stroke: '#fff', strokeWidth: 2 }}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           )}
//         </div>

//         {/* Order status – donut + pill list */}
//         <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
//           <h3 className="mb-0.5 font-semibold text-slate-800">Order Status</h3>
//           <p className="mb-3 text-xs text-slate-400">All orders by current status</p>

//           {isFetching ? <Skel h={160} /> : ordersByStatus.length === 0 ? <Empty h={160} /> : (
//             <ResponsiveContainer width="100%" height={160}>
//               <PieChart>
//                 <Pie
//                   data={ordersByStatus}
//                   dataKey="count"
//                   nameKey="status"
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={46}
//                   outerRadius={68}
//                   paddingAngle={3}
//                 >
//                   {ordersByStatus.map((_, i) => (
//                     <Cell key={i} fill={STATUS_PIE[i % STATUS_PIE.length]} />
//                   ))}
//                 </Pie>
//                 <PieTooltip
//                   contentStyle={{
//                     borderRadius: 8,
//                     border: '1px solid #e2e8f0',
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
//                     fontSize: 12,
//                   }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           )}

//           <div className="mt-3 flex flex-wrap gap-2">
//             {isFetching
//               ? Array.from({ length: 4 }).map((_, i) => (
//                   <div key={i} className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
//                 ))
//               : ordersByStatus.map((o) => (
//                   <span
//                     key={o.status}
//                     className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_META[o.status] ?? 'bg-slate-100 text-slate-500'}`}
//                   >
//                     {o.status} · {o.count}
//                   </span>
//                 ))}
//           </div>
//         </div>
//       </div>

//       {/* ── Bottom row ───────────────────────────────────────────── */}
//       <div className="grid gap-5 lg:grid-cols-3">

//         {/* Recent orders – clean table */}
//         <div className="lg:col-span-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
//           <div className="px-6 py-4 border-b border-slate-100">
//             <h3 className="font-semibold text-slate-800">Recent Orders</h3>
//             <p className="text-xs text-slate-400">Last 6 orders placed</p>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-slate-100 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
//                   <th className="px-4 py-2.5 sm:px-6">Customer</th>
//                   <th className="px-4 py-2.5 sm:px-6">Status</th>
//                   <th className="px-4 py-2.5 text-right sm:px-6">Amount</th>
//                   <th className="hidden px-6 py-2.5 text-right sm:table-cell">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {isFetching
//                   ? Array.from({ length: 5 }).map((_, i) => (
//                       <tr key={i} className="animate-pulse border-b border-slate-50">
//                         <td className="px-6 py-3">
//                           <div className="flex items-center gap-3">
//                             <div className="h-8 w-8 shrink-0 rounded-full bg-slate-100" />
//                             <div className="space-y-1.5">
//                               <div className="h-3 w-28 rounded bg-slate-100" />
//                               <div className="h-2.5 w-20 rounded bg-slate-50" />
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-3"><div className="h-5 w-20 rounded-full bg-slate-100" /></td>
//                         <td className="px-6 py-3 text-right"><div className="ml-auto h-4 w-14 rounded bg-slate-100" /></td>
//                         <td className="px-6 py-3 text-right"><div className="ml-auto h-3.5 w-12 rounded bg-slate-50" /></td>
//                       </tr>
//                     ))
//                   : recentOrders.length === 0
//                   ? <tr><td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-400">No orders yet</td></tr>
//                   : recentOrders.map((o) => <OrderRow key={o._id} order={o} />)
//                 }
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Right column – Pending reviews + Quick Summary */}
//         <div className="flex flex-col gap-4">
//           {/* Pending reviews – white card with pink icon */}
//           <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-pink-600">
//                 <MessageSquare className="h-5 w-5" />
//               </div>
//               <div>
//                 {isFetching ? (
//                   <div className="mb-1 h-6 w-12 animate-pulse rounded bg-slate-100" />
//                 ) : (
//                   <p className="text-2xl font-bold text-slate-800">{pendingReviews}</p>
//                 )}
//                 <p className="text-xs font-medium text-slate-500">Pending Reviews</p>
//               </div>
//             </div>
//           </div>

//           {/* Quick Summary – list of KPIs in compact form */}
//           <div className="flex-1 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
//             <h3 className="mb-4 font-semibold text-slate-800">Quick Summary</h3>
//             <div className="space-y-3">
//               {isFetching
//                 ? Array.from({ length: 4 }).map((_, i) => (
//                     <div key={i} className="flex animate-pulse items-center justify-between">
//                       <div className="h-3.5 w-24 rounded bg-slate-100" />
//                       <div className="h-4 w-16 rounded bg-slate-100" />
//                     </div>
//                   ))
//                 : stats.map((s) => (
//                     <div key={s.key} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
//                       <span className="text-sm text-slate-500">{KPI_CONFIG[s.key]?.label ?? s.label}</span>
//                       <span className="text-sm font-semibold text-slate-800">{s.value}</span>
//                     </div>
//                   ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // ── Order row ─────────────────────────────────────────────────────────────────
// function OrderRow({ order }) {
//   const name     = order.user?.name  ?? order.user?.email ?? 'Guest'
//   const email    = order.user?.email ?? ''
//   const price    = `₹${Number(order.totalPrice ?? 0).toLocaleString('en-IN')}`
//   const status   = order.orderStatus ?? 'Pending'
//   const date     = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'
//   const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?'

//   return (
//     <tr className="border-b border-slate-50 transition-colors hover:bg-slate-50/60">
//       <td className="px-4 py-3 sm:px-6">
//         <div className="flex items-center gap-2 sm:gap-3">
//           <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xs font-bold text-pink-700">
//             {initials}
//           </div>
//           <div className="min-w-0">
//             <p className="truncate text-sm font-medium text-slate-800 sm:max-w-40">{name}</p>
//             {email && <p className="hidden truncate text-[11px] text-slate-400 sm:block">{email}</p>}
//           </div>
//         </div>
//       </td>
//       <td className="px-4 py-3 sm:px-6">
//         <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_META[status] ?? 'bg-slate-100 text-slate-500'}`}>
//           {status}
//         </span>
//       </td>
//       <td className="px-4 py-3 text-right text-sm font-bold text-slate-800 sm:px-6">{price}</td>
//       <td className="hidden px-6 py-3 text-right text-xs text-slate-400 sm:table-cell">{date}</td>
//     </tr>
//   )
// }

// // ── Helpers ──────────────────────────────────────────────────────────────────
// function Skel({ h }) {
//   return <div className="animate-pulse rounded-lg bg-slate-50" style={{ height: h }} />
// }
// function Empty({ h }) {
//   return <div className="flex items-center justify-center text-sm text-slate-400" style={{ height: h }}>No data yet</div>
// }
// function fmtNum(n) {
//   if (n >= 10_00_000) return `${(n / 10_00_000).toFixed(1)}L`
//   if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`
//   return String(n)
// }


// app/dashboard/page.tsx
'use client'

import {
  ShoppingCart, Users, Store, IndianRupee, AlertCircle,
  RefreshCw, MessageSquare, Download,
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Tooltip as PieTooltip,
} from 'recharts'
import { useAuth } from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useDashboard'

// ─── KPI config ──────────────────────────────────────────────────────────────
const KPI_CONFIG = {
  revenue:   { icon: IndianRupee,  label: 'Total Revenue' },
  orders:    { icon: ShoppingCart, label: 'Total Orders' },
  customers: { icon: Users,        label: 'Customers' },
  vendors:   { icon: Store,        label: 'Active Vendors' },
}

// ─── Status badges ──────────────────────────────────────────────────────────
const STATUS_META = {
  Pending:    'bg-amber-50 text-amber-700',
  Processing: 'bg-blue-50  text-blue-700',
  Shipped:    'bg-indigo-50 text-indigo-700',
  Delivered:  'bg-emerald-50 text-emerald-700',
  Cancelled:  'bg-rose-50  text-rose-700',
}

// ─── Pie chart – pink scale ──────────────────────────────────────────────
const STATUS_PIE = ['#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777']

export default function DashboardPage() {
  const { user }                                        = useAuth()
  const { stats, overview, isFetching, error, refetch } = useDashboard()

  const salesByMonth   = overview?.salesByMonth   ?? []
  const ordersByStatus = overview?.ordersByStatus  ?? []
  const pendingReviews = overview?.pendingReviews  ?? 0
  const recentOrders   = overview?.recentOrders    ?? []

  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const today    = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  // ─── Export to CSV ──────────────────────────────────────────────────────
  const handleExport = () => {
    // Build stats rows
    const statsRows = stats.map(s => {
      const label = KPI_CONFIG[s.key]?.label ?? s.label
      const value = s.value
      return [label, value]
    })
    statsRows.push(['Pending Reviews', pendingReviews])

    // Build recent orders rows with DD/MM/YY date (fits Excel default width)
    const ordersRows = recentOrders.map(o => {
      const name = o.user?.name ?? o.user?.email ?? 'Guest'
      const status = o.orderStatus ?? 'Pending'
      const amount = Number(o.totalPrice ?? 0).toFixed(2)
      const date = o.createdAt
        ? new Date(o.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          })
        : ''
      return [name, status, amount, date]
    })

    // Combine CSV
    const lines = []
    lines.push('"Metric","Value"')
    statsRows.forEach(row => lines.push(`"${row[0]}","${row[1]}"`))
    lines.push('')
    lines.push('"Recent Orders"')
    lines.push('"Customer","Status","Amount","Date"')
    ordersRows.forEach(row => lines.push(`"${row[0]}","${row[1]}","${row[2]}","${row[3]}"`))

    const BOM = '\uFEFF'
    const csvContent = BOM + lines.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `dashboard_export_${new Date().toISOString().slice(0,10)}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="space-y-6">

      {/* ── Top bar ───────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-400">{greeting} · {today}</p>
          <h1 className="mt-0.5 text-xl font-bold text-slate-800 sm:text-2xl">
            Welcome back, {user?.name ?? 'Admin'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={isFetching || stats.length === 0}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={refetch}
            disabled={isFetching}
            className="shrink-0 flex items-center gap-2 rounded-lg bg-pink-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-pink-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* ── KPI cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {isFetching
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse h-28 rounded-lg bg-slate-100" />
            ))
          : stats.map((s) => {
              const c = KPI_CONFIG[s.key] ?? KPI_CONFIG.orders
              return (
                <div
                  key={s.key}
                  className="relative rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-2xl font-bold text-slate-800">{s.value}</p>
                      <p className="text-xs font-medium text-slate-500">{c.label}</p>
                    </div>
                    <c.icon className="h-6 w-6 text-pink-500" strokeWidth={1.5} />
                  </div>
                </div>
              )
            })}
      </div>

      {/* ── Charts row ─────────────────────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Monthly Sales</h3>
            <span className="text-xs text-slate-400">Revenue and order volume by month</span>
          </div>
          {isFetching ? <Skel h={240} /> : salesByMonth.length === 0 ? <Empty h={240} /> : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={salesByMonth} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#ec4899" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={44} tickFormatter={fmtNum} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: 12 }}
                  formatter={(v) => `₹${v.toLocaleString('en-IN')}`}
                  labelFormatter={(l) => `Month: ${l}`}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#ec4899"
                  strokeWidth={2.5}
                  fill="url(#salesGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#ec4899', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-0.5 font-semibold text-slate-800">Order Status</h3>
          <p className="mb-3 text-xs text-slate-400">All orders by current status</p>
          {isFetching ? <Skel h={160} /> : ordersByStatus.length === 0 ? <Empty h={160} /> : (
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={68}
                  paddingAngle={3}
                >
                  {ordersByStatus.map((_, i) => (
                    <Cell key={i} fill={STATUS_PIE[i % STATUS_PIE.length]} />
                  ))}
                </Pie>
                <PieTooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {isFetching
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
                ))
              : ordersByStatus.map((o) => (
                  <span
                    key={o.status}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_META[o.status] ?? 'bg-slate-100 text-slate-500'}`}
                  >
                    {o.status} · {o.count}
                  </span>
                ))}
          </div>
        </div>
      </div>

      {/* ── Bottom row ─────────────────────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">Recent Orders</h3>
            <p className="text-xs text-slate-400">Last 6 orders placed</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-2.5 sm:px-6">Customer</th>
                  <th className="px-4 py-2.5 sm:px-6">Status</th>
                  <th className="px-4 py-2.5 text-right sm:px-6">Amount</th>
                  <th className="hidden px-6 py-2.5 text-right sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {isFetching
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="animate-pulse border-b border-slate-50">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 shrink-0 rounded-full bg-slate-100" />
                            <div className="space-y-1.5">
                              <div className="h-3 w-28 rounded bg-slate-100" />
                              <div className="h-2.5 w-20 rounded bg-slate-50" />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3"><div className="h-5 w-20 rounded-full bg-slate-100" /></td>
                        <td className="px-6 py-3 text-right"><div className="ml-auto h-4 w-14 rounded bg-slate-100" /></td>
                        <td className="px-6 py-3 text-right"><div className="ml-auto h-3.5 w-12 rounded bg-slate-50" /></td>
                      </tr>
                    ))
                  : recentOrders.length === 0
                  ? <tr><td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-400">No orders yet</td></tr>
                  : recentOrders.map((o) => <OrderRow key={o._id} order={o} />)
                }
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                {isFetching ? (
                  <div className="mb-1 h-6 w-12 animate-pulse rounded bg-slate-100" />
                ) : (
                  <p className="text-2xl font-bold text-slate-800">{pendingReviews}</p>
                )}
                <p className="text-xs font-medium text-slate-500">Pending Reviews</p>
              </div>
            </div>
          </div>

          <div className="flex-1 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 font-semibold text-slate-800">Quick Summary</h3>
            <div className="space-y-3">
              {isFetching
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex animate-pulse items-center justify-between">
                      <div className="h-3.5 w-24 rounded bg-slate-100" />
                      <div className="h-4 w-16 rounded bg-slate-100" />
                    </div>
                  ))
                : stats.map((s) => (
                    <div key={s.key} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                      <span className="text-sm text-slate-500">{KPI_CONFIG[s.key]?.label ?? s.label}</span>
                      <span className="text-sm font-semibold text-slate-800">{s.value}</span>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Order row ─────────────────────────────────────────────────────────────────
function OrderRow({ order }) {
  const name     = order.user?.name  ?? order.user?.email ?? 'Guest'
  const email    = order.user?.email ?? ''
  const price    = `₹${Number(order.totalPrice ?? 0).toLocaleString('en-IN')}`
  const status   = order.orderStatus ?? 'Pending'
  const date     = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?'

  return (
    <tr className="border-b border-slate-50 transition-colors hover:bg-slate-50/60">
      <td className="px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-100 text-xs font-bold text-pink-700">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-800 sm:max-w-40">{name}</p>
            {email && <p className="hidden truncate text-[11px] text-slate-400 sm:block">{email}</p>}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 sm:px-6">
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_META[status] ?? 'bg-slate-100 text-slate-500'}`}>
          {status}
        </span>
      </td>
      <td className="px-4 py-3 text-right text-sm font-bold text-slate-800 sm:px-6">{price}</td>
      <td className="hidden px-6 py-3 text-right text-xs text-slate-400 sm:table-cell">{date}</td>
    </tr>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function Skel({ h }) {
  return <div className="animate-pulse rounded-lg bg-slate-50" style={{ height: h }} />
}
function Empty({ h }) {
  return <div className="flex items-center justify-center text-sm text-slate-400" style={{ height: h }}>No data yet</div>
}
function fmtNum(n) {
  if (n >= 10_00_000) return `${(n / 10_00_000).toFixed(1)}L`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}