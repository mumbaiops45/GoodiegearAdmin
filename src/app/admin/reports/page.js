// // // // 'use client'

// // // // import { ShoppingCart, IndianRupee, AlertCircle, RefreshCw, Package, BarChart3 } from 'lucide-react'
// // // // import {
// // // //   ResponsiveContainer,
// // // //   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
// // // // } from 'recharts'
// // // // import { useReports } from '@/hooks/useReports'

// // // // const BAR_COLORS   = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']
// // // // const RANK_STYLES  = [
// // // //   'bg-amber-400  text-white',
// // // //   'bg-slate-400  text-white',
// // // //   'bg-orange-400 text-white',
// // // //   'bg-slate-200  text-slate-600',
// // // //   'bg-slate-200  text-slate-600',
// // // // ]

// // // // export default function ReportsPage() {
// // // //   const { reports, overview, isFetching, error, refetch } = useReports()

// // // //   const topProducts        = reports?.topProducts        ?? []
// // // //   const avgOrderValue      = reports?.avgOrderValue      ?? '—'
// // // //   const totalOrders        = reports?.totalOrders        ?? 0
// // // //   const productsByCategory = overview?.productsByCategory ?? []
// // // //   const salesByMonth       = overview?.salesByMonth      ?? []

// // // //   const totalCatProducts   = productsByCategory.reduce((s, c) => s + (c.value ?? 0), 0) || 1

// // // //   return (
// // // //     <div className="space-y-6">

// // // //       {/* ── Header ───────────────────────────────────────────────── */}
// // // //       <div className="flex items-center justify-between border-b border-slate-100 pb-5">
// // // //         <div className="flex items-center gap-3">
// // // //           <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600">
// // // //             <BarChart3 className="h-5 w-5 text-white" />
// // // //           </div>
// // // //           <div>
// // // //             <h1 className="text-xl font-black text-slate-800">Reports</h1>
// // // //             <p className="text-xs text-slate-400">Sales analytics & product performance</p>
// // // //           </div>
// // // //         </div>
// // // //         <button
// // // //           onClick={refetch}
// // // //           disabled={isFetching}
// // // //           className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
// // // //         >
// // // //           <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
// // // //           Refresh
// // // //         </button>
// // // //       </div>

// // // //       {error && (
// // // //         <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
// // // //           <AlertCircle className="h-4 w-4 shrink-0" /> {error}
// // // //         </div>
// // // //       )}

// // // //       {/* ── Flat metric strip ─────────────────────────────────────── */}
// // // //       <div className="grid grid-cols-2 divide-x divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
// // // //         <MetricCell
// // // //           loading={isFetching}
// // // //           icon={IndianRupee}
// // // //           value={avgOrderValue}
// // // //           label="Average Order Value"
// // // //           sub="Per transaction"
// // // //         />
// // // //         <MetricCell
// // // //           loading={isFetching}
// // // //           icon={ShoppingCart}
// // // //           value={totalOrders.toLocaleString('en-IN')}
// // // //           label="Total Orders"
// // // //           sub="All time"
// // // //         />
// // // //       </div>

// // // //       {/* ── Revenue bar chart — full width ────────────────────────── */}
// // // //       <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
// // // //         <div className="mb-5 flex items-start justify-between">
// // // //           <div>
// // // //             <h3 className="font-bold text-slate-800">Revenue by Month</h3>
// // // //             <p className="text-xs text-slate-400">Total sales revenue per calendar month</p>
// // // //           </div>
// // // //           {!isFetching && salesByMonth.length > 0 && (
// // // //             <p className="text-xs font-semibold text-indigo-600">
// // // //               ₹{salesByMonth.reduce((s, m) => s + (m.sales ?? 0), 0).toLocaleString('en-IN')} total
// // // //             </p>
// // // //           )}
// // // //         </div>

// // // //         {isFetching ? <Skel h={220} /> : salesByMonth.length === 0 ? <Empty h={220} /> : (
// // // //           <ResponsiveContainer width="100%" height={220}>
// // // //             <BarChart data={salesByMonth} barSize={28} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
// // // //               <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
// // // //               <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
// // // //               <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={48} tickFormatter={fmtNum} />
// // // //               <Tooltip
// // // //                 cursor={{ fill: '#f8fafc' }}
// // // //                 contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: 12 }}
// // // //                 formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
// // // //               />
// // // //               <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
// // // //                 {salesByMonth.map((_, i) => (
// // // //                   <Cell key={i} fill={i === salesByMonth.length - 1 ? '#6366f1' : '#e0e7ff'} />
// // // //                 ))}
// // // //               </Bar>
// // // //             </BarChart>
// // // //           </ResponsiveContainer>
// // // //         )}
// // // //         <p className="mt-2 text-[10px] text-slate-400">Latest month highlighted in indigo</p>
// // // //       </div>

// // // //       {/* ── Bottom row: top products table + category bars ────────── */}
// // // //       <div className="grid gap-5 lg:grid-cols-3">

// // // //         {/* Top products — data table */}
// // // //         <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
// // // //           <div className="border-b border-slate-100 px-6 py-4">
// // // //             <h3 className="font-bold text-slate-800">Top 5 Products</h3>
// // // //             <p className="text-xs text-slate-400">Ranked by units sold</p>
// // // //           </div>

// // // //           {isFetching ? (
// // // //             <div className="divide-y divide-slate-50">
// // // //               {Array.from({ length: 5 }).map((_, i) => (
// // // //                 <div key={i} className="flex animate-pulse items-center gap-4 px-6 py-3.5">
// // // //                   <div className="h-7 w-7 shrink-0 rounded-full bg-slate-100" />
// // // //                   <div className="flex-1 space-y-1.5">
// // // //                     <div className="h-3.5 w-44 rounded bg-slate-100" />
// // // //                     <div className="h-1.5 w-full rounded-full bg-slate-50" />
// // // //                   </div>
// // // //                   <div className="space-y-1 text-right">
// // // //                     <div className="ml-auto h-4 w-12 rounded bg-slate-100" />
// // // //                     <div className="ml-auto h-3 w-20 rounded bg-slate-50" />
// // // //                   </div>
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //           ) : topProducts.length === 0 ? (
// // // //             <div className="flex flex-col items-center gap-3 py-12">
// // // //               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
// // // //                 <Package className="h-5 w-5 text-slate-300" />
// // // //               </div>
// // // //               <p className="text-sm text-slate-500">No sales data yet</p>
// // // //             </div>
// // // //           ) : (
// // // //             <>
// // // //               {/* Table header */}
// // // //               <div className="grid grid-cols-12 border-b border-slate-50 bg-slate-50 px-6 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
// // // //                 <span className="col-span-1">#</span>
// // // //                 <span className="col-span-5">Product</span>
// // // //                 <span className="col-span-3 text-right">Units Sold</span>
// // // //                 <span className="col-span-3 text-right">Revenue</span>
// // // //               </div>
// // // //               <div className="divide-y divide-slate-50">
// // // //                 {topProducts.map((p, i) => {
// // // //                   const maxSold = topProducts[0]?.sold || 1
// // // //                   const pct     = Math.round((p.sold / maxSold) * 100)
// // // //                   return (
// // // //                     <div key={i} className="grid grid-cols-12 items-center gap-2 px-6 py-3.5 transition hover:bg-slate-50/60">
// // // //                       <div className="col-span-1">
// // // //                         <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black ${RANK_STYLES[i] ?? RANK_STYLES[4]}`}>
// // // //                           {i + 1}
// // // //                         </span>
// // // //                       </div>
// // // //                       <div className="col-span-5 min-w-0">
// // // //                         <p className="truncate text-sm font-semibold text-slate-800">{p.name}</p>
// // // //                         <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-100">
// // // //                           <div className="h-full rounded-full bg-indigo-400" style={{ width: `${pct}%` }} />
// // // //                         </div>
// // // //                       </div>
// // // //                       <div className="col-span-3 text-right">
// // // //                         <p className="text-sm font-bold text-slate-800">{p.sold.toLocaleString('en-IN')}</p>
// // // //                         <p className="text-[10px] text-slate-400">units</p>
// // // //                       </div>
// // // //                       <div className="col-span-3 text-right">
// // // //                         <p className="text-sm font-bold text-indigo-600">₹{Number(p.revenue ?? 0).toLocaleString('en-IN')}</p>
// // // //                       </div>
// // // //                     </div>
// // // //                   )
// // // //                 })}
// // // //               </div>
// // // //             </>
// // // //           )}
// // // //         </div>

