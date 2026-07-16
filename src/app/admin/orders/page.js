'use client'

import { useState, Fragment } from 'react'
import {
  ShoppingBag, Search, RefreshCw, AlertCircle, CheckCircle2,
  X, MapPin, CreditCard, Package, ChevronDown, Loader2, Eye,
  Download, Lock,
} from 'lucide-react'
import { Dialog, Transition } from '@headlessui/react'
import { useOrders } from '@/hooks/useOrders'

// ────────────────────────────────────
// 1. LOCAL CONFIRM DIALOG COMPONENT
// ────────────────────────────────────
function ConfirmDialog({
  open,
  onOpenChange,
  title = 'Confirm Action',
  description = 'Are you sure?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
}) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onOpenChange}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-start justify-between">
                <Dialog.Title className="text-lg font-bold text-slate-900 dark:text-white">
                  {title}
                </Dialog.Title>
                <button
                  onClick={() => onOpenChange(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* ─── This is where your message appears ─── */}
              <Dialog.Description className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {description}
              </Dialog.Description>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    onCancel?.()
                    onOpenChange(false)
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={() => {
                    onConfirm?.()
                    onOpenChange(false)
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition ${
                    variant === 'danger'
                      ? 'bg-red-600 hover:bg-red-700 shadow-red-200'
                      : 'bg-pink-600 hover:bg-pink-700 shadow-pink-200'
                  }`}
                >
                  {confirmLabel}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

// ────────────────────────────────────
// 2. ORDERS PAGE – MAIN COMPONENT
// ────────────────────────────────────

const ORDER_STATUSES  = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
const PAYMENT_STATUSES = ['Pending', 'Paid', 'Failed']

const LOCKED_STATUSES = ['Cancelled', 'Delivered']
const isStatusLocked = (status) => LOCKED_STATUSES.includes(status)

const STATUS_STYLE = {
  Pending:    { pill: 'bg-amber-50  text-amber-700',  dot: 'bg-amber-400'  },
  Processing: { pill: 'bg-blue-50   text-blue-700',   dot: 'bg-blue-400'   },
  Shipped:    { pill: 'bg-indigo-50 text-indigo-700', dot: 'bg-indigo-400' },
  Delivered:  { pill: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-400' },
  Cancelled:  { pill: 'bg-rose-50   text-rose-700',   dot: 'bg-rose-400'   },
}

const PAYMENT_STYLE = {
  Pending: 'bg-slate-100 text-slate-600',
  Paid:    'bg-emerald-100 text-emerald-700',
  Failed:  'bg-red-100 text-red-600',
}

export default function OrdersPage() {
  const o = useOrders()

  // Confirmation dialog state
  const [confirmState, setConfirmState] = useState({
    open: false,
    orderId: '',
    status: '',
    message: '',
  })

  // Export to CSV
  const handleExport = () => {
    if (o.orders.length === 0) {
      alert('No orders to export.')
      return
    }

    const headers = [
      'Order ID',
      'Customer',
      'Email',
      'Items',
      'Total',
      'Payment Status',
      'Order Status',
      'Date',
    ]

    const rows = o.orders.map((order) => {
      const name = order.user?.name ?? order.user?.email ?? 'Guest'
      const email = order.user?.email ?? ''
      const items = order.orderItems?.length ?? 0
      const total = Number(order.totalPrice ?? 0).toFixed(2)
      const payment = order.paymentStatus ?? 'Pending'
      const status = order.orderStatus ?? 'Pending'
      const date = order.createdAt
        ? new Date(order.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          })
        : ''

      return [
        `"${order.displayId || order._id}"`,
        `"${name}"`,
        `"${email}"`,
        items,
        total,
        `"${payment}"`,
        `"${status}"`,
        `"${date}"`,
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
    link.download = `orders_export_${new Date().toISOString().slice(0,10)}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  // Status change wrapper with confirmation
  const requestStatusChange = (orderId, newStatus) => {
    if (newStatus === 'Cancelled' || newStatus === 'Delivered') {
      const message =
        newStatus === 'Cancelled'
          ? 'Are you sure you want to cancel this order?'
          : 'Are you sure you want to mark this order as Delivered?'

      setConfirmState({
        open: true,
        orderId,
        status: newStatus,
        message,
      })
    } else {
      o.handleStatusUpdate(orderId, newStatus)
    }
  }

  const handleConfirm = () => {
    o.handleStatusUpdate(confirmState.orderId, confirmState.status)
    setConfirmState({ open: false, orderId: '', status: '', message: '' })
  }

  const handleCancelConfirm = () => {
    setConfirmState({ open: false, orderId: '', status: '', message: '' })
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800">Orders</h1>
          <p className="mt-0.5 text-sm text-slate-400">{o.total} total orders</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={o.isFetching || o.orders.length === 0}
            className="flex items-center gap-2 rounded-xl border border-pink-200 bg-white px-4 py-2.5 text-sm font-medium text-pink-600 shadow-sm transition hover:bg-pink-50 disabled:opacity-50 dark:border-pink-800/30 dark:bg-slate-800 dark:text-pink-400 dark:hover:bg-pink-900/20"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={o.refresh}
            disabled={o.isFetching}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <RefreshCw className={`h-4 w-4 ${o.isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Messages */}
      {o.successMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-800/30 dark:bg-emerald-900/20 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> {o.successMsg}
        </div>
      )}
      {o.fetchError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800/30 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" /> {o.fetchError}
        </div>
      )}

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {['', ...ORDER_STATUSES].map((s) => {
          const count  = s ? (o.statusCounts[s] ?? 0) : o.total
          const active = o.filterStatus === s
          return (
            <button
              key={s || 'all'}
              onClick={() => o.setFilterStatus(s)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                active
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {s || 'All Orders'}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="relative flex-1 min-w-56">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            placeholder="Search by Order ID, customer name or email…"
            value={o.search}
            onChange={(e) => o.setSearch(e.target.value)}
          />
        </div>
        <select
          value={o.filterPayment}
          onChange={(e) => o.setFilterPayment(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="">All Payments</option>
          {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
                <th className="px-4 py-3 text-left sm:px-5">Order ID</th>
                <th className="px-4 py-3 text-left sm:px-5">Customer</th>
                <th className="hidden px-5 py-3 text-center sm:table-cell">Items</th>
                <th className="px-4 py-3 text-right sm:px-5">Total</th>
                <th className="hidden px-5 py-3 text-center md:table-cell">Payment</th>
                <th className="px-4 py-3 text-center sm:px-5">Status</th>
                <th className="hidden px-5 py-3 text-right lg:table-cell">Date</th>
                <th className="px-4 py-3 text-right sm:px-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {o.isFetching ? (
                Array.from({ length: 7 }).map((_, i) => <SkeletonRow key={i} />)
              ) : o.orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <ShoppingBag className="h-10 w-10 opacity-30" />
                      <p className="text-sm">No orders found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                o.orders.map((order) => (
                  <OrderRow
                    key={order._id}
                    order={order}
                    isUpdating={o.updatingId === order._id}
                    onView={() => o.setDetailOrder(order)}
                    onStatusChange={(status) => requestStatusChange(order._id, status)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail modal */}
      {o.detailOrder && (
        <OrderDetailModal
          order={o.detailOrder}
          isUpdating={o.updatingId === o.detailOrder._id}
          updateError={o.updateError}
          onStatusChange={(status) => requestStatusChange(o.detailOrder._id, status)}
          onClose={() => o.setDetailOrder(null)}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmState.open}
        onOpenChange={(open) => {
          if (!open) setConfirmState({ open: false, orderId: '', status: '', message: '' })
        }}
        title="Confirm Status Change"
        description={confirmState.message}
        confirmLabel={`Yes, ${confirmState.status}`}
        cancelLabel="Cancel"
        onConfirm={handleConfirm}
        onCancel={handleCancelConfirm}
      />
    </div>
  )
}

// ────────────────────────────────────
// 3. SUB‑COMPONENTS
// ────────────────────────────────────

function OrderRow({ order, isUpdating, onView, onStatusChange }) {
  const name    = order.user?.name  ?? order.user?.email ?? 'Guest'
  const email   = order.user?.email ?? ''
  const date    = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'
  const s       = STATUS_STYLE[order.orderStatus]  ?? STATUS_STYLE.Pending
  const ps      = PAYMENT_STYLE[order.paymentStatus] ?? PAYMENT_STYLE.Pending

  return (
    <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
      <td className="px-4 py-3.5 sm:px-5">
        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">{order.displayId}</span>
      </td>
      <td className="px-4 py-3.5 sm:px-5">
        <p className="font-semibold text-slate-800 dark:text-slate-100">{name}</p>
        {email && <p className="hidden text-xs text-slate-400 dark:text-slate-500 sm:block">{email}</p>}
      </td>
      <td className="hidden px-5 py-3.5 text-center sm:table-cell">
        <span className="inline-flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-300">
          {order.orderItems?.length ?? 0}
        </span>
      </td>
      <td className="px-4 py-3.5 text-right font-bold text-slate-800 dark:text-slate-100 sm:px-5">
        ₹{Number(order.totalPrice ?? 0).toLocaleString('en-IN')}
      </td>
      <td className="hidden px-5 py-3.5 text-center md:table-cell">
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${ps}`}>
          {order.paymentStatus}
        </span>
      </td>
      <td className="px-4 py-3.5 text-center sm:px-5">
        <StatusDropdown
          value={order.orderStatus}
          isUpdating={isUpdating}
          onChange={onStatusChange}
        />
      </td>
      <td className="hidden px-5 py-3.5 text-right text-xs text-slate-400 dark:text-slate-500 lg:table-cell">{date}</td>
      <td className="px-4 py-3.5 text-right sm:px-5">
        <button
          onClick={onView}
          className="inline-flex items-center gap-1 rounded-lg border border-pink-200 bg-pink-50 px-2.5 py-1.5 text-xs font-medium text-pink-600 transition hover:bg-pink-100 dark:border-pink-800/30 dark:bg-pink-900/20 dark:text-pink-400"
        >
          <Eye className="h-3.5 w-3.5" /> View
        </button>
      </td>
    </tr>
  )
}

function StatusDropdown({ value, isUpdating, onChange }) {
  const s = STATUS_STYLE[value] ?? STATUS_STYLE.Pending
  const locked = isStatusLocked(value)

  if (locked) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${s.pill}`}>
        {value} <Lock className="h-3 w-3" />
      </span>
    )
  }

  return (
    <div className="relative inline-block">
      {isUpdating ? (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${s.pill}`}>
          <Loader2 className="h-3 w-3 animate-spin" /> {value}
        </span>
      ) : (
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`appearance-none cursor-pointer rounded-full border-0 py-0.5 pl-2 pr-6 text-[11px] font-semibold outline-none ${s.pill}`}
          >
            {ORDER_STATUSES.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 opacity-60" />
        </div>
      )}
    </div>
  )
}

