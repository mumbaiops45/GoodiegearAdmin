'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from '@/services/productService'
import { getCategories } from '@/services/categoryService'
import { getAllVendors } from '@/services/vendorService'

const LIMIT = 10

const EMPTY_FORM = {
  vendor:        '',
  title:         '',
  description:   '',
  price:         '',
  discountPrice: '',
  stock:         '',
  category:      '',
  brand:         '',
  age:           '',
  isFeatured:    false,
  isActive:      true,
}

export function useProducts() {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)

  // ── list state ───────────────────────────────────────────────
  const [products,     setProducts]     = useState([])
  const [total,        setTotal]        = useState(0)
  const [page,         setPage]         = useState(1)
  const [search,       setSearch]       = useState('')
  const [filterCat,    setFilterCat]    = useState('')
  const [filterActive, setFilterActive] = useState('')
  const [isFetching,   setFetching]     = useState(true)
  const [fetchError,   setFetchError]   = useState(null)

  // ── modal / form state ───────────────────────────────────────
  const [modalOpen,    setModalOpen]    = useState(false)
  const [editTarget,   setEditTarget]   = useState(null)
  const [formData,     setFormData]     = useState(EMPTY_FORM)
  const [isSubmitting, setSubmitting]   = useState(false)
  const [formError,    setFormError]    = useState(null)

  // ── queued image files (selected inside the form before submit) ──
  const [imageFiles, setImageFiles] = useState([]) // [{ id, file, preview }]

  // ── delete state ─────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting,   setDeleting]     = useState(false)

  // ── standalone upload modal ───────────────────────────────────
  const [uploadTarget, setUploadTarget] = useState(null)

  // ── category list ─────────────────────────────────────────────
  const [categoryList, setCategoryList] = useState([])

  useEffect(() => {
    getCategories()
      .then((data) => {
        const list = data.categories ?? data.data ?? (Array.isArray(data) ? data : [])
        setCategoryList(list)
      })
      .catch(() => {})
  }, [])

  // ── vendor list (for product form dropdown) ───────────────────
  const [vendorList, setVendorList] = useState([])

  useEffect(() => {
    const token = useAuthStore.getState().token
    if (!token) return
    getAllVendors(token)
      .then((data) => {
        const list = data.vendors ?? data.data ?? (Array.isArray(data) ? data : [])
        const approved = list.filter((v) => v.isApproved === true)
        setVendorList(approved)
      })
      .catch(() => {})
  }, [])

  // ── success toast ────────────────────────────────────────────
  const [successMsg, setSuccessMsg] = useState(null)

  const handleUnauthorized = useCallback(() => {
    logout()
    router.push('/admin/login')
  }, [logout, router])

  // ── fetch ────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setFetching(true)
    setFetchError(null)
    try {
      const token = useAuthStore.getState().token
      const data = await getProducts({
        page, limit: LIMIT,
        search, category: filterCat,
        isActive: filterActive,
      }, token)

      // Handle nested shape: { data: { products: [...], total: N } }
      const inner = (data.data && !Array.isArray(data.data)) ? data.data : data

      const list = (
        inner.products ??
        inner.items ??
        (Array.isArray(inner.data) ? inner.data : null) ??
        (Array.isArray(inner) ? inner : [])
      )

      // Try every common field name backends use for total record count
      const count = (
        inner.total ??
        inner.totalProducts ??
        inner.totalCount ??
        inner.totalItems ??
        inner.pagination?.total ??
        data.total ??
        data.totalProducts ??
        data.count ??
        list.length
      )

      setProducts(list)
      setTotal(count)
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setFetchError(err.message)
    } finally {
      setFetching(false)
    }
  }, [page, search, filterCat, filterActive, handleUnauthorized])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // ── image file queue helpers ──────────────────────────────────
  const addImageFiles = useCallback((files) => {
    const items = Array.from(files).map((file) => ({
      id:      Math.random().toString(36).slice(2),
      file,
      preview: URL.createObjectURL(file),
    }))
    setImageFiles((prev) => [...prev, ...items])
  }, [])

  const removeImageFile = useCallback((id) => {
    setImageFiles((prev) => {
      const item = prev.find((x) => x.id === id)
      if (item) URL.revokeObjectURL(item.preview)
      return prev.filter((x) => x.id !== id)
    })
  }, [])

  const clearImageFiles = useCallback(() => {
    setImageFiles((prev) => { prev.forEach((x) => URL.revokeObjectURL(x.preview)); return [] })
  }, [])

  // ── modal helpers ────────────────────────────────────────────
  const openCreate = () => {
    setEditTarget(null)
    setFormData(EMPTY_FORM)
    setFormError(null)
    clearImageFiles()
    setModalOpen(true)
  }

  const openEdit = (product) => {
    setEditTarget(product)
    setFormData({
      vendor:        product.vendor?._id ?? product.vendor ?? '',
      title:         product.title         ?? '',
      description:   product.description   ?? '',
      price:         product.price         ?? '',
      discountPrice: product.discountPrice  ?? '',
      stock:         product.stock         ?? '',
      category:      product.category      ?? '',
      brand:         product.brand         ?? '',
      age:           product.age           ?? '',
      isFeatured:    product.isFeatured    ?? false,
      isActive:      product.isActive      ?? true,
    })
    setFormError(null)
    clearImageFiles()
    setModalOpen(true)
  }

  const closeModal = () => {
    clearImageFiles()
    setModalOpen(false)
    setEditTarget(null)
    setFormError(null)
  }

  // ── submit (create or update, then upload queued images) ──────
  const submitForm = useCallback(async () => {
    const token = useAuthStore.getState().token
    setSubmitting(true)
    setFormError(null)
    try {
      const payload = {
        vendor:        formData.vendor,
        title:         formData.title,
        description:   formData.description,
        price:         Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : 0,
        stock:         Number(formData.stock),
        category:      formData.category,
        brand:         formData.brand,
        age:           formData.age ? Number(formData.age) : 0,
        isFeatured:    formData.isFeatured,
        isActive:      formData.isActive,
      }

      let productId = editTarget?._id

      if (editTarget) {
        await updateProduct(token, productId, payload)
      } else {
        const res = await createProduct(token, payload)
        // normalise: backend may return { product: {...} } or { data: {...} } or the object directly
        productId = res.product?._id ?? res.data?._id ?? res._id
      }

      // Upload any images queued inside the form
      if (imageFiles.length > 0 && productId) {
        for (const item of imageFiles) {
          try { await uploadProductImage(token, productId, item.file) } catch (_) { /* non-fatal */ }
        }
      }

      setSuccessMsg(editTarget ? 'Product updated successfully' : 'Product created successfully')
      closeModal()
      fetchProducts()
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }, [formData, editTarget, imageFiles, fetchProducts, handleUnauthorized])

  // ── delete ───────────────────────────────────────────────────
  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return
    const token = useAuthStore.getState().token
    setDeleting(true)
    try {
      await deleteProduct(token, deleteTarget._id)
      setSuccessMsg('Product deleted')
      setDeleteTarget(null)
      fetchProducts()
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setFetchError(err.message)
    } finally {
      setDeleting(false)
    }
  }, [deleteTarget, fetchProducts, handleUnauthorized])

  // Called by the standalone ImageUploadModal
  const onUploadDone = useCallback((count) => {
    setUploadTarget(null)
    setSuccessMsg(`${count} image${count !== 1 ? 's' : ''} uploaded successfully`)
    fetchProducts()
  }, [fetchProducts])

  // auto-dismiss success
  useEffect(() => {
    if (!successMsg) return
    const t = setTimeout(() => setSuccessMsg(null), 3500)
    return () => clearTimeout(t)
  }, [successMsg])

  const totalPages = Math.max(1, Math.ceil(total / LIMIT))

  return {
    products, total, totalPages, page, setPage,
    search, setSearch, filterCat, setFilterCat, filterActive, setFilterActive,
    isFetching, fetchError, categoryList, vendorList,
    modalOpen, openCreate, openEdit, closeModal,
    editTarget, formData, setFormData, isSubmitting, formError, submitForm,
    imageFiles, addImageFiles, removeImageFile,
    deleteTarget, setDeleteTarget, isDeleting, confirmDelete,
    uploadTarget, setUploadTarget, onUploadDone,
    successMsg,
  }
}