// // // //         {/* Category breakdown — horizontal bars */}
// // // //         <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
// // // //           <h3 className="mb-0.5 font-bold text-slate-800">By Category</h3>
// // // //           <p className="mb-5 text-xs text-slate-400">Products per category</p>

// // // //           {isFetching ? (
// // // //             <div className="space-y-4">
// // // //               {Array.from({ length: 5 }).map((_, i) => (
// // // //                 <div key={i} className="animate-pulse space-y-1.5">
// // // //                   <div className="h-3 w-24 rounded bg-slate-100" />
// // // //                   <div className="h-2 w-full rounded-full bg-slate-50" />
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //           ) : productsByCategory.length === 0 ? (
// // // //             <Empty h={180} />
// // // //           ) : (
// // // //             <div className="space-y-4">
// // // //               {productsByCategory.map((c, i) => {
// // // //                 const pct = Math.round((c.value / totalCatProducts) * 100)
// // // //                 return (
// // // //                   <div key={c.name}>
// // // //                     <div className="mb-1.5 flex items-center justify-between">
// // // //                       <span className="text-xs font-semibold text-slate-700 truncate max-w-32">{c.name}</span>
// // // //                       <span className="text-xs font-bold text-slate-500">{c.value} <span className="font-normal text-slate-400">({pct}%)</span></span>
// // // //                     </div>
// // // //                     <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
// // // //                       <div
// // // //                         className="h-full rounded-full transition-all"
// // // //                         style={{ width: `${pct}%`, background: BAR_COLORS[i % BAR_COLORS.length] }}
// // // //                       />
// // // //                     </div>
// // // //                   </div>
// // // //                 )
// // // //               })}
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }

// // // // // ── Metric cell ───────────────────────────────────────────────────────────────

// // // // function MetricCell({ loading, icon: Icon, value, label, sub }) {
// // // //   return (
// // // //     <div className="p-6">
// // // //       <div className="mb-3 flex items-center gap-2 text-slate-400">
// // // //         <Icon className="h-4 w-4" />
// // // //         <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
// // // //       </div>
// // // //       {loading
// // // //         ? <div className="h-8 w-32 animate-pulse rounded bg-slate-100" />
// // // //         : <p className="text-3xl font-black tracking-tight text-slate-800">{value}</p>
// // // //       }
// // // //       <p className="mt-1 text-xs text-slate-400">{sub}</p>
// // // //     </div>
// // // //   )
// // // // }

// // // // function Skel({ h }) {
// // // //   return <div className="animate-pulse rounded-xl bg-slate-50" style={{ height: h }} />
// // // // }
// // // // function Empty({ h }) {
// // // //   return <div className="flex items-center justify-center text-sm text-slate-400" style={{ height: h }}>No data yet</div>
// // // // }
// // // // function fmtNum(n) {
// // // //   if (n >= 10_00_000) return `${(n / 10_00_000).toFixed(1)}L`
// // // //   if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`
// // // //   return String(n)
// // // // }



// // // // app/dashboard/reports/page.tsx


// // // 'use client'

// // // import { useState } from 'react'
// // // import {
// // //   ShoppingCart, IndianRupee, AlertCircle, RefreshCw,
// // //   Package, BarChart3, TrendingUp, Download, Calendar,
// // // } from 'lucide-react'
// // // import {
// // //   ResponsiveContainer,
// // //   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
// // //   PieChart, Pie, Cell as PieCell,
// // // } from 'recharts'
// // // import { useReports } from '@/hooks/useReports'

// // // // ─── Colour palette ──────────────────────────────────────────────────────────
// // // const PINK_500 = '#ec4899'
// // // const PINK_200 = '#fbcfe8'
// // // const PINK_100 = '#fce7f3'
// // // const PINK_GRADIENT = ['#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777']

// // // // ─── Ranking styles ──────────────────────────────────────────────────────────
// // // const RANK_STYLES = [
// // //   'bg-amber-400 text-white',
// // //   'bg-slate-400 text-white',
// // //   'bg-orange-400 text-white',
// // //   'bg-slate-200 text-slate-600',
// // //   'bg-slate-200 text-slate-600',
// // // ]

// // // export default function ReportsPage() {
// // //   const { reports, overview, isFetching, error, refetch } = useReports()

// // //   const topProducts        = reports?.topProducts        ?? []
// // //   const avgOrderValue      = reports?.avgOrderValue      ?? '—'
// // //   const totalOrders        = reports?.totalOrders        ?? 0
// // //   const productsByCategory = overview?.productsByCategory ?? []
// // //   const salesByMonth       = overview?.salesByMonth      ?? []

// // //   const totalRevenue       = salesByMonth.reduce((s, m) => s + (m.sales ?? 0), 0)
// // //   const totalCatProducts   = productsByCategory.reduce((s, c) => s + (c.value ?? 0), 0) || 1

// // //   // ─── For demo, we'll use a static date range – replace with real picker ──
// // //   const [dateRange, setDateRange] = useState('Last 6 Months')

// // //   return (
// // //     <div className="space-y-6">

