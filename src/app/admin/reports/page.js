'use client'

import { ShoppingCart, IndianRupee, AlertCircle, RefreshCw, Package, BarChart3 } from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts'
import { useReports } from '@/hooks/useReports'

const BAR_COLORS   = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']
const RANK_STYLES  = [
  'bg-amber-400  text-white',
  'bg-slate-400  text-white',
  'bg-orange-400 text-white',
  'bg-slate-200  text-slate-600',
  'bg-slate-200  text-slate-600',
]

export default function ReportsPage() {
  const { reports, overview, isFetching, error, refetch } = useReports()

  const topProducts        = reports?.topProducts        ?? []
  const avgOrderValue      = reports?.avgOrderValue      ?? '—'
  const totalOrders        = reports?.totalOrders        ?? 0
  const productsByCategory = overview?.productsByCategory ?? []
  const salesByMonth       = overview?.salesByMonth      ?? []

  const totalCatProducts   = productsByCategory.reduce((s, c) => s + (c.value ?? 0), 0) || 1

  return (
    <div className="space-y-6">

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800">Reports</h1>
            <p className="text-xs text-slate-400">Sales analytics & product performance</p>
          </div>
        </div>
        <button
          onClick={refetch}
          disabled={isFetching}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* ── Flat metric strip ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 divide-x divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <MetricCell
          loading={isFetching}
          icon={IndianRupee}
          value={avgOrderValue}
          label="Average Order Value"
          sub="Per transaction"
        />
        <MetricCell
          loading={isFetching}
          icon={ShoppingCart}
          value={totalOrders.toLocaleString('en-IN')}
          label="Total Orders"
          sub="All time"
        />
      </div>

      {/* ── Revenue bar chart — full width ────────────────────────── */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="font-bold text-slate-800">Revenue by Month</h3>
            <p className="text-xs text-slate-400">Total sales revenue per calendar month</p>
          </div>
          {!isFetching && salesByMonth.length > 0 && (
            <p className="text-xs font-semibold text-indigo-600">
              ₹{salesByMonth.reduce((s, m) => s + (m.sales ?? 0), 0).toLocaleString('en-IN')} total
            </p>
          )}
        </div>

        {isFetching ? <Skel h={220} /> : salesByMonth.length === 0 ? <Empty h={220} /> : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={salesByMonth} barSize={28} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={48} tickFormatter={fmtNum} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: 12 }}
                formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
                {salesByMonth.map((_, i) => (
                  <Cell key={i} fill={i === salesByMonth.length - 1 ? '#6366f1' : '#e0e7ff'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
        <p className="mt-2 text-[10px] text-slate-400">Latest month highlighted in indigo</p>
      </div>

      {/* ── Bottom row: top products table + category bars ────────── */}
      <div className="grid gap-5 lg:grid-cols-3">

        {/* Top products — data table */}
        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="font-bold text-slate-800">Top 5 Products</h3>
            <p className="text-xs text-slate-400">Ranked by units sold</p>
          </div>

          {isFetching ? (
            <div className="divide-y divide-slate-50">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex animate-pulse items-center gap-4 px-6 py-3.5">
                  <div className="h-7 w-7 shrink-0 rounded-full bg-slate-100" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-44 rounded bg-slate-100" />
                    <div className="h-1.5 w-full rounded-full bg-slate-50" />
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="ml-auto h-4 w-12 rounded bg-slate-100" />
                    <div className="ml-auto h-3 w-20 rounded bg-slate-50" />
                  </div>
                </div>
              ))}
            </div>
          ) : topProducts.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
                <Package className="h-5 w-5 text-slate-300" />
              </div>
              <p className="text-sm text-slate-500">No sales data yet</p>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="grid grid-cols-12 border-b border-slate-50 bg-slate-50 px-6 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <span className="col-span-1">#</span>
                <span className="col-span-5">Product</span>
                <span className="col-span-3 text-right">Units Sold</span>
                <span className="col-span-3 text-right">Revenue</span>
              </div>
              <div className="divide-y divide-slate-50">
                {topProducts.map((p, i) => {
                  const maxSold = topProducts[0]?.sold || 1
                  const pct     = Math.round((p.sold / maxSold) * 100)
                  return (
                    <div key={i} className="grid grid-cols-12 items-center gap-2 px-6 py-3.5 transition hover:bg-slate-50/60">
                      <div className="col-span-1">
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black ${RANK_STYLES[i] ?? RANK_STYLES[4]}`}>
                          {i + 1}
                        </span>
                      </div>
                      <div className="col-span-5 min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">{p.name}</p>
                        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-indigo-400" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <div className="col-span-3 text-right">
                        <p className="text-sm font-bold text-slate-800">{p.sold.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-slate-400">units</p>
                      </div>
                      <div className="col-span-3 text-right">
                        <p className="text-sm font-bold text-indigo-600">₹{Number(p.revenue ?? 0).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Category breakdown — horizontal bars */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="mb-0.5 font-bold text-slate-800">By Category</h3>
          <p className="mb-5 text-xs text-slate-400">Products per category</p>

          {isFetching ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-1.5">
                  <div className="h-3 w-24 rounded bg-slate-100" />
                  <div className="h-2 w-full rounded-full bg-slate-50" />
                </div>
              ))}
            </div>
          ) : productsByCategory.length === 0 ? (
            <Empty h={180} />
          ) : (
            <div className="space-y-4">
              {productsByCategory.map((c, i) => {
                const pct = Math.round((c.value / totalCatProducts) * 100)
                return (
                  <div key={c.name}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700 truncate max-w-32">{c.name}</span>
                      <span className="text-xs font-bold text-slate-500">{c.value} <span className="font-normal text-slate-400">({pct}%)</span></span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: BAR_COLORS[i % BAR_COLORS.length] }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Metric cell ───────────────────────────────────────────────────────────────

function MetricCell({ loading, icon: Icon, value, label, sub }) {
  return (
    <div className="p-6">
      <div className="mb-3 flex items-center gap-2 text-slate-400">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      {loading
        ? <div className="h-8 w-32 animate-pulse rounded bg-slate-100" />
        : <p className="text-3xl font-black tracking-tight text-slate-800">{value}</p>
      }
      <p className="mt-1 text-xs text-slate-400">{sub}</p>
    </div>
  )
}

function Skel({ h }) {
  return <div className="animate-pulse rounded-xl bg-slate-50" style={{ height: h }} />
}
function Empty({ h }) {
  return <div className="flex items-center justify-center text-sm text-slate-400" style={{ height: h }}>No data yet</div>
}
function fmtNum(n) {
  if (n >= 10_00_000) return `${(n / 10_00_000).toFixed(1)}L`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}
