'use client'
import { useEffect, useMemo, useState } from 'react'
import { Search, X, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'

// ── Page header ───────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h1>
        {subtitle && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  )
}

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_MAP = {
  Active: 'bg-green-100 text-green-700',
  Approved: 'bg-green-100 text-green-700',
  Delivered: 'bg-green-100 text-green-700',
  Published: 'bg-green-100 text-green-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Pending: 'bg-amber-100 text-amber-700',
  'Low Stock': 'bg-amber-100 text-amber-700',
  Cancelled: 'bg-rose-100 text-rose-700',
  Expired: 'bg-rose-100 text-rose-700',
  'Out of Stock': 'bg-rose-100 text-rose-700',
  Inactive: 'bg-slate-100 text-slate-600',
  VIP: 'bg-violet-100 text-violet-700',
}

export function StatusBadge({ value }) {
  const cls = STATUS_MAP[value] ?? 'bg-slate-100 text-slate-600'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {value}
    </span>
  )
}

// ── Search box ────────────────────────────────────────────────────────────────
export function SearchBox({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

// ── Data table ────────────────────────────────────────────────────────────────
export function DataTable({ columns, rows, empty = 'No records found.', pageSize = 8 }) {
  const { page, setPage, totalPages, pageItems, start, end, total } = usePagination(rows, pageSize)

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              {columns.map((c) => (
                <th key={c.key} className="whitespace-nowrap px-4 py-3">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-400">
                  {empty}
                </td>
              </tr>
            )}
            {pageItems.map((row, i) => (
              <tr key={row.id ?? i} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                {columns.map((c) => (
                  <td key={c.key} className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-300">
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total > 0 && (
        <Pagination page={page} totalPages={totalPages} onChange={setPage} start={start} end={end} total={total} />
      )}
    </div>
  )
}

// ── Pagination hook ───────────────────────────────────────────────────────────
export function usePagination(items, pageSize = 8) {
  const [page, setPage] = useState(1)
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize]
  )

  return {
    page, setPage, totalPages, pageItems,
    start: total === 0 ? 0 : (page - 1) * pageSize + 1,
    end: Math.min(page * pageSize, total),
    total,
  }
}

function pageNumbers(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
  if (page <= 4)                return [1, 2, 3, 4, 5, '…', totalPages]
  if (page >= totalPages - 3)   return [1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  return [1, '…', page - 1, page, page + 1, '…', totalPages]
}

export function Pagination({ page, totalPages, onChange, start, end, total }) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 dark:border-slate-800 sm:flex-row">
      <p className="text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{start}</span>–
        <span className="font-semibold text-slate-700 dark:text-slate-200">{end}</span> of{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-200">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pageNumbers(page, totalPages).map((n, i) =>
          n === '…' ? (
            <span key={`e${i}`} className="px-1.5 text-sm text-slate-400">…</span>
          ) : (
            <button
              key={n}
              onClick={() => onChange(n)}
              className={[
                'h-8 min-w-8 rounded-lg px-2 text-sm font-medium transition-colors',
                n === page
                  ? 'bg-pink-500 text-white'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
              ].join(' ')}
            >
              {n}
            </button>
          )
        )}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 w-full ${widths[size]} max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900`}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Confirm dialog ────────────────────────────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title = 'Are you sure?', message, confirmLabel = 'Delete' }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose() }}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
      </div>
    </Modal>
  )
}

// ── Form field ────────────────────────────────────────────────────────────────
export function Field({ label, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <input
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        {...props}
      />
    </div>
  )
}

export function SelectField({ label, options, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <select
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        {...props}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  )
}
