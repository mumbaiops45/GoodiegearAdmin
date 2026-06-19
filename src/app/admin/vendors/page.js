'use client'

import {
  Search, CheckCircle2, AlertCircle, Loader2,
  Store, X, RefreshCw, ShieldCheck, Clock, Mail, User,
} from 'lucide-react'
import { PageHeader } from '@/components/ui'
import { useVendors } from '@/hooks/useVendors'

export default function VendorsPage() {
  const v = useVendors()

  const stats = {
    total:    v.allVendors.length,
    approved: v.allVendors.filter((x) => x.isApproved === true).length,
    pending:  v.allVendors.filter((x) => x.isApproved === false).length,
  }

  return (
    <div>
      <PageHeader title="Vendors" subtitle={`${stats.total} registered vendors`} />

      {/* Success */}
      {v.successMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> {v.successMsg}
        </div>
      )}

      {/* Error */}
      {v.fetchError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {v.fetchError}
        </div>
      )}

      {/* ── Stats ────────────────────────────────────────────── */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        <StatCard label="Total"    value={stats.total}    color="blue"  />
        <StatCard label="Approved" value={stats.approved} color="green" />
        <StatCard label="Pending"  value={stats.pending}  color="amber" />
      </div>

      {/* ── Filters ──────────────────────────────────────────── */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-56">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            placeholder="Search by shop name or email…"
            value={v.search}
            onChange={(e) => v.setSearch(e.target.value)}
          />
        </div>

        <select
          value={v.filterStatus}
          onChange={(e) => v.setFilterStatus(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>

        <button
          onClick={() => { v.setSearch(''); v.setFilterStatus('') }}
          title="Clear filters"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
                <th className="px-4 py-3">Shop</th>
                <th className="hidden px-4 py-3 sm:table-cell">Owner</th>
                <th className="hidden px-4 py-3 lg:table-cell">Joined</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {v.isFetching ? (
                <TableSkeleton />
              ) : v.vendors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Store className="h-10 w-10 opacity-30" />
                      <p className="text-sm">No vendors found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                v.vendors.map((vendor) => (
                  <VendorRow
                    key={vendor._id}
                    vendor={vendor}
                    isApproving={v.approvingId === vendor._id}
                    onApprove={() => v.handleApprove(vendor._id)}
                    onView={() => v.setDetailVendor(vendor)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Detail modal ─────────────────────────────────────── */}
      {v.detailVendor && (
        <VendorDetailModal
          vendor={v.detailVendor}
          isApproving={v.approvingId === v.detailVendor._id}
          onApprove={() => v.handleApprove(v.detailVendor._id)}
          onClose={() => v.setDetailVendor(null)}
        />
      )}
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────

const STAT_COLORS = {
  blue:  'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  green: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
}

function StatCard({ label, value, color }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <span className={`rounded-full px-3 py-1 text-sm font-bold ${STAT_COLORS[color]}`}>{value}</span>
    </div>
  )
}

// ── Vendor table row ──────────────────────────────────────────────────────────

function VendorRow({ vendor, isApproving, onApprove, onView }) {
  const shopName = vendor.shopName ?? '—'
  const ownerName  = vendor.user?.name  ?? '—'
  const ownerEmail = vendor.user?.email ?? '—'
  const joined = vendor.createdAt
    ? new Date(vendor.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

  return (
    <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
      {/* Shop */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {vendor.shopLogo ? (
            <img src={vendor.shopLogo} alt={shopName} className="h-9 w-9 shrink-0 rounded-xl object-cover" />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-sm font-bold text-pink-600 dark:bg-pink-900/30 dark:text-pink-300">
              {shopName[0]?.toUpperCase() ?? 'S'}
            </div>
          )}
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">{shopName}</p>
            {vendor.shopDescription && (
              <p className="line-clamp-1 max-w-48 text-xs text-slate-400">{vendor.shopDescription}</p>
            )}
          </div>
        </div>
      </td>

      {/* Owner */}
      <td className="hidden px-4 py-3 sm:table-cell">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{ownerName}</p>
        <p className="text-xs text-slate-400">{ownerEmail}</p>
      </td>

      {/* Joined */}
      <td className="hidden px-4 py-3 text-sm text-slate-500 lg:table-cell">{joined}</td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusBadge approved={vendor.isApproved} />
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onView}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
          >
            View
          </button>
          {!vendor.isApproved && (
            <button
              onClick={onApprove}
              disabled={isApproving}
              className="flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-600 disabled:opacity-60"
            >
              {isApproving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
              Approve
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ approved }) {
  return approved ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
      <ShieldCheck className="h-3 w-3" /> Approved
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
      <Clock className="h-3 w-3" /> Pending
    </span>
  )
}

// ── Vendor detail modal ───────────────────────────────────────────────────────

function VendorDetailModal({ vendor, isApproving, onApprove, onClose }) {
  const shopName   = vendor.shopName ?? '—'
  const ownerName  = vendor.user?.name  ?? null
  const ownerEmail = vendor.user?.email ?? null
  const joined     = vendor.createdAt
    ? new Date(vendor.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Vendor Details</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">
          {/* Logo + shop name */}
          <div className="flex items-center gap-4">
            {vendor.shopLogo ? (
              <img src={vendor.shopLogo} alt={shopName} className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-2xl font-black text-pink-600 dark:bg-pink-900/30 dark:text-pink-300">
                {shopName[0]?.toUpperCase() ?? 'S'}
              </div>
            )}
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{shopName}</p>
              <StatusBadge approved={vendor.isApproved} />
            </div>
          </div>

          {/* Info rows */}
          <div className="space-y-2.5 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            {ownerName  && <DetailRow icon={<User className="h-4 w-4" />} label="Owner" value={ownerName} />}
            {ownerEmail && <DetailRow icon={<Mail className="h-4 w-4" />} label="Email" value={ownerEmail} />}
            {joined     && <DetailRow icon={<Clock className="h-4 w-4" />} label="Joined" value={joined} />}
          </div>

          {/* Description */}
          {vendor.shopDescription && (
            <p className="text-sm text-slate-500 dark:text-slate-400">{vendor.shopDescription}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700">
            Close
          </button>
          {!vendor.isApproved && (
            <button
              onClick={onApprove}
              disabled={isApproving}
              className="flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-600 disabled:opacity-60"
            >
              {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Approve Vendor
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <span className="mt-0.5 shrink-0 text-slate-400">{icon}</span>
      <span className="w-14 shrink-0 font-medium text-slate-500">{label}</span>
      <span className="break-all text-slate-700 dark:text-slate-300">{value}</span>
    </div>
  )
}

function TableSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="animate-pulse border-b border-slate-100 dark:border-slate-800">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </td>
      {[...Array(3)].map((_, j) => (
        <td key={j} className="px-4 py-3"><div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" /></td>
      ))}
      <td className="px-4 py-3"><div className="ml-auto h-8 w-20 rounded-lg bg-slate-200 dark:bg-slate-700" /></td>
    </tr>
  ))
}
