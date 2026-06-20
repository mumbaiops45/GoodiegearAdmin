'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/services/categoryService'
import { getErrorMessage } from '@/utils/getErrorMessage'

const EMPTY_FORM = {
  name:         '',
  description:  '',
  imageFile:    null,   // File object selected from disk
  imagePreview: null,   // local blob URL for preview
  existingImage: '',    // original URL from backend (kept when no new file chosen)
}

export function useCategories() {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)

  // ── list state ───────────────────────────────────────────────
  const [categories,  setCategories]  = useState([])
  const [isFetching,  setFetching]    = useState(true)
  const [fetchError,  setFetchError]  = useState(null)
  const [search,      setSearch]      = useState('')

  // ── modal / form state ───────────────────────────────────────
  const [modalOpen,    setModalOpen]    = useState(false)
  const [editTarget,   setEditTarget]   = useState(null)
  const [formData,     setFormData]     = useState(EMPTY_FORM)
  const [isSubmitting, setSubmitting]   = useState(false)
  const [formError,    setFormError]    = useState(null)

  // ── delete state ─────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting,   setDeleting]     = useState(false)

  // ── success message ───────────────────────────────────────────
  const [successMsg, setSuccessMsg] = useState(null)

  const handleUnauthorized = useCallback(() => {
    logout()
    router.push('/admin/login')
  }, [logout, router])

  // ── fetch all ────────────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    setFetching(true)
    setFetchError(null)
    try {
      const data = await getCategories()
      const list = data.categories ?? data.data ?? (Array.isArray(data) ? data : [])
      setCategories(list)
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setFetchError(getErrorMessage(err))
    } finally {
      setFetching(false)
    }
  }, [handleUnauthorized])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  // ── file pick handler (called from the form UI) ───────────────
  const handleImagePick = useCallback((file) => {
    if (!file) return
    // Revoke previous blob URL to avoid memory leak
    if (formData.imagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(formData.imagePreview)
    }
    setFormData((prev) => ({
      ...prev,
      imageFile:    file,
      imagePreview: URL.createObjectURL(file),
    }))
  }, [formData.imagePreview])

  // Revoke blob URL when modal closes
  const revokePreview = useCallback(() => {
    if (formData.imagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(formData.imagePreview)
    }
  }, [formData.imagePreview])

  // ── modal helpers ────────────────────────────────────────────
  const openCreate = () => {
    setEditTarget(null)
    setFormData(EMPTY_FORM)
    setFormError(null)
    setModalOpen(true)
  }

  const openEdit = (cat) => {
    setEditTarget(cat)
    setFormData({
      name:          cat.name          ?? '',
      description:   cat.description   ?? '',
      imageFile:     null,
      imagePreview:  null,
      existingImage: cat.image         ?? '',
    })
    setFormError(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    revokePreview()
    setModalOpen(false)
    setEditTarget(null)
    setFormError(null)
  }

  // ── submit ───────────────────────────────────────────────────
  const submitForm = useCallback(async () => {
    if (!formData.name.trim()) { setFormError('Category name is required.'); return }

    const token = useAuthStore.getState().token
    setSubmitting(true)
    setFormError(null)
    try {
      // Always send as FormData so the backend (multer) can handle the file
      const fd = new FormData()
      fd.append('name',        formData.name.trim())
      fd.append('description', formData.description)
      if (formData.imageFile) {
        fd.append('image', formData.imageFile)          // new file upload
      } else if (formData.existingImage) {
        fd.append('image', formData.existingImage)      // keep existing URL
      }

      if (editTarget) {
        await updateCategory(token, editTarget._id, fd)
        setSuccessMsg('Category updated successfully')
      } else {
        await createCategory(token, fd)
        setSuccessMsg('Category created successfully')
      }
      closeModal()
      fetchCategories()
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setFormError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }, [formData, editTarget, fetchCategories, handleUnauthorized])

  // ── delete ───────────────────────────────────────────────────
  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return
    const token = useAuthStore.getState().token
    setDeleting(true)
    try {
      await deleteCategory(token, deleteTarget._id)
      setSuccessMsg('Category deleted')
      setDeleteTarget(null)
      fetchCategories()
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setFetchError(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }, [deleteTarget, fetchCategories, handleUnauthorized])

  // auto-dismiss success
  useEffect(() => {
    if (!successMsg) return
    const t = setTimeout(() => setSuccessMsg(null), 3500)
    return () => clearTimeout(t)
  }, [successMsg])

  const filtered = categories.filter((cat) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (cat.name        ?? '').toLowerCase().includes(q) ||
      (cat.description ?? '').toLowerCase().includes(q)
    )
  })

  return {
    categories: filtered, allCategories: categories, isFetching, fetchError,
    search, setSearch,
    modalOpen, openCreate, openEdit, closeModal,
    editTarget, formData, setFormData, handleImagePick,
    isSubmitting, formError, submitForm,
    deleteTarget, setDeleteTarget, isDeleting, confirmDelete,
    successMsg,
  }
}
