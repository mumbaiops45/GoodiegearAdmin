'use client'

import {
  Plus, Pencil, Trash2, RefreshCw, CheckCircle2, AlertCircle,
  Loader2, X, ToggleLeft, ToggleRight, Ticket, Search, Tag,
} from 'lucide-react'
import { PageHeader, ConfirmDialog } from '@/components/ui'
import { useCoupons } from '@/hooks/useCoupons'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function CouponsPage() {
  const c = useCoupons()

  return (
    <div>
      <PageHeader
        title="Coupons"
        subtitle={`${c.allCoupons.length} total coupons`}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={c.refresh}
              title="Refresh"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={c.openCreate}
              className="flex items-center gap-2 rounded-xl bg-linear-to-r from-pink-500 to-rose-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-pink-200 hover:from-pink-600 hover:to-rose-600 transition"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Coupon</span>
            </button>
          </div>
        }
      />

      {c.successMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> {c.successMsg}
        </div>
      )}
      {c.fetchError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {c.fetchError}
        </div>
      )}

      {/* ── Filters ──────────────────────────────────────────── */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            placeholder="Search by code or title…"
            value={c.search}
            onChange={(e) => c.setSearch(e.target.value)}
          />
        </div>

        <select
          value={c.filterType}
          onChange={(e) => c.setFilterType(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="">All Types</option>
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>
        </select>

        <select
          value={c.filterActive}
          onChange={(e) => c.setFilterActive(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <button
          onClick={() => { c.setSearch(''); c.setFilterType(''); c.setFilterActive('') }}
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
                <th className="px-4 py-3">Coupon</th>
                <th className="px-4 py-3">Discount</th>
                <th className="hidden px-4 py-3 md:table-cell">Valid Period</th>
                <th className="hidden px-4 py-3 lg:table-cell">Usage</th>
                <th className="hidden px-4 py-3 sm:table-cell">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {c.isFetching ? (
                <TableSkeleton />
              ) : c.coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Ticket className="h-10 w-10 opacity-30" />
                      <p className="text-sm">
                        {c.search || c.filterType || c.filterActive
                          ? 'No coupons match your filters'
                          : 'No coupons yet'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                c.coupons.map((coupon) => (
                  <CouponRow
                    key={coupon._id}
                    coupon={coupon}
                    isToggling={c.togglingId === coupon._id}
                    onEdit={() => c.openEdit(coupon)}
                    onDelete={() => c.setDeleteTarget(coupon)}
                    onToggle={() => c.handleToggle(coupon._id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {!c.isFetching && c.coupons.length > 0 && (
          <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-800">
            <p className="text-xs text-slate-500">
              Showing{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">{c.coupons.length}</span>
              {' '}of{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">{c.allCoupons.length}</span>
              {' '}coupons
            </p>
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ───────────────────────────────── */}
      {c.modalOpen && (
        <CouponModal
          editTarget={c.editTarget}
          formData={c.formData}
          setFormData={c.setFormData}
          isSubmitting={c.isSubmitting}
          formError={c.formError}
          onSubmit={c.submitForm}
          onClose={c.closeModal}
        />
      )}

      {/* ── Delete Confirm ────────────────────────────────────── */}
      <ConfirmDialog
        open={!!c.deleteTarget}
        onClose={() => c.setDeleteTarget(null)}
        onConfirm={c.confirmDelete}
        title="Delete Coupon"
        message={`Are you sure you want to delete coupon "${c.deleteTarget?.code}"? This cannot be undone.`}
        confirmLabel={c.isDeleting ? 'Deleting…' : 'Delete'}
      />
    </div>
  )
}

// ── Coupon table row ──────────────────────────────────────────────────────────

function CouponRow({ coupon, isToggling, onEdit, onDelete, onToggle }) {
  const startDate = coupon.startDate
    ? new Date(coupon.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null
  const endDate = coupon.endDate
    ? new Date(coupon.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
      {/* Code + Title */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-100 dark:bg-pink-900/30">
            <Tag className="h-4 w-4 text-pink-500" />
          </div>
          <div>
            <p className="font-mono text-sm font-bold text-slate-800 dark:text-slate-100">{coupon.code}</p>
            <p className="max-w-40 truncate text-xs text-slate-400">{coupon.title}</p>
          </div>
        </div>
      </td>

      {/* Discount */}
      <td className="px-4 py-3">
        <DiscountBadge type={coupon.discountType} value={coupon.discount} />
        {coupon.minPrice > 0 && (
          <p className="mt-0.5 text-xs text-slate-400">Min ₹{coupon.minPrice}</p>
        )}
      </td>

      {/* Valid Period */}
      <td className="hidden px-4 py-3 md:table-cell">
        {startDate || endDate ? (
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {startDate && <p>{startDate}</p>}
            {endDate   && <p>→ {endDate}</p>}
          </div>
        ) : (
          <span className="text-xs text-slate-300 dark:text-slate-600">No limit</span>
        )}
      </td>

      {/* Usage */}
      <td className="hidden px-4 py-3 lg:table-cell">
        <div className="text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold">{coupon.usedCount ?? 0}</span>
          {coupon.usageLimit != null ? (
            <span className="text-slate-400"> / {coupon.usageLimit}</span>
          ) : (
            <span className="text-slate-400"> / ∞</span>
          )}
        </div>
        {coupon.usageLimit != null && (
          <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-pink-400"
              style={{ width: `${Math.min(100, ((coupon.usedCount ?? 0) / coupon.usageLimit) * 100)}%` }}
            />
          </div>
        )}
      </td>

      {/* Status toggle */}
      <td className="hidden px-4 py-3 sm:table-cell">
        <button
          onClick={onToggle}
          disabled={isToggling}
          className="flex items-center gap-1.5 transition disabled:opacity-50"
        >
          {isToggling ? (
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          ) : coupon.active ? (
            <ToggleRight className="h-6 w-6 text-green-500" />
          ) : (
            <ToggleLeft className="h-6 w-6 text-slate-300 dark:text-slate-600" />
          )}
          <span className={`text-xs font-semibold ${coupon.active ? 'text-green-600' : 'text-slate-400'}`}>
            {coupon.active ? 'Active' : 'Off'}
          </span>
        </button>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <ActionBtn onClick={onEdit} title="Edit" className="text-slate-500 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/30">
            <Pencil className="h-4 w-4" />
          </ActionBtn>
          <ActionBtn onClick={onDelete} title="Delete" className="text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30">
            <Trash2 className="h-4 w-4" />
          </ActionBtn>
        </div>
      </td>
    </tr>
  )
}

// ── Create / Edit Modal ───────────────────────────────────────────────────────

function CouponModal({ editTarget, formData, setFormData, isSubmitting, formError, onSubmit, onClose }) {
  const set    = (key) => (e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))
  const toggle = (key) => () => setFormData((prev) => ({ ...prev, [key]: !prev[key] }))

  const toggleDay = (day) =>
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }))

  const isPercentage = formData.discountType === 'percentage'

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {editTarget ? 'Edit Coupon' : 'Add New Coupon'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {formError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" /> {formError}
            </div>
          )}

          {/* Title + Code */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <FormLabel required>Title</FormLabel>
              <FormInput value={formData.title} onChange={set('title')} placeholder="e.g. Summer Sale" />
            </div>
            <div>
              <FormLabel>Coupon Code</FormLabel>
              <FormInput
                value={formData.code}
                onChange={set('code')}
                placeholder="Leave blank to auto-generate"
                className="uppercase placeholder:normal-case"
              />
              <p className="mt-1 text-xs text-slate-400">Auto-generated as CPN-1, CPN-2… if left blank</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <FormLabel>Description</FormLabel>
            <textarea
              value={formData.description}
              onChange={set('description')}
              rows={2}
              placeholder="Optional short description…"
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-300"
            />
          </div>

          {/* Discount type + value */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <FormLabel required>Discount Type</FormLabel>
              <select
                value={formData.discountType}
                onChange={set('discountType')}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <FormLabel required>Discount Value</FormLabel>
              <FormInput
                type="number"
                min="0"
                max={isPercentage ? '100' : undefined}
                value={formData.discount}
                onChange={set('discount')}
                placeholder={isPercentage ? 'e.g. 20' : 'e.g. 100'}
              />
            </div>
            <div>
              <FormLabel>Min Order Price (₹)</FormLabel>
              <FormInput
                type="number"
                min="0"
                value={formData.minPrice}
                onChange={set('minPrice')}
                placeholder="0"
              />
            </div>
          </div>

          {/* Max discount (percentage only) + usage limit */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {isPercentage && (
              <div>
                <FormLabel>Max Discount Cap (₹)</FormLabel>
                <FormInput
                  type="number"
                  min="0"
                  value={formData.maxDiscount}
                  onChange={set('maxDiscount')}
                  placeholder="No cap"
                />
              </div>
            )}
            <div>
              <FormLabel>Usage Limit</FormLabel>
              <FormInput
                type="number"
                min="1"
                value={formData.usageLimit}
                onChange={set('usageLimit')}
                placeholder="Unlimited"
              />
            </div>
          </div>

          {/* Date range */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <FormLabel>Start Date</FormLabel>
              <FormInput type="date" value={formData.startDate} onChange={set('startDate')} />
            </div>
            <div>
              <FormLabel>End Date</FormLabel>
              <FormInput type="date" value={formData.endDate} onChange={set('endDate')} />
            </div>
          </div>

          {/* Time range */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <FormLabel>Start Time</FormLabel>
              <FormInput type="time" value={formData.startTime} onChange={set('startTime')} />
            </div>
            <div>
              <FormLabel>End Time</FormLabel>
              <FormInput type="time" value={formData.endTime} onChange={set('endTime')} />
            </div>
          </div>

          {/* Valid days */}
          <div>
            <FormLabel>Valid Days <span className="ml-1 text-xs font-normal text-slate-400">(empty = all days)</span></FormLabel>
            <div className="flex flex-wrap gap-2 pt-1">
              {DAYS.map((day) => {
                const active = formData.days.includes(day)
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      active
                        ? 'bg-pink-500 text-white'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              role="switch"
              aria-checked={formData.active}
              onClick={toggle('active')}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
                formData.active ? 'bg-pink-500' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${formData.active ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Active</p>
              <p className="text-xs text-slate-400">Allow this coupon to be applied at checkout</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-pink-500 to-rose-500 px-5 py-2.5 text-sm font-bold text-white hover:from-pink-600 hover:to-rose-600 disabled:opacity-60 transition"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {editTarget ? 'Save Changes' : 'Create Coupon'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Discount badge ────────────────────────────────────────────────────────────

function DiscountBadge({ type, value }) {
  return type === 'percentage' ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-bold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
      {value}% off
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
      ₹{value} off
    </span>
  )
}

// ── Shared primitives ─────────────────────────────────────────────────────────

function ActionBtn({ onClick, title, className, children }) {
  return (
    <button onClick={onClick} title={title} className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${className}`}>
      {children}
    </button>
  )
}

function FormLabel({ children, required }) {
  return (
    <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
      {children}{required && <span className="ml-0.5 text-rose-500">*</span>}
    </label>
  )
}

function FormInput({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-300 ${className}`}
      {...props}
    />
  )
}

function TableSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="animate-pulse border-b border-slate-100 dark:border-slate-800">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-20 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3"><div className="h-5 w-16 rounded-full bg-slate-200 dark:bg-slate-700" /></td>
      <td className="hidden px-4 py-3 md:table-cell"><div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" /></td>
      <td className="hidden px-4 py-3 lg:table-cell"><div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" /></td>
      <td className="hidden px-4 py-3 sm:table-cell"><div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" /></td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          {[0, 1].map((j) => <div key={j} className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700" />)}
        </div>
      </td>
    </tr>
  ))
}
