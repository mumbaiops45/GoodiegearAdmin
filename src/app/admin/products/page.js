'use client'

import { useRef } from 'react'
import {
  Plus, Search, Pencil, Trash2, Upload, X,
  Package, CheckCircle2, AlertCircle, ImageIcon,
  Loader2, ChevronLeft, ChevronRight, RefreshCw, Star,
  XCircle, Images,
} from 'lucide-react'
import { uploadProductImage } from '@/services/productService'
import useAuthStore from '@/store/authStore'
import { PageHeader, ConfirmDialog } from '@/components/ui'
import { useProducts } from '@/hooks/useProducts'

export default function ProductsPage() {
  const p = useProducts()

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={`${p.total} total products`}
        action={
          <button
            onClick={p.openCreate}
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-pink-500 to-rose-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-pink-200 hover:from-pink-600 hover:to-rose-600 transition"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
        }
      />

      {/* Success banner */}
      {p.successMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" /> {p.successMsg}
        </div>
      )}

      {/* Error banner */}
      {p.fetchError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {p.fetchError}
        </div>
      )}

      {/* ── Filters ──────────────────────────────────────────── */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-56">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            placeholder="Search by title, brand, category…"
            value={p.search}
            onChange={(e) => { p.setSearch(e.target.value); p.setPage(1) }}
          />
        </div>

        <select
          value={p.filterCat}
          onChange={(e) => { p.setFilterCat(e.target.value); p.setPage(1) }}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="">All Categories</option>
          {p.categoryList.map((cat) => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        <select
          value={p.filterActive}
          onChange={(e) => { p.setFilterActive(e.target.value); p.setPage(1) }}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <button
          onClick={() => p.setPage(1)}
          title="Refresh"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
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
                <th className="px-4 py-3">Product</th>
                <th className="hidden px-4 py-3 md:table-cell">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="hidden px-4 py-3 lg:table-cell">Rating</th>
                <th className="hidden px-4 py-3 sm:table-cell">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {p.isFetching ? (
                <TableSkeleton />
              ) : p.products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Package className="h-10 w-10 opacity-30" />
                      <p className="text-sm">No products found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                p.products.map((product) => (
                  <ProductRow
                    key={product._id}
                    product={product}
                    onEdit={() => p.openEdit(product)}
                    onDelete={() => p.setDeleteTarget(product)}
                    onUpload={() => p.setUploadTarget(product._id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {p.total > 0 && !p.isFetching && (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-800">
            <p className="text-xs text-slate-500">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {(p.page - 1) * 10 + 1}–{Math.min(p.page * 10, p.total)}
              </span>
              {' '}of{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-200">{p.total}</span>
              {' '}products
            </p>
            <Pagination page={p.page} totalPages={p.totalPages} onPageChange={p.setPage} />
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ───────────────────────────────── */}
      {p.modalOpen && (
        <ProductModal
          editTarget={p.editTarget}
          formData={p.formData}
          setFormData={p.setFormData}
          isSubmitting={p.isSubmitting}
          formError={p.formError}
          onSubmit={p.submitForm}
          onClose={p.closeModal}
          categoryList={p.categoryList}
          vendorList={p.vendorList}
          imageFiles={p.imageFiles}
          addImageFiles={p.addImageFiles}
          removeImageFile={p.removeImageFile}
        />
      )}

      {/* ── Image Upload Modal ────────────────────────────────── */}
      {p.uploadTarget && (
        <ImageUploadModal
          productId={p.uploadTarget}
          onDone={p.onUploadDone}
          onClose={() => p.setUploadTarget(null)}
        />
      )}

      {/* ── Delete Confirm ────────────────────────────────────── */}
      <ConfirmDialog
        open={!!p.deleteTarget}
        onClose={() => p.setDeleteTarget(null)}
        onConfirm={p.confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${p.deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel={p.isDeleting ? 'Deleting…' : 'Delete'}
      />
    </div>
  )
}

// ── Product table row ─────────────────────────────────────────────────────────

function ProductRow({ product, onEdit, onDelete, onUpload }) {
  const image         = product.images?.[0] ?? null
  const price         = Number(product.price ?? 0)
  const discountPrice = Number(product.discountPrice ?? 0)
  const stock         = Number(product.stock ?? 0)
  const rating        = Number(product.rating ?? 0)

  return (
    <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
      {/* Image + title + brand */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800">
            {image ? (
              <img src={image} alt={product.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-300">
                <ImageIcon className="h-5 w-5" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate max-w-44 font-semibold text-slate-800 dark:text-slate-100">
                {product.title}
              </p>
              {product.isFeatured && (
                <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-600">
                  Featured
                </span>
              )}
            </div>
            {product.brand && (
              <p className="text-xs text-slate-400">{product.brand}</p>
            )}
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="hidden px-4 py-3 text-sm text-slate-600 dark:text-slate-300 md:table-cell">{product.category}</td>

      {/* Price */}
      <td className="px-4 py-3">
        <p className="font-semibold text-slate-800 dark:text-slate-100">₹{price.toLocaleString()}</p>
        {discountPrice > 0 && (
          <p className="text-xs text-slate-400 line-through">₹{discountPrice.toLocaleString()}</p>
        )}
      </td>

      {/* Stock */}
      <td className="px-4 py-3">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          stock === 0
            ? 'bg-red-100 text-red-700'
            : stock < 10
            ? 'bg-amber-100 text-amber-700'
            : 'bg-emerald-100 text-emerald-700'
        }`}>
          {stock === 0 ? 'Out of stock' : stock < 10 ? `Low · ${stock}` : stock}
        </span>
      </td>

      {/* Rating */}
      <td className="hidden px-4 py-3 lg:table-cell">
        <div className="flex items-center gap-1">
          <Star className={`h-3.5 w-3.5 ${rating > 0 ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {rating > 0 ? rating.toFixed(1) : '—'}
          </span>
          {product.numReviews > 0 && (
            <span className="text-xs text-slate-400">({product.numReviews})</span>
          )}
        </div>
      </td>

      {/* Status (isActive) */}
      <td className="hidden px-4 py-3 sm:table-cell">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          product.isActive
            ? 'bg-green-100 text-green-700'
            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
        }`}>
          {product.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <ActionBtn onClick={onUpload} title="Upload Image" className="text-slate-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30">
            <Upload className="h-4 w-4" />
          </ActionBtn>
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

function ProductModal({ editTarget, formData, setFormData, isSubmitting, formError, onSubmit, onClose, categoryList, vendorList, imageFiles, addImageFiles, removeImageFile }) {
  const set    = (key) => (e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))
  const toggle = (key) => () => setFormData((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <ModalWrapper title={editTarget ? 'Edit Product' : 'Add New Product'} onClose={onClose}>
      {formError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {formError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Vendor — required by backend */}
        <div className="sm:col-span-2">
          <FormLabel required>Vendor</FormLabel>
          <select
            value={formData.vendor}
            onChange={set('vendor')}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="">Select vendor…</option>
            {vendorList.map((v) => {
              const label = v.shopName ?? v.user?.name ?? v._id
              return <option key={v._id} value={v._id}>{label}</option>
            })}
          </select>
          {vendorList.length === 0 && (
            <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
              No approved vendors found. Approve a vendor first before adding products.
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <FormLabel required>Title</FormLabel>
          <FormInput value={formData.title} onChange={set('title')} placeholder="e.g. Premium Cotton T-Shirt" />
        </div>

        <div className="sm:col-span-2">
          <FormLabel required>Description</FormLabel>
          <textarea
            value={formData.description}
            onChange={set('description')}
            rows={3}
            placeholder="Product description…"
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 placeholder:text-slate-300"
          />
        </div>

        <div>
          <FormLabel required>Price (₹)</FormLabel>
          <FormInput type="number" min="0" value={formData.price} onChange={set('price')} placeholder="0" />
        </div>

        <div>
          <FormLabel>Discount Price (₹)</FormLabel>
          <FormInput type="number" min="0" value={formData.discountPrice} onChange={set('discountPrice')} placeholder="0" />
        </div>

        <div>
          <FormLabel required>Stock</FormLabel>
          <FormInput type="number" min="0" value={formData.stock} onChange={set('stock')} placeholder="0" />
        </div>

        <div>
          <FormLabel required>Category</FormLabel>
          {categoryList.length > 0 ? (
            <select
              value={formData.category}
              onChange={set('category')}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="">Select category…</option>
              {categoryList.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          ) : (
            <FormInput value={formData.category} onChange={set('category')} placeholder="e.g. Clothing" />
          )}
        </div>

        <div>
          <FormLabel>Brand</FormLabel>
          <FormInput value={formData.brand} onChange={set('brand')} placeholder="e.g. Nike" />
        </div>

        <div>
          <FormLabel>Age (Sports field)</FormLabel>
          <FormInput type="number" min="0" value={formData.age} onChange={set('age')} placeholder="0" />
        </div>

        {/* Boolean toggles */}
        <div className="sm:col-span-2 flex flex-wrap gap-6 pt-1">
          <Toggle
            checked={formData.isActive}
            onChange={toggle('isActive')}
            label="Active"
            description="Product is visible to customers"
          />
          <Toggle
            checked={formData.isFeatured}
            onChange={toggle('isFeatured')}
            label="Featured"
            description="Show on homepage / featured section"
          />
        </div>

        {/* Image upload section */}
        <div className="sm:col-span-2">
          <FormImageSection
            existingImages={editTarget?.images ?? []}
            imageFiles={imageFiles}
            addImageFiles={addImageFiles}
            removeImageFile={removeImageFile}
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
          {editTarget ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </ModalWrapper>
  )
}

// ── Inline image upload section (inside the create/edit form) ────────────────

function FormImageSection({ existingImages, imageFiles, addImageFiles, removeImageFile }) {
  const fileRef = useRef(null)

  const hasAny = existingImages.length > 0 || imageFiles.length > 0

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
        Product Images
      </label>

      {/* Thumbnail grid */}
      {hasAny && (
        <div className="mb-3 flex flex-wrap gap-2">
          {/* Existing images (read-only) */}
          {existingImages.map((url, i) => (
            <div key={`existing-${i}`} className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700">
              <img src={url} alt={`img-${i}`} className="h-full w-full object-cover" />
              <span className="absolute bottom-0 left-0 right-0 bg-black/40 py-0.5 text-center text-[9px] text-white">saved</span>
            </div>
          ))}

          {/* Newly queued files */}
          {imageFiles.map((item) => (
            <div key={item.id} className="group relative h-16 w-16 overflow-hidden rounded-xl border border-pink-200 bg-slate-100 dark:border-pink-700">
              <img src={item.preview} alt={item.file.name} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImageFile(item.id)}
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-red-500 opacity-0 shadow transition group-hover:opacity-100"
              >
                <XCircle className="h-4 w-4" />
              </button>
              <span className="absolute bottom-0 left-0 right-0 bg-pink-500/70 py-0.5 text-center text-[9px] text-white">new</span>
            </div>
          ))}
        </div>
      )}

      {/* Add images button */}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="flex items-center gap-2 rounded-xl border border-dashed border-pink-300 bg-pink-50/50 px-4 py-2.5 text-sm font-medium text-pink-500 transition hover:border-pink-400 hover:bg-pink-50 dark:border-pink-800 dark:bg-pink-900/10 dark:text-pink-400"
      >
        <Images className="h-4 w-4" />
        {hasAny ? 'Add more images' : 'Add images'}
      </button>
      {imageFiles.length > 0 && (
        <p className="mt-1.5 text-xs text-slate-400">
          {imageFiles.length} new image{imageFiles.length !== 1 ? 's' : ''} will be uploaded after saving
        </p>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => { if (e.target.files?.length) addImageFiles(e.target.files); e.target.value = '' }}
      />
    </div>
  )
}

// ── Multi-image Upload Modal ──────────────────────────────────────────────────
// Manages its own file list + per-file upload status.
// Uploads sequentially (one API call per file) to match upload.single() on the backend.

function ImageUploadModal({ productId, onDone, onClose }) {
  const fileRef   = useRef(null)
  const [files,   setFiles]   = useState([]) // { id, file, preview, status, error }
  const [busy,    setBusy]    = useState(false)
  const [doneCount, setDoneCount] = useState(0)

  const pendingFiles = files.filter((f) => f.status === 'pending')
  const allDone      = files.length > 0 && files.every((f) => f.status === 'done' || f.status === 'error')

  const addFiles = (picked) => {
    const next = Array.from(picked).map((file) => ({
      id:      Math.random().toString(36).slice(2),
      file,
      preview: URL.createObjectURL(file),
      status:  'pending', // pending | uploading | done | error
      error:   null,
    }))
    setFiles((prev) => [...prev, ...next])
  }

  const removeFile = (id) => {
    setFiles((prev) => {
      const f = prev.find((x) => x.id === id)
      if (f?.preview) URL.revokeObjectURL(f.preview)
      return prev.filter((x) => x.id !== id)
    })
  }

  const uploadAll = async () => {
    const token   = useAuthStore.getState().token
    const toUpload = files.filter((f) => f.status === 'pending')
    if (!toUpload.length) return
    setBusy(true)
    let uploaded = doneCount

    for (const item of toUpload) {
      setFiles((prev) => prev.map((x) => x.id === item.id ? { ...x, status: 'uploading' } : x))
      try {
        await uploadProductImage(token, productId, item.file)
        uploaded++
        setFiles((prev) => prev.map((x) => x.id === item.id ? { ...x, status: 'done' } : x))
      } catch (err) {
        setFiles((prev) => prev.map((x) => x.id === item.id ? { ...x, status: 'error', error: err.message } : x))
      }
    }

    setDoneCount(uploaded)
    setBusy(false)
  }

  const handleClose = () => {
    files.forEach((f) => { if (f.preview) URL.revokeObjectURL(f.preview) })
    if (doneCount > 0) onDone(doneCount)
    onClose()
  }

  const statusIcon = (f) => {
    if (f.status === 'uploading') return <Loader2 className="h-4 w-4 animate-spin text-pink-500" />
    if (f.status === 'done')     return <CheckCircle2 className="h-4 w-4 text-green-500" />
    if (f.status === 'error')    return <AlertCircle  className="h-4 w-4 text-red-500" />
    return null
  }

  return (
    <ModalWrapper title="Upload Product Images" onClose={handleClose}>
      {/* Drop zone */}
      <div
        onClick={() => !busy && fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); if (!busy) addFiles(e.dataTransfer.files) }}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50/40 py-8 transition hover:border-pink-400 hover:bg-pink-50 dark:border-pink-800 dark:bg-pink-900/10"
      >
        <Images className="h-9 w-9 text-pink-400" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Click or drag &amp; drop images here
        </p>
        <p className="text-xs text-slate-400">PNG, JPG, WEBP · multiple files allowed</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = '' }}
        />
      </div>

      {/* File thumbnails grid */}
      {files.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {files.length} image{files.length !== 1 ? 's' : ''} selected
          </p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
            {files.map((f) => (
              <div key={f.id} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700">
                <img src={f.preview} alt={f.file.name} className="h-full w-full object-cover" />

                {/* Status overlay */}
                <div className={`absolute inset-0 flex items-center justify-center transition ${
                  f.status !== 'pending' ? 'bg-black/30' : 'bg-transparent group-hover:bg-black/10'
                }`}>
                  {statusIcon(f)}
                </div>

                {/* Remove button — only for pending files */}
                {f.status === 'pending' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(f.id) }}
                    className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-red-500 opacity-0 shadow-sm transition group-hover:opacity-100"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}

                {/* Error tooltip */}
                {f.status === 'error' && (
                  <div className="absolute bottom-0 left-0 right-0 truncate bg-red-600/90 px-1 py-0.5 text-[10px] text-white">
                    {f.error ?? 'Failed'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          onClick={handleClose}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
        >
          {allDone ? 'Done' : 'Cancel'}
        </button>

        <button
          onClick={uploadAll}
          disabled={busy || pendingFiles.length === 0}
          className="flex items-center gap-2 rounded-xl bg-linear-to-r from-pink-500 to-rose-500 px-5 py-2.5 text-sm font-bold text-white hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 transition"
        >
          {busy
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <Upload className="h-4 w-4" />}
          {busy
            ? 'Uploading…'
            : pendingFiles.length > 0
            ? `Upload ${pendingFiles.length} Image${pendingFiles.length !== 1 ? 's' : ''}`
            : 'All Uploaded'}
        </button>
      </div>
    </ModalWrapper>
  )
}

// ── Shared primitives ─────────────────────────────────────────────────────────

function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
          checked ? 'bg-pink-500' : 'bg-slate-200 dark:bg-slate-700'
        }`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</p>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
    </label>
  )
}

function ModalWrapper({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
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

function ActionBtn({ onClick, title, className, children }) {
  return (
    <button onClick={onClick} title={title} className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${className}`}>
      {children}
    </button>
  )
}

function Pagination({ page, totalPages, onPageChange }) {
  // Build a sliding window of up to 5 page numbers centred on current page
  const MAX = 5
  const half = Math.floor(MAX / 2)
  let start = Math.max(1, page - half)
  let end   = Math.min(totalPages, start + MAX - 1)
  if (end - start + 1 < MAX) start = Math.max(1, end - MAX + 1)

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <div className="flex items-center gap-1">
      <PaginationBtn onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        <ChevronLeft className="h-4 w-4" />
      </PaginationBtn>

      {/* First page + ellipsis */}
      {start > 1 && (
        <>
          <PageBtn n={1} current={page} onClick={onPageChange} />
          {start > 2 && <span className="px-1 text-xs text-slate-400">…</span>}
        </>
      )}

      {pages.map((n) => (
        <PageBtn key={n} n={n} current={page} onClick={onPageChange} />
      ))}

      {/* Ellipsis + last page */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-xs text-slate-400">…</span>}
          <PageBtn n={totalPages} current={page} onClick={onPageChange} />
        </>
      )}

      <PaginationBtn onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
        <ChevronRight className="h-4 w-4" />
      </PaginationBtn>
    </div>
  )
}

function PageBtn({ n, current, onClick }) {
  return (
    <button
      onClick={() => onClick(n)}
      className={`h-8 min-w-8 rounded-lg px-2 text-sm font-medium transition ${
        n === current
          ? 'bg-pink-500 text-white shadow-sm'
          : 'border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
      }`}
    >
      {n}
    </button>
  )
}

function PaginationBtn({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
    >
      {children}
    </button>
  )
}

function TableSkeleton() {
  return Array.from({ length: 6 }).map((_, i) => (
    <tr key={i} className="animate-pulse border-b border-slate-100 dark:border-slate-800">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="space-y-1.5">
            <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-3 w-20 rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      </td>
      {[...Array(5)].map((_, j) => (
        <td key={j} className="px-4 py-3">
          <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
        </td>
      ))}
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          {[...Array(3)].map((_, j) => (
            <div key={j} className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700" />
          ))}
        </div>
      </td>
    </tr>
  ))
}
