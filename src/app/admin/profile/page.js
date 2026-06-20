'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera, Mail, User, Lock, CheckCircle2, AlertCircle, Loader2, Shield } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'

export default function ProfilePage() {
  const { profile, isFetching, isUpdating, error, updateProfile } = useProfile()

  if (isFetching) return <ProfileSkeleton />

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-xl font-black text-slate-800">Profile Settings</h1>
        <p className="text-sm text-slate-400">Manage your account information and security</p>
      </div>

      {error && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ProfileCard profile={profile} isUpdating={isUpdating} onUpdate={updateProfile} />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <InfoForm     profile={profile} isUpdating={isUpdating} onUpdate={updateProfile} />
          <PasswordForm                   isUpdating={isUpdating} onUpdate={updateProfile} />
        </div>
      </div>
    </div>
  )
}

// ── Inline alert ──────────────────────────────────────────────────────────────

function InlineAlert({ type, message, onDismiss }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [message, onDismiss])

  if (!message) return null
  const isSuccess = type === 'success'
  return (
    <div className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium ${
      isSuccess ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'
    }`}>
      {isSuccess ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
      {message}
    </div>
  )
}

// ── Profile card ──────────────────────────────────────────────────────────────

function ProfileCard({ profile, isUpdating, onUpdate }) {
  const fileRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [file,    setFile]    = useState(null)
  const [status,  setStatus]  = useState(null)

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handlePhotoSave = async () => {
    if (!file) return
    const fd = new FormData()
    fd.append('name', profile?.name ?? '')
    fd.append('profilePhoto', file)
    const result = await onUpdate(fd)
    if (result?.ok) {
      setStatus({ type: 'success', message: result.message })
      setFile(null)
      setPreview(null)
    } else {
      setStatus({ type: 'error', message: result?.message ?? 'Photo update failed' })
    }
  }

  const cancelPreview = () => {
    setFile(null)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const avatarSrc = preview ?? profile?.profilePhoto ?? null
  const initials  = profile?.name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) ?? 'A'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <div className="relative mx-auto mb-4 h-24 w-24">
        {avatarSrc ? (
          <img src={avatarSrc} alt="Profile" className="h-24 w-24 rounded-full object-cover ring-4 ring-pink-100" />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-pink-400 to-rose-500 text-2xl font-black text-white ring-4 ring-pink-100">
            {initials}
          </div>
        )}
        <button
          onClick={() => fileRef.current?.click()}
          className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-pink-500 text-white shadow transition hover:bg-pink-600"
        >
          <Camera className="h-3.5 w-3.5" />
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      <h2 className="text-lg font-bold text-slate-900">{profile?.name ?? '—'}</h2>
      <p className="mt-0.5 text-sm text-slate-500">{profile?.email ?? '—'}</p>
      <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold text-pink-700">
        <Shield className="h-3 w-3" /> {profile?.role ?? 'admin'}
      </span>

      {status && (
        <div className="mt-4">
          <InlineAlert type={status.type} message={status.message} onDismiss={() => setStatus(null)} />
        </div>
      )}

      {file ? (
        <div className="mt-4 flex gap-2">
          <button
            onClick={cancelPreview}
            className="flex-1 rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePhotoSave}
            disabled={isUpdating}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-pink-500 py-2 text-sm font-semibold text-white hover:bg-pink-600 disabled:opacity-60"
          >
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
            Save Photo
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          className="mt-4 w-full rounded-xl border border-dashed border-pink-300 py-2 text-sm font-medium text-pink-500 transition hover:border-pink-400 hover:bg-pink-50"
        >
          Change Photo
        </button>
      )}
    </div>
  )
}

// ── Personal info form ────────────────────────────────────────────────────────

function InfoForm({ profile, isUpdating, onUpdate }) {
  const [name,   setName]   = useState(profile?.name  ?? '')
  const [email,  setEmail]  = useState(profile?.email ?? '')
  const [status, setStatus] = useState(null)

  useEffect(() => {
    setName(profile?.name  ?? '')
    setEmail(profile?.email ?? '')
  }, [profile])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim())  { setStatus({ type: 'error', message: 'Full name is required.' }); return }
    if (!email.trim()) { setStatus({ type: 'error', message: 'Email address is required.' }); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus({ type: 'error', message: 'Please enter a valid email address.' }); return }
    const result = await onUpdate({ name, email })
    setStatus(result?.ok
      ? { type: 'success', message: result.message }
      : { type: 'error',   message: result?.message ?? 'Failed to save information' }
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <User className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
          <p className="text-xs text-slate-400">Update your name and email address</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField id="name"  label="Full name"      type="text"  value={name}  onChange={(e) => setName(e.target.value)}  placeholder="Super Admin"          icon={<User className="h-4 w-4" />} required />
        <FormField id="email" label="Email address"  type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@goodiegear.com" icon={<Mail className="h-4 w-4" />} required />
        <InlineAlert type={status?.type} message={status?.message} onDismiss={() => setStatus(null)} />
        <SaveButton loading={isUpdating} label="Save Information" />
      </form>
    </div>
  )
}

// ── Password form ─────────────────────────────────────────────────────────────

function PasswordForm({ isUpdating, onUpdate }) {
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [mismatch, setMismatch] = useState(false)
  const [status,   setStatus]   = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password) { setStatus({ type: 'error', message: 'New password is required.' }); return }
    if (password.length < 8) { setStatus({ type: 'error', message: 'Password must be at least 8 characters.' }); return }
    if (password !== confirm) { setMismatch(true); return }
    setMismatch(false)
    const result = await onUpdate({ password })
    if (result?.ok) {
      setStatus({ type: 'success', message: result.message })
      setPassword('')
      setConfirm('')
    } else {
      setStatus({ type: 'error', message: result?.message ?? 'Failed to update password' })
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
          <Lock className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Change Password</h3>
          <p className="text-xs text-slate-400">Use a strong password with letters, numbers &amp; symbols</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField id="new-password"     label="New password"          type="password" value={password} onChange={(e) => { setPassword(e.target.value); setMismatch(false) }} placeholder="Min. 8 characters" icon={<Lock className="h-4 w-4" />} required minLength={8} />
        <FormField id="confirm-password" label="Confirm new password"  type="password" value={confirm}  onChange={(e) => { setConfirm(e.target.value);  setMismatch(false) }} placeholder="Repeat password"   icon={<Lock className="h-4 w-4" />} required error={mismatch ? 'Passwords do not match' : null} />
        {password && <PasswordStrength password={password} />}
        <InlineAlert type={status?.type} message={status?.message} onDismiss={() => setStatus(null)} />
        <SaveButton loading={isUpdating} label="Update Password" />
      </form>
    </div>
  )
}

// ── Shared primitives ─────────────────────────────────────────────────────────

function FormField({ id, label, icon, error, ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400">
          {icon}
        </span>
        <input
          id={id}
          className={[
            'w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-300 focus:ring-2',
            error
              ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-100'
              : 'border-slate-200 bg-slate-50/60 focus:border-pink-400 focus:bg-white focus:ring-pink-100',
          ].join(' ')}
          {...inputProps}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  )
}

function SaveButton({ loading, label }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex items-center gap-2 rounded-xl bg-linear-to-r from-pink-500 to-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-pink-200 transition hover:from-pink-600 hover:to-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
      {label}
    </button>
  )
}

function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ characters',     pass: password.length >= 8          },
    { label: 'Uppercase letter',  pass: /[A-Z]/.test(password)        },
    { label: 'Number',            pass: /[0-9]/.test(password)        },
    { label: 'Special character', pass: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter((c) => c.pass).length
  const bar   = ['bg-red-400', 'bg-amber-400', 'bg-yellow-400', 'bg-green-400'][score - 1] ?? 'bg-slate-200'

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="mb-2 flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= score ? bar : 'bg-slate-200'}`} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {checks.map((c) => (
          <p key={c.label} className={`flex items-center gap-1.5 text-xs ${c.pass ? 'text-green-600' : 'text-slate-400'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${c.pass ? 'bg-green-500' : 'bg-slate-300'}`} />
            {c.label}
          </p>
        ))}
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse">
      <div className="mb-6 h-8 w-48 rounded-lg bg-slate-200" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-72 rounded-2xl bg-slate-100" />
        <div className="space-y-6 lg:col-span-2">
          <div className="h-52 rounded-2xl bg-slate-100" />
          <div className="h-64 rounded-2xl bg-slate-100" />
        </div>
      </div>
    </div>
  )
}
