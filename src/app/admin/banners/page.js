'use client'

import { useRef } from 'react'
import {
  Plus, Pencil, Trash2, RefreshCw, CheckCircle2,
  AlertCircle, ImageIcon, Loader2, X, ToggleLeft, ToggleRight,
  MousePointerClick,
} from 'lucide-react'
import { PageHeader, ConfirmDialog } from '@/components/ui'
import { useBanners } from '@/hooks/useBanners'

const PLACEMENTS = ['Home Hero', 'Category Top', 'Sidebar', 'Checkout']

export default function BannersPage() {
  const b = useBanners()

  return (
    <div>
      <PageHeader
        title="Banners"
        subtitle={`${b.total} total banners`}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={b.refresh}
              title="Refresh"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={b.openCreate}
              className="flex items-center gap-2 rounded-xl bg-linear-to-r from-pink-500 to-rose-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-pink-200 hover:from-pink-600 hover:to-rose-600 transition"
            >
              <Plus className="h-4 w-4" /> Add Banner
            </button>
          </div>
        }
      />

      {b.successMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> {b.successMsg}
        </div>
      )}
      {b.fetchError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {b.fetchError}
        </div>
      )}

      {/* ── Filters ──────────────────────────────────────────── */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <select
          value={b.filterPlace}
          onChange={(e) => b.setFilterPlace(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="">All Placements</option>
          {(b.placements.length ? b.placements : PLACEMENTS).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select
          value={b.filterActive}
          onChange={(e) => b.setFilterActive(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
                <th className="px-4 py-3">Banner</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Placement</th>
                <th className="px-4 py-3">Clicks</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {b.isFetching ? (
                <TableSkeleton />
              ) : b.banners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <ImageIcon className="h-10 w-10 opacity-30" />
                      <p className="text-sm">No banners found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                b.banners.map((banner) => (
                  <BannerRow
                    key={banner._id}
                    banner={banner}
                    isToggling={b.togglingId === banner._id}
                    onEdit={() => b.openEdit(banner)}
                    onDelete={() => b.setDeleteTarget(banner)}
                    onToggle={() => b.handleToggle(banner._id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Create / Edit Modal ───────────────────────────────── */}
      {b.modalOpen && (
        <BannerModal
          editTarget={b.editTarget}
          formData={b.formData}
          setFormData={b.setFormData}
          imagePreview={b.imagePreview}
          pickImage={b.pickImage}
          isSubmitting={b.isSubmitting}
          formError={b.formError}
          onSubmit={b.submitForm}
          onClose={b.closeModal}
        />
      )}

      {/* ── Delete Confirm ────────────────────────────────────── */}
      <ConfirmDialog
        open={!!b.deleteTarget}
        onClose={() => b.setDeleteTarget(null)}
        onConfirm={b.confirmDelete}
        title="Delete Banner"
        message={`Are you sure you want to delete "${b.deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel={b.isDeleting ? 'Deleting…' : 'Delete'}
      />
    </div>
  )
}

// ── Banner table row ──────────────────────────────────────────────────────────

function BannerRow({ banner, isToggling, onEdit, onDelete, onToggle }) {
  return (
    <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
      {/* Image + title */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-14 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800">
            {banner.image ? (
              <img src={banner.image} alt={banner.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-300">
                <ImageIcon className="h-5 w-5" />
              </div>
            )}
          </div>
          <p className="truncate max-w-44 font-semibold text-slate-800 dark:text-slate-100">{banner.title}</p>
        </div>
      </td>

      {/* Code */}
      <td className="px-4 py-3">
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{banner.code ?? '—'}</span>
      </td>

      {/* Placement */}
      <td className="px-4 py-3">
        <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
          {banner.placement ?? '—'}
        </span>
      </td>

      {/* Clicks */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
          <MousePointerClick className="h-3.5 w-3.5 text-slate-400" />
          {banner.clicks ?? 0}
        </div>
      </td>

      {/* Active toggle */}
      <td className="px-4 py-3">
        <button
          onClick={onToggle}
          disabled={isToggling}
          title={banner.active ? 'Deactivate' : 'Activate'}
          className="flex items-center gap-1.5 transition disabled:opacity-50"
        >
          {isToggling ? (
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          ) : banner.active ? (
            <ToggleRight className="h-6 w-6 text-green-500" />
          ) : (
            <ToggleLeft className="h-6 w-6 text-slate-300 dark:text-slate-600" />
          )}
          <span className={`text-xs font-semibold ${banner.active ? 'text-green-600' : 'text-slate-400'}`}>
            {banner.active ? 'Active' : 'Inactive'}
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

function BannerModal({ editTarget, formData, setFormData, imagePreview, pickImage, isSubmitting, formError, onSubmit, onClose }) {
  const fileRef = useRef(null)
  const set = (key) => (e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))
  const toggle = (key) => () => setFormData((prev) => ({ ...prev, [key]: !prev[key] }))

  const existingImage = editTarget?.image ?? null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {editTarget ? 'Edit Banner' : 'Add New Banner'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {formError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" /> {formError}
            </div>
          )}

          {/* Image picker */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Banner Image {!editTarget && <span className="ml-0.5 text-rose-500">*</span>}
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50/40 py-5 transition hover:border-pink-400 hover:bg-pink-50 dark:border-pink-800 dark:bg-pink-900/10"
            >
              {imagePreview || existingImage ? (
                <>
                  <img
                    src={imagePreview ?? existingImage}
                    alt="preview"
                    className="max-h-36 rounded-xl object-contain"
                  />
                  <p className="text-xs text-pink-500">
                    {imagePreview ? 'New image selected — click to replace' : 'Click to replace image'}
                  </p>
                </>
              ) : (
                <>
                  <ImageIcon className="h-8 w-8 text-pink-400" />
                  <p className="text-sm font-semibold text-slate-500">Click to upload image</p>
                  <p className="text-xs text-slate-400">PNG, JPG, WEBP recommended</p>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) pickImage(e.target.files[0]); e.target.value = '' }}
            />
          </div>

          {/* Title */}
          <div>
            <FormLabel required>Title</FormLabel>
            <FormInput value={formData.title} onChange={set('title')} placeholder="e.g. Summer Sale" />
          </div>

          {/* Placement */}
          <div>
            <FormLabel>Placement</FormLabel>
            <select
              value={formData.placement}
              onChange={set('placement')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {PLACEMENTS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
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
              <p className="text-xs text-slate-400">Show this banner to visitors</p>
            </div>
          </div>
        </div>

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
            {editTarget ? 'Save Changes' : 'Create Banner'}
          </button>
        </div>
      </div>
    </div>
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

function FormInput(props) {
  return (
    <input
      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-300"
      {...props}
    />
  )
}

function TableSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="animate-pulse border-b border-slate-100 dark:border-slate-800">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-14 w-24 rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </td>
      <td className="px-4 py-3"><div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-700" /></td>
      <td className="px-4 py-3"><div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-700" /></td>
      <td className="px-4 py-3"><div className="h-4 w-10 rounded bg-slate-200 dark:bg-slate-700" /></td>
      <td className="px-4 py-3"><div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-700" /></td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          {[0, 1].map((j) => <div key={j} className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700" />)}
        </div>
      </td>
    </tr>
  ))
}