function OrderDetailModal({ order, isUpdating, updateError, onStatusChange, onClose }) {
  const [selectedStatus, setSelectedStatus] = useState(order.orderStatus)
  const hasChanged = selectedStatus !== order.orderStatus
  const locked = isStatusLocked(order.orderStatus)

  const addr    = order.shippingAddress ?? {}
  const date    = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : '—'
  const s       = STATUS_STYLE[order.orderStatus]  ?? STATUS_STYLE.Pending
  const ps      = PAYMENT_STYLE[order.paymentStatus] ?? PAYMENT_STYLE.Pending

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900" style={{ maxHeight: '90vh' }}>

        {/* Modal header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div>
            <p className="text-xs text-slate-400">Order details</p>
            <h2 className="font-black text-slate-800 dark:text-white">{order.displayId}</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.pill}`}>{order.orderStatus}</span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ps}`}>{order.paymentStatus}</span>
            <button onClick={onClose} className="ml-2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 dark:text-slate-300">

          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
            <div>
              <p className="text-xs text-slate-400">Customer</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{order.user?.name ?? '—'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{order.user?.email ?? ''}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Placed on</p>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{date}</p>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Package className="h-3.5 w-3.5" /> Items ({order.orderItems?.length ?? 0})
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-700 dark:bg-slate-800/50">
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-center">Qty</th>
                    <th className="px-4 py-2 text-right">Price</th>
                    <th className="px-4 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {(order.orderItems ?? []).map((item, i) => {
                    const title = item.product?.title ?? item.product ?? `Item ${i + 1}`
                    return (
                      <tr key={i}>
                        <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200">{title}</td>
                        <td className="px-4 py-2.5 text-center text-slate-600 dark:text-slate-400">{item.quantity}</td>
                        <td className="px-4 py-2.5 text-right text-slate-600 dark:text-slate-400">₹{Number(item.price ?? 0).toLocaleString('en-IN')}</td>
                        <td className="px-4 py-2.5 text-right font-semibold text-slate-800 dark:text-slate-200">
                          ₹{(Number(item.price ?? 0) * Number(item.quantity ?? 1)).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                    <td colSpan={3} className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500 dark:text-slate-400">Total</td>
                    <td className="px-4 py-2.5 text-right font-black text-slate-800 dark:text-white">
                      ₹{Number(order.totalPrice ?? 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <MapPin className="h-3.5 w-3.5" /> Shipping Address
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800">
              <p className="font-semibold text-slate-800 dark:text-slate-100">{addr.fullName}</p>
              <p className="text-slate-600 dark:text-slate-300">{addr.mobile}</p>
              <p className="mt-1 text-slate-600 dark:text-slate-300">{addr.address}</p>
              <p className="text-slate-600 dark:text-slate-300">
                {[addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')}
              </p>
              <p className="text-slate-500 dark:text-slate-400">{addr.country ?? 'India'}</p>
            </div>
          </div>

          {(order.razorpayOrderId || order.razorpayPaymentId) && (
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <CreditCard className="h-3.5 w-3.5" /> Payment Info
              </div>
              <div className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800">
                {order.razorpayOrderId && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Razorpay Order ID</span>
                    <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{order.razorpayOrderId}</span>
                  </div>
                )}
                {order.razorpayPaymentId && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment ID</span>
                    <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{order.razorpayPaymentId}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {updateError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600 dark:border-red-800/30 dark:bg-red-900/20 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" /> {updateError}
            </div>
          )}
        </div>

        {/* Footer – status editor (hidden when locked) */}
        <div className="shrink-0 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/50">
          {!locked ? (
            <>
              <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Update Order Status</p>
              <div className="flex items-center gap-3">
                <div className="flex flex-1 flex-wrap gap-2">
                  {ORDER_STATUSES.map((st) => {
                    const active = selectedStatus === st
                    const ss     = STATUS_STYLE[st]
                    return (
                      <button
                        key={st}
                        onClick={() => setSelectedStatus(st)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                          active ? ss.pill + ' ring-2 ring-offset-1 ring-current' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => onStatusChange(selectedStatus)}
                  disabled={!hasChanged || isUpdating}
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-pink-200 transition hover:bg-pink-700 disabled:opacity-40 dark:shadow-pink-900/30"
                >
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Save
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Lock className="h-4 w-4" />
              This order is <strong>{order.orderStatus}</strong> and cannot be updated further.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-slate-50 dark:border-slate-800">
      <td className="px-5 py-3.5"><div className="h-4 w-16 rounded bg-slate-100 dark:bg-slate-700" /></td>
      <td className="px-5 py-3.5">
        <div className="space-y-1.5">
          <div className="h-4 w-28 rounded bg-slate-100 dark:bg-slate-700" />
          <div className="h-3 w-20 rounded bg-slate-50 dark:bg-slate-800" />
        </div>
      </td>
      <td className="px-5 py-3.5 text-center"><div className="mx-auto h-5 w-7 rounded-full bg-slate-100 dark:bg-slate-700" /></td>
      <td className="px-5 py-3.5 text-right"><div className="ml-auto h-4 w-16 rounded bg-slate-100 dark:bg-slate-700" /></td>
      <td className="px-5 py-3.5 text-center"><div className="mx-auto h-5 w-14 rounded-full bg-slate-100 dark:bg-slate-700" /></td>
      <td className="px-5 py-3.5 text-center"><div className="mx-auto h-5 w-20 rounded-full bg-slate-100 dark:bg-slate-700" /></td>
      <td className="px-5 py-3.5 text-right"><div className="ml-auto h-3.5 w-16 rounded bg-slate-50 dark:bg-slate-800" /></td>
      <td className="px-5 py-3.5 text-right"><div className="ml-auto h-7 w-14 rounded-lg bg-slate-100 dark:bg-slate-700" /></td>
    </tr>
  )
}