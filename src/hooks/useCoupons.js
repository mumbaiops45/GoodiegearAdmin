'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCoupon,
} from '@/services/couponService'
import { getErrorMessage } from '@/utils/getErrorMessage'

const EMPTY_FORM = {
  code:         '',
  title:        '',
  description:  '',
  discountType: 'percentage',
  discount:     '',
  minPrice:     '',
  maxDiscount:  '',
  days:         [],
  startTime:    '',
  endTime:      '',
  startDate:    '',
  endDate:      '',
  usageLimit:   '',
  active:       true,
}

const toDateInput = (v) => v ? new Date(v).toISOString().slice(0, 10) : ''

export function useCoupons() {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)

  const [coupons,    setCoupons]    = useState([])
  const [isFetching, setFetching]   = useState(true)
  const [fetchError, setFetchError] = useState(null)

  // filters
  const [search,       setSearch]       = useState('')
  const [filterActive, setFilterActive] = useState('')
  const [filterType,   setFilterType]   = useState('')

  // modal
  const [modalOpen,    setModalOpen]    = useState(false)
  const [editTarget,   setEditTarget]   = useState(null)
  const [formData,     setFormData]     = useState(EMPTY_FORM)
  const [isSubmitting, setSubmitting]   = useState(false)
  const [formError,    setFormError]    = useState(null)

  // delete / toggle
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting,   setDeleting]     = useState(false)
  const [togglingId,   setTogglingId]   = useState(null)

  const [successMsg, setSuccessMsg] = useState(null)

  const handleUnauthorized = useCallback(() => {
    logout()
    router.push('/admin/login')
  }, [logout, router])

  const fetchCoupons = useCallback(async () => {
    setFetching(true)
    setFetchError(null)
    try {
      const token = useAuthStore.getState().token
      const data  = await getCoupons(token)
      const list  = data.coupons ?? data.data ?? (Array.isArray(data) ? data : [])
      setCoupons(list)
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setFetchError(getErrorMessage(err))
    } finally {
      setFetching(false)
    }
  }, [handleUnauthorized])

  useEffect(() => { fetchCoupons() }, [fetchCoupons])

  useEffect(() => {
    if (!successMsg) return
    const t = setTimeout(() => setSuccessMsg(null), 3500)
    return () => clearTimeout(t)
  }, [successMsg])

  // ── Modal helpers ─────────────────────────────────────────────
  const openCreate = () => {
    setEditTarget(null)
    setFormData(EMPTY_FORM)
    setFormError(null)
    setModalOpen(true)
  }

  const openEdit = (coupon) => {
    setEditTarget(coupon)
    setFormData({
      code:         coupon.code         ?? '',
      title:        coupon.title        ?? '',
      description:  coupon.description  ?? '',
      discountType: coupon.discountType ?? 'percentage',
      discount:     coupon.discount     ?? '',
      minPrice:     coupon.minPrice     ?? '',
      maxDiscount:  coupon.maxDiscount  ?? '',
      days:         coupon.days         ?? [],
      startTime:    coupon.startTime    ?? '',
      endTime:      coupon.endTime      ?? '',
      startDate:    toDateInput(coupon.startDate),
      endDate:      toDateInput(coupon.endDate),
      usageLimit:   coupon.usageLimit   ?? '',
      active:       coupon.active       ?? true,
    })
    setFormError(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditTarget(null)
    setFormError(null)
  }

  // ── Submit ────────────────────────────────────────────────────
  const submitForm = useCallback(async () => {
    if (!formData.title.trim()) { setFormError('Title is required.'); return }
    if (formData.discount === '' || Number(formData.discount) < 0) {
      setFormError('A valid discount value is required.')
      return
    }

    const token = useAuthStore.getState().token
    const body = {
      title:        formData.title.trim(),
      description:  formData.description.trim(),
      discountType: formData.discountType,
      discount:     Number(formData.discount),
      minPrice:     formData.minPrice !== '' ? Number(formData.minPrice) : 0,
      maxDiscount:  formData.maxDiscount !== '' ? Number(formData.maxDiscount) : null,
      days:         formData.days,
      startTime:    formData.startTime,
      endTime:      formData.endTime,
      startDate:    formData.startDate || null,
      endDate:      formData.endDate   || null,
      usageLimit:   formData.usageLimit !== '' ? Number(formData.usageLimit) : null,
      active:       formData.active,
    }
    // Only include code if non-empty (let backend auto-generate otherwise)
    if (formData.code.trim()) body.code = formData.code.trim().toUpperCase()

    setSubmitting(true)
    setFormError(null)
    try {
      if (editTarget) {
        await updateCoupon(token, editTarget._id, body)
        setSuccessMsg('Coupon updated successfully.')
      } else {
        await createCoupon(token, body)
        setSuccessMsg('Coupon created successfully.')
      }
      closeModal()
      fetchCoupons()
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setFormError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }, [formData, editTarget, fetchCoupons, handleUnauthorized])

  // ── Delete ────────────────────────────────────────────────────
  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return
    const token = useAuthStore.getState().token
    setDeleting(true)
    try {
      await deleteCoupon(token, deleteTarget._id)
      setSuccessMsg(`Coupon "${deleteTarget.code}" deleted.`)
      fetchCoupons()
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setFetchError(getErrorMessage(err))
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }, [deleteTarget, fetchCoupons, handleUnauthorized])

  // ── Toggle active ─────────────────────────────────────────────
  const handleToggle = useCallback(async (id) => {
    const token = useAuthStore.getState().token
    setTogglingId(id)
    try {
      await toggleCoupon(token, id)
      fetchCoupons()
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setFetchError(getErrorMessage(err))
    } finally {
      setTogglingId(null)
    }
  }, [fetchCoupons, handleUnauthorized])

  // ── Client-side filter ────────────────────────────────────────
  const filtered = coupons.filter((c) => {
    const q = search.toLowerCase()
    const matchSearch =
      !search ||
      (c.code  ?? '').toLowerCase().includes(q) ||
      (c.title ?? '').toLowerCase().includes(q)
    const matchActive =
      filterActive === '' ||
      (filterActive === 'true'  && c.active === true) ||
      (filterActive === 'false' && c.active === false)
    const matchType = !filterType || c.discountType === filterType
    return matchSearch && matchActive && matchType
  })

  return {
    coupons: filtered, allCoupons: coupons,
    isFetching, fetchError,
    search, setSearch,
    filterActive, setFilterActive,
    filterType,   setFilterType,
    modalOpen, editTarget,
    formData, setFormData,
    isSubmitting, formError,
    openCreate, openEdit, closeModal, submitForm,
    deleteTarget, setDeleteTarget,
    isDeleting, confirmDelete,
    togglingId, handleToggle,
    successMsg, refresh: fetchCoupons,
  }
}
