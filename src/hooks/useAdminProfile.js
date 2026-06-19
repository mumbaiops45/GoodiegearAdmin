'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/authStore'
import { getAdminProfile, updateAdminProfile } from '@/services/adminProfileService'

export function useAdminProfile() {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)

  const [profile,     setProfile]     = useState(null)
  const [isFetching,  setFetching]    = useState(true)
  const [fetchError,  setFetchError]  = useState(null)

  const [form,        setForm]        = useState({ name: '' })
  const [photoFile,   setPhotoFile]   = useState(null)
  const [photoPreview,setPhotoPreview]= useState(null)
  const fileRef                       = useRef(null)

  const [isSaving,    setSaving]      = useState(false)
  const [saveError,   setSaveError]   = useState(null)
  const [successMsg,  setSuccessMsg]  = useState(null)

  const handleUnauthorized = useCallback(() => {
    logout()
    router.push('/admin/login')
  }, [logout, router])

  const fetchProfile = useCallback(async () => {
    const token = useAuthStore.getState().token
    setFetching(true)
    setFetchError(null)
    try {
      const data = await getAdminProfile(token)
      const p    = data.admin ?? data.user ?? data
      setProfile(p)
      setForm({ name: p.name ?? '' })
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setFetchError(err.message)
    } finally {
      setFetching(false)
    }
  }, [handleUnauthorized])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  useEffect(() => {
    if (!successMsg) return
    const t = setTimeout(() => setSuccessMsg(null), 3500)
    return () => clearTimeout(t)
  }, [successMsg])

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSave = useCallback(async () => {
    const token = useAuthStore.getState().token
    setSaving(true)
    setSaveError(null)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      if (photoFile) fd.append('profilePhoto', photoFile)
      const data = await updateAdminProfile(token, fd)
      const p    = data.admin ?? data.user ?? data
      setProfile(p)
      setForm({ name: p.name ?? form.name })
      useAuthStore.getState().updateUser(p)
      setPhotoFile(null)
      setPhotoPreview(null)
      setSuccessMsg('Profile updated successfully.')
    } catch (err) {
      if (err.status === 401) { handleUnauthorized(); return }
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }, [form.name, photoFile, handleUnauthorized])

  return {
    profile, isFetching, fetchError,
    form, setForm,
    photoFile, photoPreview, fileRef, handlePhotoChange,
    isSaving, saveError, successMsg,
    handleSave,
  }
}