// // //       {/* ─── Header with title, date picker & export ───────────────────────── */}
// // //       <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
// // //         <div className="flex items-center gap-3">
// // //           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-600 shadow-sm">
// // //             <BarChart3 className="h-5 w-5 text-white" />
// // //           </div>
// // //           <div>
// // //             <h1 className="text-2xl font-bold tracking-tight text-slate-800">Reports</h1>
// // //             <p className="text-xs text-slate-400">Sales analytics & product performance</p>
// // //           </div>
// // //         </div>
// // //         <div className="flex items-center gap-3">
// // //           {/* Date range selector – placeholder */}
// // //           <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
// // //             <Calendar className="h-4 w-4 text-slate-400" />
// // //             <span>{dateRange}</span>
// // //           </div>
// // //           {/* Export button */}
// // //           <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50">
// // //             <Download className="h-4 w-4" />
// // //             Export
// // //           </button>
// // //           {/* Refresh */}
// // //           <button
// // //             onClick={refetch}
// // //             disabled={isFetching}
// // //             className="flex items-center gap-2 rounded-lg bg-pink-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-pink-700 disabled:opacity-50"
// // //           >
// // //             <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
// // //             Refresh
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {error && (
// // //         <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
// // //           <AlertCircle className="h-4 w-4 shrink-0" /> {error}
// // //         </div>
// // //       )}

// // //       {/* ─── KPI Cards ──────────────────────────────────────────────────────── */}
// // //       <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
// // //         <KpiCard
// // //           loading={isFetching}
// // //           icon={IndianRupee}
// // //           value={totalRevenue ? `₹${totalRevenue.toLocaleString('en-IN')}` : '—'}
// // //           label="Total Revenue"
// // //           trend="+12.5%"
// // //         />
// // //         <KpiCard
// // //           loading={isFetching}
// // //           icon={ShoppingCart}
// // //           value={totalOrders.toLocaleString('en-IN')}
// // //           label="Total Orders"
// // //           trend="+8.2%"
// // //         />
// // //         <KpiCard
// // //           loading={isFetching}
// // //           icon={TrendingUp}
// // //           value={avgOrderValue !== '—' ? `₹${avgOrderValue.toLocaleString('en-IN')}` : '—'}
// // //           label="Average Order Value"
// // //           trend="+3.1%"
// // //         />
// // //         <KpiCard
// // //           loading={isFetching}
// // //           icon={Package}
// // //           value={topProducts.length ? topProducts[0].name : '—'}
// // //           label="Top Product"
// // //           sub={topProducts.length ? `${topProducts[0].sold} units sold` : 'No data'}
// // //         />
// // //       </div>

// // //       {/* ─── Charts Row ──────────────────────────────────────────────────────── */}
// // //       <div className="grid gap-5 lg:grid-cols-3">

// // //         {/* Revenue Bar Chart (2/3 width) */}
// // //         <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
// // //           <div className="mb-4 flex items-center justify-between">
// // //             <div>
// // //               <h3 className="font-semibold text-slate-800">Revenue by Month</h3>
// // //               <p className="text-xs text-slate-400">Monthly sales performance</p>
// // //             </div>
// // //             <span className="text-xs font-medium text-pink-600">
// // //               Total: ₹{totalRevenue.toLocaleString('en-IN')}
// // //             </span>
// // //           </div>

// // //           {isFetching ? <Skel h={200} /> : salesByMonth.length === 0 ? <Empty h={200} /> : (
// // //             <ResponsiveContainer width="100%" height={200}>
// // //               <BarChart data={salesByMonth} barSize={32} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
// // //                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
// // //                 <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
// // //                 <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={44} tickFormatter={fmtNum} />
// // //                 <Tooltip
// // //                   cursor={{ fill: '#f8fafc' }}
// // //                   contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
// // //                   formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
// // //                 />
// // //                 <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
// // //                   {salesByMonth.map((_, i) => (
// // //                     <Cell key={i} fill={i === salesByMonth.length - 1 ? PINK_500 : PINK_100} />
// // //                   ))}
// // //                 </Bar>
// // //               </BarChart>
// // //             </ResponsiveContainer>
// // //           )}
// // //           <p className="mt-2 text-[10px] text-slate-400">Latest month highlighted in pink</p>
// // //         </div>

// // //         {/* Category Distribution (Pie) – 1/3 width */}
// // //         <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
// // //           <h3 className="mb-0.5 font-semibold text-slate-800">Category Distribution</h3>
// // //           <p className="mb-3 text-xs text-slate-400">Products per category</p>

// // //           {isFetching ? <Skel h={180} /> : productsByCategory.length === 0 ? <Empty h={180} /> : (
// // //             <ResponsiveContainer width="100%" height={180}>
// // //               <PieChart>
// // //                 <Pie
// // //                   data={productsByCategory}
// // //                   dataKey="value"
// // //                   nameKey="name"
// // //                   cx="50%"
// // //                   cy="50%"
// // //                   innerRadius={45}
// // //                   outerRadius={70}
// // //                   paddingAngle={2}
// // //                 >
// // //                   {productsByCategory.map((_, i) => (
// // //                     <PieCell key={i} fill={PINK_GRADIENT[i % PINK_GRADIENT.length]} />
// // //                   ))}
// // //                 </Pie>
// // //                 <Tooltip
// // //                   contentStyle={{
// // //                     borderRadius: 8,
// // //                     border: '1px solid #e2e8f0',
// // //                     boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
// // //                     fontSize: 12,
// // //                   }}
// // //                   formatter={(v, name) => [`${v} products`, name]}
// // //                 />
// // //               </PieChart>
// // //             </ResponsiveContainer>
// // //           )}
// // //           <div className="mt-3 flex flex-wrap justify-center gap-2">
// // //             {productsByCategory.slice(0, 4).map((c, i) => (
// // //               <span key={c.name} className="flex items-center gap-1 text-xs text-slate-500">
// // //                 <span className="inline-block h-2 w-2 rounded-full" style={{ background: PINK_GRADIENT[i % PINK_GRADIENT.length] }} />
// // //                 {c.name} ({c.value})
// // //               </span>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* ─── Top Products Table (full width) ──────────────────────────────── */}
// // //       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
// // //         <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
// // //           <div>
// // //             <h3 className="font-semibold text-slate-800">Top Performing Products</h3>
// // //             <p className="text-xs text-slate-400">Ranked by units sold</p>
// // //           </div>
// // //           <span className="text-xs text-slate-500">{topProducts.length} products</span>
// // //         </div>

// // //         {isFetching ? (
// // //           <div className="divide-y divide-slate-50">
// // //             {Array.from({ length: 5 }).map((_, i) => (
// // //               <div key={i} className="flex animate-pulse items-center gap-4 px-6 py-3.5">
// // //                 <div className="h-6 w-6 rounded-full bg-slate-100" />
// // //                 <div className="flex-1 space-y-1.5">
// // //                   <div className="h-3.5 w-44 rounded bg-slate-100" />
// // //                   <div className="h-1.5 w-full rounded bg-slate-50" />
// // //                 </div>
// // //                 <div className="space-y-1 text-right">
// // //                   <div className="ml-auto h-4 w-12 rounded bg-slate-100" />
// // //                   <div className="ml-auto h-3 w-20 rounded bg-slate-50" />
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         ) : topProducts.length === 0 ? (
// // //           <div className="flex flex-col items-center gap-3 py-12 text-slate-400">
// // //             <Package className="h-10 w-10" strokeWidth={1} />
// // //             <p className="text-sm">No sales data available</p>
// // //           </div>
// // //         ) : (
// // //           <div className="overflow-x-auto">
// // //             <table className="w-full text-sm">
// // //               <thead>
// // //                 <tr className="border-b border-slate-100 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
// // //                   <th className="px-6 py-3">#</th>
// // //                   <th className="px-6 py-3">Product</th>
// // //                   <th className="px-6 py-3 text-right">Units Sold</th>
// // //                   <th className="px-6 py-3 text-right">Revenue</th>
// // //                   <th className="px-6 py-3 text-right">% of Total</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="divide-y divide-slate-50">
// // //                 {topProducts.map((p, i) => {
// // //                   const maxSold = topProducts[0]?.sold || 1
// // //                   const pct = Math.round((p.sold / maxSold) * 100)
// // //                   const revenueShare = totalRevenue ? ((p.revenue || 0) / totalRevenue * 100).toFixed(1) : 0
// // //                   return (
// // //                     <tr key={i} className="transition hover:bg-slate-50/60">
// // //                       <td className="px-6 py-3.5">
// // //                         <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black ${RANK_STYLES[i] ?? RANK_STYLES[4]}`}>
// // //                           {i + 1}
// // //                         </span>
// // //                       </td>
// // //                       <td className="px-6 py-3.5">
// // //                         <div className="flex items-center gap-3">
// // //                           <div className="flex-1">
// // //                             <p className="font-medium text-slate-800">{p.name}</p>
// // //                             <div className="mt-1 h-1 w-48 max-w-full rounded-full bg-slate-100">
// // //                               <div className="h-full rounded-full bg-pink-400" style={{ width: `${pct}%` }} />
// // //                             </div>
// // //                           </div>
// // //                         </div>
// // //                       </td>
// // //                       <td className="px-6 py-3.5 text-right font-semibold text-slate-700">
// // //                         {p.sold.toLocaleString('en-IN')}
// // //                       </td>
// // //                       <td className="px-6 py-3.5 text-right font-semibold text-pink-600">
// // //                         ₹{Number(p.revenue ?? 0).toLocaleString('en-IN')}
// // //                       </td>
// // //                       <td className="px-6 py-3.5 text-right text-slate-500">
// // //                         {revenueShare}%
// // //                       </td>
// // //                     </tr>
// // //                   )
// // //                 })}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // // ─── KPI Card Component ──────────────────────────────────────────────────────
// // // function KpiCard({ loading, icon: Icon, value, label, trend, sub }) {
// // //   return (
// // //     <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
// // //       <div className="flex items-center justify-between">
// // //         <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-pink-600">
// // //           <Icon className="h-4 w-4" />
// // //         </div>
// // //         {trend && (
// // //           <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
// // //             {trend}
// // //           </span>
// // //         )}
// // //       </div>
// // //       <div className="mt-3">
// // //         {loading ? (
// // //           <div className="h-6 w-24 animate-pulse rounded bg-slate-100" />
// // //         ) : (
// // //           <p className="text-xl font-bold text-slate-800">{value}</p>
// // //         )}
// // //         <p className="text-xs font-medium text-slate-500">{label}</p>
// // //         {sub && <p className="mt-0.5 text-[10px] text-slate-400">{sub}</p>}
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // // ─── Helpers ──────────────────────────────────────────────────────────────────
// // // function Skel({ h }) {
// // //   return <div className="animate-pulse rounded-lg bg-slate-50" style={{ height: h }} />
// // // }
// // // function Empty({ h }) {
// // //   return <div className="flex items-center justify-center text-sm text-slate-400" style={{ height: h }}>No data yet</div>
// // // }
// // // function fmtNum(n) {
// // //   if (n >= 10_00_000) return `${(n / 10_00_000).toFixed(1)}L`
// // //   if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
// // //   return String(n)
// // // }

// // // app/dashboard/reports/page.tsx
// // 'use client'

// // import { useState } from 'react'
// // import {
// //   ShoppingCart, IndianRupee, AlertCircle, RefreshCw,
// //   Package, BarChart3, TrendingUp, Download, Calendar,
// // } from 'lucide-react'
// // import {
// //   ResponsiveContainer,
// //   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
// //   PieChart, Pie, Cell as PieCell,
// // } from 'recharts'
// // import { useReports } from '@/hooks/useReports'

// // // ─── Colour palette ──────────────────────────────────────────────────────────
// // const PINK_500 = '#ec4899'
// // const PINK_100 = '#fce7f3'
// // const PINK_GRADIENT = ['#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777']

// // // ─── Ranking styles ──────────────────────────────────────────────────────────
// // const RANK_STYLES = [
// //   'bg-amber-400 text-white',
// //   'bg-slate-400 text-white',
// //   'bg-orange-400 text-white',
// //   'bg-slate-200 text-slate-600',
// //   'bg-slate-200 text-slate-600',
// // ]

// // export default function ReportsPage() {
// //   const { reports, overview, isFetching, error, refetch } = useReports()

// //   const topProducts        = reports?.topProducts        ?? []
// //   const avgOrderValue      = reports?.avgOrderValue      ?? '—'
// //   const totalOrders        = reports?.totalOrders        ?? 0
// //   const productsByCategory = overview?.productsByCategory ?? []
// //   const salesByMonth       = overview?.salesByMonth      ?? []

// //   const totalRevenue       = salesByMonth.reduce((s, m) => s + (m.sales ?? 0), 0)
// //   const totalCatProducts   = productsByCategory.reduce((s, c) => s + (c.value ?? 0), 0) || 1

// //   const [dateRange, setDateRange] = useState('Last 6 Months')

// //   return (
// //     <div className="space-y-6">

// //       {/* ─── Header with title, date picker & export ───────────────────────── */}
// //       <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
// //         <div className="flex items-center gap-3">
// //           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-600 shadow-sm">
// //             <BarChart3 className="h-5 w-5 text-white" />
// //           </div>
// //           <div>
// //             <h1 className="text-2xl font-bold tracking-tight text-slate-800">Reports</h1>
// //             <p className="text-xs text-slate-400">Sales analytics & product performance</p>
// //           </div>
// //         </div>
// //         <div className="flex items-center gap-3">
// //           {/* Date range selector – placeholder */}
// //           <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
// //             <Calendar className="h-4 w-4 text-slate-400" />
// //             <span>{dateRange}</span>
// //           </div>
// //           {/* Export button */}
// //           <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50">
// //             <Download className="h-4 w-4" />
// //             Export
// //           </button>
// //           {/* Refresh */}
// //           <button
// //             onClick={refetch}
// //             disabled={isFetching}
// //             className="flex items-center gap-2 rounded-lg bg-pink-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-pink-700 disabled:opacity-50"
// //           >
// //             <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
// //             Refresh
// //           </button>
// //         </div>
// //       </div>

// //       {error && (
// //         <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
// //           <AlertCircle className="h-4 w-4 shrink-0" /> {error}
// //         </div>
// //       )}

// //       {/* ─── KPI Cards ──────────────────────────────────────────────────────── */}
// //       <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
// //         <KpiCard
// //           loading={isFetching}
// //           icon={IndianRupee}
// //           value={totalRevenue ? `₹${totalRevenue.toLocaleString('en-IN')}` : '—'}
// //           label="Total Revenue"
// //           trend="+12.5%"
// //         />
// //         <KpiCard
// //           loading={isFetching}
// //           icon={ShoppingCart}
// //           value={totalOrders.toLocaleString('en-IN')}
// //           label="Total Orders"
// //           trend="+8.2%"
// //         />
// //         <KpiCard
// //           loading={isFetching}
// //           icon={TrendingUp}
// //           value={avgOrderValue}   // ✅ Fixed – already formatted by backend
// //           label="Average Order Value"
// //           trend="+3.1%"
// //         />
// //         <KpiCard
// //           loading={isFetching}
// //           icon={Package}
// //           value={topProducts.length ? topProducts[0].name : '—'}
// //           label="Top Product"
// //           sub={topProducts.length ? `${topProducts[0].sold} units sold` : 'No data'}
// //         />
// //       </div>

// //       {/* ─── Charts Row ──────────────────────────────────────────────────────── */}
// //       <div className="grid gap-5 lg:grid-cols-3">

// //         {/* Revenue Bar Chart (2/3 width) */}
// //         <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
// //           <div className="mb-4 flex items-center justify-between">
// //             <div>
// //               <h3 className="font-semibold text-slate-800">Revenue by Month</h3>
// //               <p className="text-xs text-slate-400">Monthly sales performance</p>
// //             </div>
// //             <span className="text-xs font-medium text-pink-600">
// //               Total: ₹{totalRevenue.toLocaleString('en-IN')}
// //             </span>
// //           </div>

// //           {isFetching ? <Skel h={200} /> : salesByMonth.length === 0 ? <Empty h={200} /> : (
// //             <ResponsiveContainer width="100%" height={200}>
// //               <BarChart data={salesByMonth} barSize={32} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
// //                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
// //                 <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
// //                 <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={44} tickFormatter={fmtNum} />
// //                 <Tooltip
// //                   cursor={{ fill: '#f8fafc' }}
// //                   contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
// //                   formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
// //                 />
// //                 <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
// //                   {salesByMonth.map((_, i) => (
// //                     <Cell key={i} fill={i === salesByMonth.length - 1 ? PINK_500 : PINK_100} />
// //                   ))}
// //                 </Bar>
// //               </BarChart>
// //             </ResponsiveContainer>
// //           )}
// //           <p className="mt-2 text-[10px] text-slate-400">Latest month highlighted in pink</p>
// //         </div>

// //         {/* Category Distribution (Pie) – 1/3 width */}
// //         <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
// //           <h3 className="mb-0.5 font-semibold text-slate-800">Category Distribution</h3>
// //           <p className="mb-3 text-xs text-slate-400">Products per category</p>

// //           {isFetching ? <Skel h={180} /> : productsByCategory.length === 0 ? <Empty h={180} /> : (
// //             <ResponsiveContainer width="100%" height={180}>
// //               <PieChart>
// //                 <Pie
// //                   data={productsByCategory}
// //                   dataKey="value"
// //                   nameKey="name"
// //                   cx="50%"
// //                   cy="50%"
// //                   innerRadius={45}
// //                   outerRadius={70}
// //                   paddingAngle={2}
// //                 >
// //                   {productsByCategory.map((_, i) => (
// //                     <PieCell key={i} fill={PINK_GRADIENT[i % PINK_GRADIENT.length]} />
// //                   ))}
// //                 </Pie>
// //                 <Tooltip
// //                   contentStyle={{
// //                     borderRadius: 8,
// //                     border: '1px solid #e2e8f0',
// //                     boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
// //                     fontSize: 12,
// //                   }}
// //                   formatter={(v, name) => [`${v} products`, name]}
// //                 />
// //               </PieChart>
// //             </ResponsiveContainer>
// //           )}
// //           <div className="mt-3 flex flex-wrap justify-center gap-2">
// //             {productsByCategory.slice(0, 4).map((c, i) => (
// //               <span key={c.name} className="flex items-center gap-1 text-xs text-slate-500">
// //                 <span className="inline-block h-2 w-2 rounded-full" style={{ background: PINK_GRADIENT[i % PINK_GRADIENT.length] }} />
// //                 {c.name} ({c.value})
// //               </span>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* ─── Top Products Table (full width) ──────────────────────────────── */}
// //       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
// //         <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
// //           <div>
// //             <h3 className="font-semibold text-slate-800">Top Performing Products</h3>
// //             <p className="text-xs text-slate-400">Ranked by units sold</p>
// //           </div>
// //           <span className="text-xs text-slate-500">{topProducts.length} products</span>
// //         </div>

// //         {isFetching ? (
// //           <div className="divide-y divide-slate-50">
// //             {Array.from({ length: 5 }).map((_, i) => (
// //               <div key={i} className="flex animate-pulse items-center gap-4 px-6 py-3.5">
// //                 <div className="h-6 w-6 rounded-full bg-slate-100" />
// //                 <div className="flex-1 space-y-1.5">
// //                   <div className="h-3.5 w-44 rounded bg-slate-100" />
// //                   <div className="h-1.5 w-full rounded bg-slate-50" />
// //                 </div>
// //                 <div className="space-y-1 text-right">
// //                   <div className="ml-auto h-4 w-12 rounded bg-slate-100" />
// //                   <div className="ml-auto h-3 w-20 rounded bg-slate-50" />
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         ) : topProducts.length === 0 ? (
// //           <div className="flex flex-col items-center gap-3 py-12 text-slate-400">
// //             <Package className="h-10 w-10" strokeWidth={1} />
// //             <p className="text-sm">No sales data available</p>
// //           </div>
// //         ) : (
// //           <div className="overflow-x-auto">
// //             <table className="w-full text-sm">
// //               <thead>
// //                 <tr className="border-b border-slate-100 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
// //                   <th className="px-6 py-3">#</th>
// //                   <th className="px-6 py-3">Product</th>
// //                   <th className="px-6 py-3 text-right">Units Sold</th>
// //                   <th className="px-6 py-3 text-right">Revenue</th>
// //                   <th className="px-6 py-3 text-right">% of Total</th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-slate-50">
// //                 {topProducts.map((p, i) => {
// //                   const maxSold = topProducts[0]?.sold || 1
// //                   const pct = Math.round((p.sold / maxSold) * 100)
// //                   const revenueShare = totalRevenue ? ((p.revenue || 0) / totalRevenue * 100).toFixed(1) : 0
// //                   return (
// //                     <tr key={i} className="transition hover:bg-slate-50/60">
// //                       <td className="px-6 py-3.5">
// //                         <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black ${RANK_STYLES[i] ?? RANK_STYLES[4]}`}>
// //                           {i + 1}
// //                         </span>
// //                       </td>
// //                       <td className="px-6 py-3.5">
// //                         <div className="flex items-center gap-3">
// //                           <div className="flex-1">
// //                             <p className="font-medium text-slate-800">{p.name}</p>
// //                             <div className="mt-1 h-1 w-48 max-w-full rounded-full bg-slate-100">
// //                               <div className="h-full rounded-full bg-pink-400" style={{ width: `${pct}%` }} />
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </td>
// //                       <td className="px-6 py-3.5 text-right font-semibold text-slate-700">
// //                         {p.sold.toLocaleString('en-IN')}
// //                       </td>
// //                       <td className="px-6 py-3.5 text-right font-semibold text-pink-600">
// //                         ₹{Number(p.revenue ?? 0).toLocaleString('en-IN')}
// //                       </td>
// //                       <td className="px-6 py-3.5 text-right text-slate-500">
// //                         {revenueShare}%
// //                       </td>
// //                     </tr>
// //                   )
// //                 })}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// // // ─── KPI Card Component ──────────────────────────────────────────────────────
// // function KpiCard({ loading, icon: Icon, value, label, trend, sub }) {
// //   return (
// //     <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
// //       <div className="flex items-center justify-between">
// //         <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-pink-600">
// //           <Icon className="h-4 w-4" />
// //         </div>
// //         {trend && (
// //           <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
// //             {trend}
// //           </span>
// //         )}
// //       </div>
// //       <div className="mt-3">
// //         {loading ? (
// //           <div className="h-6 w-24 animate-pulse rounded bg-slate-100" />
// //         ) : (
// //           <p className="text-xl font-bold text-slate-800">{value}</p>
// //         )}
// //         <p className="text-xs font-medium text-slate-500">{label}</p>
// //         {sub && <p className="mt-0.5 text-[10px] text-slate-400">{sub}</p>}
// //       </div>
// //     </div>
// //   )
// // }

// // // ─── Helpers ──────────────────────────────────────────────────────────────────
// // function Skel({ h }) {
// //   return <div className="animate-pulse rounded-lg bg-slate-50" style={{ height: h }} />
// // }
// // function Empty({ h }) {
// //   return <div className="flex items-center justify-center text-sm text-slate-400" style={{ height: h }}>No data yet</div>
// // }
// // function fmtNum(n) {
// //   if (n >= 10_00_000) return `${(n / 10_00_000).toFixed(1)}L`
// //   if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
// //   return String(n)
// // }


// // app/dashboard/reports/page.tsx
// 'use client'

// import { useState } from 'react'
// import {
//   ShoppingCart, IndianRupee, AlertCircle, RefreshCw,
//   Package, BarChart3, TrendingUp, Download, Calendar,
// } from 'lucide-react'
// import {
//   ResponsiveContainer,
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
//   PieChart, Pie, Cell as PieCell,
// } from 'recharts'
// import { useReports } from '@/hooks/useReports'

// // ─── Colour palette ──────────────────────────────────────────────────────────
// const PINK_500 = '#ec4899'
// const PINK_100 = '#fce7f3'
// const PINK_GRADIENT = ['#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777']

// // ─── Ranking styles ──────────────────────────────────────────────────────────
// const RANK_STYLES = [
//   'bg-amber-400 text-white',
//   'bg-slate-400 text-white',
//   'bg-orange-400 text-white',
//   'bg-slate-200 text-slate-600',
//   'bg-slate-200 text-slate-600',
// ]

// export default function ReportsPage() {
//   const { reports, overview, isFetching, error, refetch } = useReports()

//   const topProducts        = reports?.topProducts        ?? []
//   const avgOrderValue      = reports?.avgOrderValue      ?? '—'
//   const totalOrders        = reports?.totalOrders        ?? 0
//   const productsByCategory = overview?.productsByCategory ?? []
//   const salesByMonth       = overview?.salesByMonth      ?? []

//   const totalRevenue       = salesByMonth.reduce((s, m) => s + (m.sales ?? 0), 0)
//   const totalCatProducts   = productsByCategory.reduce((s, c) => s + (c.value ?? 0), 0) || 1

//   const [dateRange, setDateRange] = useState('Last 6 Months')

//   // ─── Export to CSV ────────────────────────────────────────────────────────
//   const handleExport = () => {
//     if (topProducts.length === 0) {
//       alert('No product data available to export.')
//       return
//     }

//     // Headers
//     const headers = ['Rank', 'Product', 'Units Sold', 'Revenue', '% of Total']

//     // Rows
//     const rows = topProducts.map((p, i) => {
//       const revenueShare = totalRevenue ? ((p.revenue || 0) / totalRevenue * 100).toFixed(1) : 0
//       return [
//         i + 1,
//         p.name,
//         p.sold,
//         `₹${Number(p.revenue || 0).toLocaleString('en-IN')}`,
//         `${revenueShare}%`,
//       ]
//     })

//     // Build CSV string
//     const csvContent = [
//       headers.join(','),
//       ...rows.map(row => row.join(',')),
//     ].join('\n')

//     // Download
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
//     const link = document.createElement('a')
//     link.href = URL.createObjectURL(blob)
//     link.download = 'top_products_export.csv'
//     link.click()
//     URL.revokeObjectURL(link.href)
//   }

//   return (
//     <div className="space-y-6">

//       {/* ─── Header with title, date picker & export ───────────────────────── */}
//       <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
//         <div className="flex items-center gap-3">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-600 shadow-sm">
//             <BarChart3 className="h-5 w-5 text-white" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold tracking-tight text-slate-800">Reports</h1>
//             <p className="text-xs text-slate-400">Sales analytics & product performance</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//           {/* Date range selector – placeholder */}
//           <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
//             <Calendar className="h-4 w-4 text-slate-400" />
//             <span>{dateRange}</span>
//           </div>
//           {/* Export button – now functional */}
//           <button
//             onClick={handleExport}
//             disabled={isFetching || topProducts.length === 0}
//             className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
//           >
//             <Download className="h-4 w-4" />
//             Export
//           </button>
//           {/* Refresh */}
//           <button
//             onClick={refetch}
//             disabled={isFetching}
//             className="flex items-center gap-2 rounded-lg bg-pink-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-pink-700 disabled:opacity-50"
//           >
//             <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
//           <AlertCircle className="h-4 w-4 shrink-0" /> {error}
//         </div>
//       )}

//       {/* ─── KPI Cards ──────────────────────────────────────────────────────── */}
//       <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
//         <KpiCard
//           loading={isFetching}
//           icon={IndianRupee}
//           value={totalRevenue ? `₹${totalRevenue.toLocaleString('en-IN')}` : '—'}
//           label="Total Revenue"
//           trend="+12.5%"
//         />
//         <KpiCard
//           loading={isFetching}
//           icon={ShoppingCart}
//           value={totalOrders.toLocaleString('en-IN')}
//           label="Total Orders"
//           trend="+8.2%"
//         />
//         <KpiCard
//           loading={isFetching}
//           icon={TrendingUp}
//           value={avgOrderValue}   // already formatted by backend
//           label="Average Order Value"
//           trend="+3.1%"
//         />
//         <KpiCard
//           loading={isFetching}
//           icon={Package}
//           value={topProducts.length ? topProducts[0].name : '—'}
//           label="Top Product"
//           sub={topProducts.length ? `${topProducts[0].sold} units sold` : 'No data'}
//         />
//       </div>

//       {/* ─── Charts Row ──────────────────────────────────────────────────────── */}
//       <div className="grid gap-5 lg:grid-cols-3">

//         {/* Revenue Bar Chart (2/3 width) */}
//         <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <div>
//               <h3 className="font-semibold text-slate-800">Revenue by Month</h3>
//               <p className="text-xs text-slate-400">Monthly sales performance</p>
//             </div>
//             <span className="text-xs font-medium text-pink-600">
//               Total: ₹{totalRevenue.toLocaleString('en-IN')}
//             </span>
//           </div>

//           {isFetching ? <Skel h={200} /> : salesByMonth.length === 0 ? <Empty h={200} /> : (
//             <ResponsiveContainer width="100%" height={200}>
//               <BarChart data={salesByMonth} barSize={32} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
//                 <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
//                 <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={44} tickFormatter={fmtNum} />
//                 <Tooltip
//                   cursor={{ fill: '#f8fafc' }}
//                   contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
//                   formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
//                 />
//                 <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
//                   {salesByMonth.map((_, i) => (
//                     <Cell key={i} fill={i === salesByMonth.length - 1 ? PINK_500 : PINK_100} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           )}
//           <p className="mt-2 text-[10px] text-slate-400">Latest month highlighted in pink</p>
//         </div>

//         {/* Category Distribution (Pie) – 1/3 width */}
//         <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
//           <h3 className="mb-0.5 font-semibold text-slate-800">Category Distribution</h3>
//           <p className="mb-3 text-xs text-slate-400">Products per category</p>

//           {isFetching ? <Skel h={180} /> : productsByCategory.length === 0 ? <Empty h={180} /> : (
//             <ResponsiveContainer width="100%" height={180}>
//               <PieChart>
//                 <Pie
//                   data={productsByCategory}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={45}
//                   outerRadius={70}
//                   paddingAngle={2}
//                 >
//                   {productsByCategory.map((_, i) => (
//                     <PieCell key={i} fill={PINK_GRADIENT[i % PINK_GRADIENT.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   contentStyle={{
//                     borderRadius: 8,
//                     border: '1px solid #e2e8f0',
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
//                     fontSize: 12,
//                   }}
//                   formatter={(v, name) => [`${v} products`, name]}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           )}
//           <div className="mt-3 flex flex-wrap justify-center gap-2">
//             {productsByCategory.slice(0, 4).map((c, i) => (
//               <span key={c.name} className="flex items-center gap-1 text-xs text-slate-500">
//                 <span className="inline-block h-2 w-2 rounded-full" style={{ background: PINK_GRADIENT[i % PINK_GRADIENT.length] }} />
//                 {c.name} ({c.value})
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ─── Top Products Table (full width) ──────────────────────────────── */}
//       <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
//         <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
//           <div>
//             <h3 className="font-semibold text-slate-800">Top Performing Products</h3>
//             <p className="text-xs text-slate-400">Ranked by units sold</p>
//           </div>
//           <span className="text-xs text-slate-500">{topProducts.length} products</span>
//         </div>

//         {isFetching ? (
//           <div className="divide-y divide-slate-50">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <div key={i} className="flex animate-pulse items-center gap-4 px-6 py-3.5">
//                 <div className="h-6 w-6 rounded-full bg-slate-100" />
//                 <div className="flex-1 space-y-1.5">
//                   <div className="h-3.5 w-44 rounded bg-slate-100" />
//                   <div className="h-1.5 w-full rounded bg-slate-50" />
//                 </div>
//                 <div className="space-y-1 text-right">
//                   <div className="ml-auto h-4 w-12 rounded bg-slate-100" />
//                   <div className="ml-auto h-3 w-20 rounded bg-slate-50" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : topProducts.length === 0 ? (
//           <div className="flex flex-col items-center gap-3 py-12 text-slate-400">
//             <Package className="h-10 w-10" strokeWidth={1} />
//             <p className="text-sm">No sales data available</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-slate-100 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
//                   <th className="px-6 py-3">#</th>
//                   <th className="px-6 py-3">Product</th>
//                   <th className="px-6 py-3 text-right">Units Sold</th>
//                   <th className="px-6 py-3 text-right">Revenue</th>
//                   <th className="px-6 py-3 text-right">% of Total</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {topProducts.map((p, i) => {
//                   const maxSold = topProducts[0]?.sold || 1
//                   const pct = Math.round((p.sold / maxSold) * 100)
//                   const revenueShare = totalRevenue ? ((p.revenue || 0) / totalRevenue * 100).toFixed(1) : 0
//                   return (
//                     <tr key={i} className="transition hover:bg-slate-50/60">
//                       <td className="px-6 py-3.5">
//                         <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black ${RANK_STYLES[i] ?? RANK_STYLES[4]}`}>
//                           {i + 1}
//                         </span>
//                       </td>
//                       <td className="px-6 py-3.5">
//                         <div className="flex items-center gap-3">
//                           <div className="flex-1">
//                             <p className="font-medium text-slate-800">{p.name}</p>
//                             <div className="mt-1 h-1 w-48 max-w-full rounded-full bg-slate-100">
//                               <div className="h-full rounded-full bg-pink-400" style={{ width: `${pct}%` }} />
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-3.5 text-right font-semibold text-slate-700">
//                         {p.sold.toLocaleString('en-IN')}
//                       </td>
//                       <td className="px-6 py-3.5 text-right font-semibold text-pink-600">
//                         ₹{Number(p.revenue ?? 0).toLocaleString('en-IN')}
//                       </td>
//                       <td className="px-6 py-3.5 text-right text-slate-500">
//                         {revenueShare}%
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// // ─── KPI Card Component ──────────────────────────────────────────────────────
// function KpiCard({ loading, icon: Icon, value, label, trend, sub }) {
//   return (
//     <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
//       <div className="flex items-center justify-between">
//         <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-pink-600">
//           <Icon className="h-4 w-4" />
//         </div>
//         {trend && (
//           <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
//             {trend}
//           </span>
//         )}
//       </div>
//       <div className="mt-3">
//         {loading ? (
//           <div className="h-6 w-24 animate-pulse rounded bg-slate-100" />
//         ) : (
//           <p className="text-xl font-bold text-slate-800">{value}</p>
//         )}
//         <p className="text-xs font-medium text-slate-500">{label}</p>
//         {sub && <p className="mt-0.5 text-[10px] text-slate-400">{sub}</p>}
//       </div>
//     </div>
//   )
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function Skel({ h }) {
//   return <div className="animate-pulse rounded-lg bg-slate-50" style={{ height: h }} />
// }
// function Empty({ h }) {
//   return <div className="flex items-center justify-center text-sm text-slate-400" style={{ height: h }}>No data yet</div>
// }
// function fmtNum(n) {
//   if (n >= 10_00_000) return `${(n / 10_00_000).toFixed(1)}L`
//   if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
//   return String(n)
// }


// app/dashboard/reports/page.tsx
'use client'

import { useState } from 'react'
import {
  ShoppingCart, IndianRupee, AlertCircle, RefreshCw,
  Package, BarChart3, TrendingUp, Download, Calendar,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  PieChart, Pie, Cell as PieCell,
} from 'recharts'
import { useReports } from '@/hooks/useReports'

// ─── Colour palette ──────────────────────────────────────────────────────────
const PINK_500 = '#ec4899'
const PINK_100 = '#fce7f3'
const PINK_GRADIENT = ['#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777']

// ─── Ranking styles ──────────────────────────────────────────────────────────
const RANK_STYLES = [
  'bg-amber-400 text-white',
  'bg-slate-400 text-white',
  'bg-orange-400 text-white',
  'bg-slate-200 text-slate-600',
  'bg-slate-200 text-slate-600',
]

export default function ReportsPage() {
  const { reports, overview, isFetching, error, refetch } = useReports()

  const topProducts        = reports?.topProducts        ?? []
  const avgOrderValue      = reports?.avgOrderValue      ?? '—'
  const totalOrders        = reports?.totalOrders        ?? 0
  const productsByCategory = overview?.productsByCategory ?? []
  const salesByMonth       = overview?.salesByMonth      ?? []

  const totalRevenue       = salesByMonth.reduce((s, m) => s + (m.sales ?? 0), 0)
  const totalCatProducts   = productsByCategory.reduce((s, c) => s + (c.value ?? 0), 0) || 1

  const [dateRange, setDateRange] = useState('Last 6 Months')

  // ─── Export to CSV ────────────────────────────────────────────────────────
  const handleExport = () => {
    if (topProducts.length === 0) {
      alert('No product data available to export.')
      return
    }

    // Build rows with raw numbers (no formatting)
    const rows = topProducts.map((p, i) => {
      const revenueShare = totalRevenue ? ((p.revenue || 0) / totalRevenue * 100).toFixed(1) : 0
      return [
        i + 1,                       // Rank (number)
        `"${p.name}"`,               // Product name (quoted for safety)
        p.sold,                      // Units sold (raw number)
        Number(p.revenue || 0).toFixed(2), // Revenue (raw, 2 decimals)
        revenueShare,                // % of total (number)
      ]
    })

    const headers = ['Rank', 'Product', 'Units Sold', 'Revenue', '% of Total']
    const csvLines = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ]

    // Add UTF-8 BOM for Excel
    const BOM = '\uFEFF'
    const csvContent = BOM + csvLines.join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `top_products_${new Date().toISOString().slice(0,10)}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="space-y-6">

      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-600 shadow-sm">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">Reports</h1>
            <p className="text-xs text-slate-400">Sales analytics & product performance</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Date range selector – placeholder */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>{dateRange}</span>
          </div>
          {/* Export button */}
          <button
            onClick={handleExport}
            disabled={isFetching || topProducts.length === 0}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          {/* Refresh */}
          <button
            onClick={refetch}
            disabled={isFetching}
            className="flex items-center gap-2 rounded-lg bg-pink-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-pink-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* ─── KPI Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard
          loading={isFetching}
          icon={IndianRupee}
          value={totalRevenue ? `₹${totalRevenue.toLocaleString('en-IN')}` : '—'}
          label="Total Revenue"
          trend="+12.5%"
        />
        <KpiCard
          loading={isFetching}
          icon={ShoppingCart}
          value={totalOrders.toLocaleString('en-IN')}
          label="Total Orders"
          trend="+8.2%"
        />
        <KpiCard
          loading={isFetching}
          icon={TrendingUp}
          value={avgOrderValue}   // already formatted by backend
          label="Average Order Value"
          trend="+3.1%"
        />
        <KpiCard
          loading={isFetching}
          icon={Package}
          value={topProducts.length ? topProducts[0].name : '—'}
          label="Top Product"
          sub={topProducts.length ? `${topProducts[0].sold} units sold` : 'No data'}
        />
      </div>

      {/* ─── Charts Row ──────────────────────────────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-3">

        {/* Revenue Bar Chart (2/3 width) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-800">Revenue by Month</h3>
              <p className="text-xs text-slate-400">Monthly sales performance</p>
            </div>
            <span className="text-xs font-medium text-pink-600">
              Total: ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
          </div>

          {isFetching ? <Skel h={200} /> : salesByMonth.length === 0 ? <Empty h={200} /> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={salesByMonth} barSize={32} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={44} tickFormatter={fmtNum} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                  {salesByMonth.map((_, i) => (
                    <Cell key={i} fill={i === salesByMonth.length - 1 ? PINK_500 : PINK_100} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
          <p className="mt-2 text-[10px] text-slate-400">Latest month highlighted in pink</p>
        </div>

        {/* Category Distribution (Pie) – 1/3 width */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-0.5 font-semibold text-slate-800">Category Distribution</h3>
          <p className="mb-3 text-xs text-slate-400">Products per category</p>

          {isFetching ? <Skel h={180} /> : productsByCategory.length === 0 ? <Empty h={180} /> : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={productsByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {productsByCategory.map((_, i) => (
                    <PieCell key={i} fill={PINK_GRADIENT[i % PINK_GRADIENT.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    fontSize: 12,
                  }}
                  formatter={(v, name) => [`${v} products`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {productsByCategory.slice(0, 4).map((c, i) => (
              <span key={c.name} className="flex items-center gap-1 text-xs text-slate-500">
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: PINK_GRADIENT[i % PINK_GRADIENT.length] }} />
                {c.name} ({c.value})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Top Products Table (full width) ──────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="font-semibold text-slate-800">Top Performing Products</h3>
            <p className="text-xs text-slate-400">Ranked by units sold</p>
          </div>
          <span className="text-xs text-slate-500">{topProducts.length} products</span>
        </div>

        {isFetching ? (
          <div className="divide-y divide-slate-50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex animate-pulse items-center gap-4 px-6 py-3.5">
                <div className="h-6 w-6 rounded-full bg-slate-100" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-44 rounded bg-slate-100" />
                  <div className="h-1.5 w-full rounded bg-slate-50" />
                </div>
                <div className="space-y-1 text-right">
                  <div className="ml-auto h-4 w-12 rounded bg-slate-100" />
                  <div className="ml-auto h-3 w-20 rounded bg-slate-50" />
                </div>
              </div>
            ))}
          </div>
        ) : topProducts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-slate-400">
            <Package className="h-10 w-10" strokeWidth={1} />
            <p className="text-sm">No sales data available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3 text-right">Units Sold</th>
                  <th className="px-6 py-3 text-right">Revenue</th>
                  <th className="px-6 py-3 text-right">% of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {topProducts.map((p, i) => {
                  const maxSold = topProducts[0]?.sold || 1
                  const pct = Math.round((p.sold / maxSold) * 100)
                  const revenueShare = totalRevenue ? ((p.revenue || 0) / totalRevenue * 100).toFixed(1) : 0
                  return (
                    <tr key={i} className="transition hover:bg-slate-50/60">
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black ${RANK_STYLES[i] ?? RANK_STYLES[4]}`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <p className="font-medium text-slate-800">{p.name}</p>
                            <div className="mt-1 h-1 w-48 max-w-full rounded-full bg-slate-100">
                              <div className="h-full rounded-full bg-pink-400" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-right font-semibold text-slate-700">
                        {p.sold.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-3.5 text-right font-semibold text-pink-600">
                        ₹{Number(p.revenue ?? 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-3.5 text-right text-slate-500">
                        {revenueShare}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── KPI Card Component ──────────────────────────────────────────────────────
function KpiCard({ loading, icon: Icon, value, label, trend, sub }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-pink-600">
          <Icon className="h-4 w-4" />
        </div>
        {trend && (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            {trend}
          </span>
        )}
      </div>
      <div className="mt-3">
        {loading ? (
          <div className="h-6 w-24 animate-pulse rounded bg-slate-100" />
        ) : (
          <p className="text-xl font-bold text-slate-800">{value}</p>
        )}
        <p className="text-xs font-medium text-slate-500">{label}</p>
        {sub && <p className="mt-0.5 text-[10px] text-slate-400">{sub}</p>}
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Skel({ h }) {
  return <div className="animate-pulse rounded-lg bg-slate-50" style={{ height: h }} />
}
function Empty({ h }) {
  return <div className="flex items-center justify-center text-sm text-slate-400" style={{ height: h }}>No data yet</div>
}
function fmtNum(n) {
  if (n >= 10_00_000) return `${(n / 10_00_000).toFixed(1)}L`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}