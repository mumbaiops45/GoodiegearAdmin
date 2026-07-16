'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useLoginForm } from '@/hooks/useLoginForm'

export default function LoginForm() {
  const { login, isLoading, error, clearError } = useAuth()
  const { fields, fieldErrors, touched, handleChange, handleBlur, handleSubmit } =
    useLoginForm(login)

  // ── Password visibility toggle ──
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">

      {error && (
        <div className="flex items-start justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>
          <button
            type="button"
            onClick={clearError}
            aria-label="Dismiss"
            className="ml-3 mt-0.5 text-lg font-bold leading-none text-red-400 hover:text-red-600"
          >
            &times;
          </button>
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-gray-700">
          Email address
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-pink-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={fields.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            placeholder="admin@goodiegear.com"
            className={[
              'w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-300',
              'focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50',
              touched.email && fieldErrors.email
                ? 'border-red-300 bg-red-50/30 focus:ring-red-100'
                : 'border-gray-200 bg-gray-50/60 focus:border-pink-400 focus:bg-white focus:ring-pink-100',
            ].join(' ')}
          />
        </div>
        {touched.email && fieldErrors.email && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
            <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {fieldErrors.email}
          </p>
        )}
      </div>

      {/* ── Password with Show/Hide Toggle ── */}
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-gray-700">
          Password
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-pink-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </span>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={fields.password}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            placeholder="••••••••"
            className={[
              'w-full rounded-xl border py-3 pl-10 pr-12 text-sm text-gray-800 outline-none transition placeholder:text-gray-300',
              'focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50',
              touched.password && fieldErrors.password
                ? 'border-red-300 bg-red-50/30 focus:ring-red-100'
                : 'border-gray-200 bg-gray-50/60 focus:border-pink-400 focus:bg-white focus:ring-pink-100',
            ].join(' ')}
          />
          {/* Toggle button */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}  // prevents focus interruption
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {touched.password && fieldErrors.password && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
            <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {fieldErrors.password}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-pink-500 to-rose-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-pink-200 transition hover:from-pink-600 hover:to-rose-600 hover:shadow-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
            </svg>
            Signing in…
          </>
        ) : (
          <>
            Sign in to Admin
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
    </form>
  )
}