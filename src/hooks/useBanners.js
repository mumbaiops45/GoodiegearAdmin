'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBanner,
} from '@/services/bannerService'

const EMPTY_FORM = {
  title:     '',
  placement: 'Home Hero',
  active:    true,
}

export function useBanners() {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)

  const [banners,      setBanners]      = useState([])
  const [isFetching,   setFetching]     = useState(true)
  const [fetchError,   setFetchError]   = useState(null)
  const [filterActive, setFilterActive] = useState('')
  const [filterPlace,  setFilterPlace]  = useState('')

  const [modalOpen,    setModalOpen]    = useState(false)
  const [editTarget,   setEditTarget]   = useState(null)
  const [formData,     setFormData]     = useState(EMPTY_FORM)
  const [imageFile,    setImageFile]    = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setSubmitting]   = useState(false)
  const [formError,    setFormError]    = useState(null)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting,   setDeleting]     = useState(false)
  const [togglingId,   setTogglingId]   = useState(null)
  const [successMsg,   setSuccessMsg]   = useState(null)

  const handleUnauthorized = useCallback(() => {
    logout()
    router.push('/admin/login')
  }, [logout, router])

  const fetchBanners = useCallback(async () => {
    setFetching(true)
    setFetchError(null)
    try {
      const data = await getBanners()
      const list = data.banners ?? data.data ?? (Array.isArray(data) ? data : [])
      setBanners(list)
    } catch (err) {
      setFetchError(err.message)
    } finally {
      setFetching(false)
    }
  }, [])

  useEffect(() => { fetchBanners() }, [fetchBanners])

  useEffect(() => {
    if (!successMsg) return
    const t = setTimeout(() => setSuccessMsg(null), 3500)
    return () => clearTimeout(t)
  }, [successMsg])

  // ── Modal helpers ─────────────────────────────────────────────
  const openCreate = () => {
    setEditTarget(null)
    setFormData(EMPTY_FORM)
    setImageFile(null)
    setImagePreview(null)
    setFormError(null)
    setModalOpen(true)
  }

  const openEdit = (banner) => {
    setEditTarget(banner)
    setFormData({
      title:     banner.title     ?? '',
      placement: banner.placement ?? 'Home Hero',
      active:    banner.active    ?? true,
    })
    setImageFile(null)
    setImagePreview(null)
    setFormError(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditTarget(null)
    setFormError(null)
    setImageFile(null)
    setImagePreview(null)
  }

  const pickImage = (file) => {
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  // ── Submit create / edit ──────────────────────────────────────
  const submitForm = async () => {
    if (!formData.title.trim()) { setFormError('Title is required.'); return }
    if (!editTarget && !imageFile) { setFormError('Please select a banner image.'); return }

    const token = useAuthStore.getState().token
    const fd = new FormData()
    fd.append('title', formData.title)
    fd.append('placement', formData.placement)
    fd.append('active', formData.active)
    if (imageFile) fd.append('image', imageFile)

    setSubmitting(true)
    setFormError(null)
    try {
      if (editTarget) {
        await updateBanner(token, editTarget._id, fd)
        setSuccessMsg('Banner updated successfully.')
      } else {
        await createBanner(token, fd)
        setSuccessMsg('Banner created successfully.')
      }
      closeModal()
      fetchBanners()
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Delete ────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return
    const token = useAuthStore.getState().token
    setDeleting(true)
    try {
      await deleteBanner(token, deleteTarget._id)
      setSuccessMsg(`"${deleteTarget.title}" deleted.`)
      fetchBanners()
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setFetchError(err.message)
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  // ── Toggle active ─────────────────────────────────────────────
  const handleToggle = useCallback(async (id) => {
    const token = useAuthStore.getState().token
    setTogglingId(id)
    try {
      await toggleBanner(token, id)
      fetchBanners()
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setFetchError(err.message)
    } finally {
      setTogglingId(null)
    }
  }, [fetchBanners, handleUnauthorized])

  // client-side filter
  const filtered = banners.filter((b) => {
    const matchActive =
      filterActive === '' ||
      (filterActive === 'true'  && b.active === true) ||
      (filterActive === 'false' && b.active === false)
    const matchPlace = !filterPlace || b.placement === filterPlace
    return matchActive && matchPlace
  })

  const placements = [...new Set(banners.map((b) => b.placement).filter(Boolean))]

  return {
    banners: filtered, allBanners: banners, total: banners.length,
    isFetching, fetchError,
    filterActive, setFilterActive,
    filterPlace, setFilterPlace,
    placements,
    modalOpen, editTarget,
    formData, setFormData,
    imageFile, imagePreview, pickImage,
    isSubmitting, formError,
    openCreate, openEdit, closeModal, submitForm,
    deleteTarget, setDeleteTarget,
    isDeleting, confirmDelete,
    togglingId, handleToggle,
    successMsg, refresh: fetchBanners,
  }
}
