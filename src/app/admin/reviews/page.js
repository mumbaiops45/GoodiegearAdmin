'use client'

import {
  Star, Search, CheckCircle2, XCircle, AlertCircle,
  MessageSquare, RefreshCw, Loader2, X, Eye,
} from 'lucide-react'
import useAuthStore from '@/store/authStore'
import { PageHeader, ConfirmDialog } from '@/components/ui'
import { useReviews } from '@/hooks/useReviews'
import { useState } from 'react'

export default function ReviewsPage() {
  const r = useReviews()
  const [confirmTarget, setConfirmTarget] = useState(null) // { review, action: 'approve'|'reject' }

  const openConfirm = (review, action) => setConfirmTarget({ review, action })
  const closeConfirm = () => setConfirmTarget(null)

  const onConfirm = async () => {
    if (!confirmTarget) return
    const { review, action } = confirmTarget
    closeConfirm()
    if (action === 'approve') await r.handleApprove(review._id)
    else await r.handleReject(review._id)
  }

  return (
    <div>
      <PageHeader
        title="Reviews"
        subtitle={`${r.allReviews.length} total reviews`}
        action={
          <button
            onClick={r.refresh}
            title="Refresh"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        }
      />

      {r.successMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> {r.successMsg}
        </div>
      )}

      {r.fetchError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {r.fetchError}
        </div>
      )}

      {/* ── Filters ──────────────────────────────────────────── */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-56">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            placeholder="Search by product, customer, or comment…"
            value={r.search}
            onChange={(e) => r.setSearch(e.target.value)}
          />
        </div>

        <select
          value={r.filterStatus}
          onChange={(e) => r.setFilterStatus(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Published">Published</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
                <th className="px-4 py-3">Product</th>
                <th className="hidden px-4 py-3 sm:table-cell">Customer</th>
                <th className="px-4 py-3">Rating</th>
                <th className="hidden px-4 py-3 lg:table-cell">Comment</th>
                <th className="hidden px-4 py-3 md:table-cell">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {r.isFetching ? (
                <TableSkeleton />
              ) : r.reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <MessageSquare className="h-10 w-10 opacity-30" />
                      <p className="text-sm">No reviews found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                r.reviews.map((review) => (
                  <ReviewRow
                    key={review._id}
                    review={review}
                    isBusy={r.actionId === review._id}
                    onView={() => r.setDetailReview(review)}
                    onApprove={() => openConfirm(review, 'approve')}
                    onReject={() => openConfirm(review, 'reject')}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Detail Modal ─────────────────────────────────────── */}
      {r.detailReview && (
        <ReviewDetailModal
          review={r.detailReview}
          isBusy={r.actionId === r.detailReview._id}
          onApprove={() => { r.setDetailReview(null); openConfirm(r.detailReview, 'approve') }}
          onReject={() => { r.setDetailReview(null); openConfirm(r.detailReview, 'reject') }}
          onClose={() => r.setDetailReview(null)}
        />
      )}

      {/* ── Confirm Dialog ───────────────────────────────────── */}
      <ConfirmDialog
        open={!!confirmTarget}
        onClose={closeConfirm}
        onConfirm={onConfirm}
        title={confirmTarget?.action === 'approve' ? 'Approve Review' : 'Reject Review'}
        message={
          confirmTarget?.action === 'approve'
            ? `Approve this review by ${confirmTarget?.review?.user?.name ?? 'customer'} and publish it?`
            : `Reject this review by ${confirmTarget?.review?.user?.name ?? 'customer'}?`
        }
        confirmLabel={confirmTarget?.action === 'approve' ? 'Approve' : 'Reject'}
      />
    </div>
  )
}

// ── Review table row ──────────────────────────────────────────────────────────

function ReviewRow({ review, isBusy, onView, onApprove, onReject }) {
  const productName  = review.product?.title ?? review.productTitle ?? '—'
  const customerName = review.user?.name ?? review.userName ?? review.user?.email ?? '—'
  const rating       = Number(review.rating ?? 0)
  const comment      = review.comment ?? review.text ?? ''
  const status       = review.status ?? 'Pending'

  return (
    <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100 max-w-40 truncate">
        {productName}
      </td>

      <td className="hidden px-4 py-3 text-slate-600 dark:text-slate-300 max-w-36 truncate sm:table-cell">
        {customerName}
      </td>

      <td className="px-4 py-3">
        <StarRating value={rating} />
      </td>

      <td className="hidden px-4 py-3 text-slate-500 dark:text-slate-400 max-w-64 lg:table-cell">
        <p className="truncate text-sm">{comment || <span className="italic opacity-50">No comment</span>}</p>
      </td>

      <td className="hidden px-4 py-3 md:table-cell">
        <StatusBadge status={status} />
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <ActionBtn onClick={onView} title="View details" className="text-slate-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30">
            <Eye className="h-4 w-4" />
          </ActionBtn>

          {status !== 'Published' && (
            <ActionBtn
              onClick={onApprove}
              title="Approve"
              disabled={isBusy}
              className="text-slate-500 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/30"
            >
              {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            </ActionBtn>
          )}

          {status !== 'Rejected' && (
            <ActionBtn
              onClick={onReject}
              title="Reject"
              disabled={isBusy}
              className="text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
            >
              <XCircle className="h-4 w-4" />
            </ActionBtn>
          )}
        </div>
      </td>
    </tr>
  )
}

// ── Detail Modal ──────────────────────────────────────────────────────────────

function ReviewDetailModal({ review, isBusy, onApprove, onReject, onClose }) {
  const productName  = review.product?.title ?? review.productTitle ?? '—'
  const customerName = review.user?.name ?? review.userName ?? '—'
  const customerEmail = review.user?.email ?? '—'
  const rating       = Number(review.rating ?? 0)
  const comment      = review.comment ?? review.text ?? ''
  const status       = review.status ?? 'Pending'
  const createdAt    = review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Review Details</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Product</p>
              <p className="mt-0.5 font-medium text-slate-800 dark:text-slate-100">{productName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Status</p>
              <div className="mt-0.5"><StatusBadge status={status} /></div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Customer</p>
              <p className="mt-0.5 font-medium text-slate-800 dark:text-slate-100">{customerName}</p>
              <p className="text-xs text-slate-400">{customerEmail}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Date</p>
              <p className="mt-0.5 font-medium text-slate-800 dark:text-slate-100">{createdAt}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Rating</p>
            <div className="mt-1"><StarRating value={rating} large /></div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">Comment</p>
            <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 whitespace-pre-wrap min-h-[72px]">
              {comment || <span className="italic text-slate-400">No comment</span>}
            </p>
          </div>
        </div>

        {(status !== 'Published' || status !== 'Rejected') && (
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
            <button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300">
              Close
            </button>
            {status !== 'Rejected' && (
              <button
                onClick={onReject}
                disabled={isBusy}
                className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50 transition"
              >
                <XCircle className="h-4 w-4" /> Reject
              </button>
            )}
            {status !== 'Published' && (
              <button
                onClick={onApprove}
                disabled={isBusy}
                className="flex items-center gap-2 rounded-xl bg-linear-to-r from-pink-500 to-rose-500 px-4 py-2.5 text-sm font-bold text-white hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 transition"
              >
                {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Approve
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Shared primitives ─────────────────────────────────────────────────────────

function StarRating({ value, large }) {
  const size = large ? 'h-5 w-5' : 'h-3.5 w-3.5'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${size} ${n <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`}
        />
      ))}
      {large && <span className="ml-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">{value}/5</span>}
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    Pending:   'bg-amber-100 text-amber-700',
    Published: 'bg-green-100 text-green-700',
    Rejected:  'bg-red-100 text-red-600',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[status] ?? 'bg-slate-100 text-slate-500'}`}>
      {status}
    </span>
  )
}

function ActionBtn({ onClick, title, className, children, disabled }) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  )
}

function TableSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="animate-pulse border-b border-slate-100 dark:border-slate-800">
      <td className="px-4 py-3"><div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" /></td>
      <td className="px-4 py-3"><div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" /></td>
      <td className="px-4 py-3"><div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" /></td>
      <td className="px-4 py-3"><div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-700" /></td>
      <td className="px-4 py-3"><div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-700" /></td>
      <td className="px-4 py-3"><div className="flex justify-end gap-2">{[0,1,2].map(j => <div key={j} className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700" />)}</div></td>
    </tr>
  ))
}
