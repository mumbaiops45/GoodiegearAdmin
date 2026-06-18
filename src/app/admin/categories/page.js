'use client'

import { useRef } from 'react'
import {
  Plus, Pencil, Trash2, X, FolderOpen,
  CheckCircle2, AlertCircle, Loader2, Camera, XCircle,
} from 'lucide-react'
import { PageHeader, ConfirmDialog } from '@/components/ui'
import { useCategories } from '@/hooks/useCategories'

export default function CategoriesPage() {
  const c = useCategories()

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle={`${c.categories.length} categories`}
        action={
          <button
            onClick={c.openCreate}
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-pink-500 to-rose-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-pink-200 hover:from-pink-600 hover:to-rose-600 transition"
          >
            <Plus className="h-4 w-4" /> Add Category
          </button>
        }
      />

      {/* Success banner */}
      {c.successMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> {c.successMsg}
        </div>
      )}

      {/* Error banner */}
      {c.fetchError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {c.fetchError}
        </div>
      )}

      {/* ── Grid ─────────────────────────────────────────────── */}
      {c.isFetching ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-3 h-36 rounded-xl bg-slate-200 dark:bg-slate-700" />
              <div className="mb-2 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      ) : c.categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-20 dark:border-slate-700 dark:bg-slate-900">
          <FolderOpen className="h-12 w-12 text-slate-300" />
          <p className="mt-3 text-sm text-slate-400">No categories yet. Add your first one.</p>
          <button
            onClick={c.openCreate}
            className="mt-4 flex items-center gap-2 rounded-xl bg-pink-500 px-4 py-2 text-sm font-bold text-white hover:bg-pink-600"
          >
            <Plus className="h-4 w-4" /> Add Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {c.categories.map((cat) => (
            <CategoryCard
              key={cat._id}
              category={cat}
              onEdit={() => c.openEdit(cat)}
              onDelete={() => c.setDeleteTarget(cat)}
            />
          ))}
        </div>
      )}

      {/* ── Create / Edit Modal ───────────────────────────────── */}
      {c.modalOpen && (
        <CategoryModal
          editTarget={c.editTarget}
          formData={c.formData}
          setFormData={c.setFormData}
          handleImagePick={c.handleImagePick}
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
        title="Delete Category"
        message={`Are you sure you want to delete "${c.deleteTarget?.name}"? Products in this category will lose their category assignment.`}
        confirmLabel={c.isDeleting ? 'Deleting…' : 'Delete'}
      />
    </div>
  )
}

// ── Category card ─────────────────────────────────────────────────────────────

function CategoryCard({ category, onEdit, onDelete }) {
  const date = category.createdAt
    ? new Date(category.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      {/* Image */}
      <div className="relative h-36 overflow-hidden bg-linear-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FolderOpen className="h-12 w-12 text-pink-200 dark:text-pink-800" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pt-3 pb-2">
        <h3 className="font-bold text-slate-800 dark:text-slate-100">{category.name}</h3>
        {category.description ? (
          <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
            {category.description}
          </p>
        ) : (
          <p className="mt-1 text-xs italic text-slate-300 dark:text-slate-600">No description</p>
        )}
        {date && <p className="mt-1.5 text-[11px] text-slate-400">{date}</p>}
      </div>

      {/* Always-visible action buttons */}
      <div className="flex gap-2 border-t border-slate-100 px-4 py-3 dark:border-slate-800">
        <button
          onClick={onEdit}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 py-2 text-xs font-semibold text-amber-600 transition hover:bg-amber-100 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-400"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
        <button
          onClick={onDelete}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </div>
    </div>
  )
}

// ── Create / Edit Modal ───────────────────────────────────────────────────────

function CategoryModal({ editTarget, formData, setFormData, handleImagePick, isSubmitting, formError, onSubmit, onClose }) {
  const fileRef = useRef(null)
  const set = (key) => (e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))

  // Displayed preview: new file picked → blob URL, otherwise existing backend URL
  const previewSrc = formData.imagePreview ?? formData.existingImage ?? null

  const clearImage = () => {
    setFormData((prev) => ({ ...prev, imageFile: null, imagePreview: null, existingImage: '' }))
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <ModalWrapper title={editTarget ? 'Edit Category' : 'Add New Category'} onClose={onClose}>
      {formError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {formError}
        </div>
      )}

      <div className="space-y-4">
        {/* ── Image picker ──────────────────────────────────── */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Category Image
          </label>

          <div className="flex items-center gap-4">
            {/* Small preview thumbnail */}
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
              {previewSrc ? (
                <>
                  <img src={previewSrc} alt="Preview" className="h-full w-full object-cover" />
                  {/* Clear button */}
                  <button
                    type="button"
                    onClick={clearImage}
                    title="Remove image"
                    className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm backdrop-blur-sm hover:bg-white"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-slate-300">
                  <FolderOpen className="h-6 w-6" />
                  <span className="text-[10px]">No image</span>
                </div>
              )}
            </div>

            {/* Upload button + file name */}
            <div className="flex-1">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-pink-200 bg-pink-50 px-4 py-2.5 text-sm font-semibold text-pink-600 hover:bg-pink-100 dark:border-pink-800 dark:bg-pink-900/20 dark:text-pink-300 transition"
              >
                <Camera className="h-4 w-4" />
                {previewSrc ? 'Change Image' : 'Choose from Folder'}
              </button>
              {formData.imageFile && (
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 truncate max-w-48">
                  {formData.imageFile.name}
                </p>
              )}
              {!formData.imageFile && !formData.existingImage && (
                <p className="mt-1.5 text-xs text-slate-400">PNG, JPG, WEBP up to 5 MB</p>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImagePick(f) }}
              />
            </div>
          </div>
        </div>

        {/* ── Name ────────────────────────────────────────── */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Name <span className="text-rose-500">*</span>
          </label>
          <input
            value={formData.name}
            onChange={set('name')}
            placeholder="e.g. Clothing"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-300"
          />
        </div>

        {/* ── Description ─────────────────────────────────── */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={set('description')}
            rows={3}
            placeholder="Short description of this category…"
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-300"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
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
          {isSubmitting
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <CheckCircle2 className="h-4 w-4" />}
          {editTarget ? 'Save Changes' : 'Create Category'}
        </button>
      </div>
    </ModalWrapper>
  )
}

// ── Shared primitives ─────────────────────────────────────────────────────────

function ModalWrapper({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
