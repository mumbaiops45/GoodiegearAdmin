import LoginForm from '@/components/admin/LoginForm';
import {
  Mail,
  LockKeyhole,
} from "lucide-react";

export const metadata = {
  title: 'Admin Login — GoodieGear',
  description: 'Sign in to the GoodieGear admin panel',
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen bg-white">

      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col items-center justify-center overflow-hidden bg-linear-to-br from-pink-400 via-rose-400 to-pink-600 px-12">

        {/* soft glow blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-rose-700/20 blur-3xl" />

        {/* floating decoration: top-right bag */}
        <div className="absolute top-10 right-10 opacity-20 rotate-12">
          <ShoppingBagIcon size={90} />
        </div>

        {/* floating decoration: bottom-left bag */}
        <div className="absolute bottom-16 left-8 opacity-15 -rotate-12">
          <ShoppingBagIcon size={70} />
        </div>

        {/* floating decoration: stars / sparkles */}
        <SparkleIcon className="absolute top-1/4 left-10 opacity-30 text-white" size={28} />
        <SparkleIcon className="absolute top-1/3 right-16 opacity-25 text-white" size={20} />
        <SparkleIcon className="absolute bottom-1/3 left-1/3 opacity-20 text-white" size={16} />
        <SparkleIcon className="absolute top-16 left-1/3 opacity-30 text-white" size={14} />

        {/* floating decoration: gear cogs */}
        <GearIcon className="absolute bottom-24 right-12 opacity-20 text-white animate-[spin_18s_linear_infinite]" size={64} />
        <GearIcon className="absolute top-20 left-20 opacity-15 text-white animate-[spin_24s_linear_infinite_reverse]" size={44} />

        {/* floating decoration: small circles / dots */}
        <div className="absolute top-1/2 right-8 flex flex-col gap-2 opacity-25">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-2 w-2 rounded-full bg-white" />
          ))}
        </div>
        <div className="absolute bottom-40 left-16 flex gap-2 opacity-20">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-2 w-2 rounded-full bg-white" />
          ))}
        </div>

        {/* main panel content */}
        <div className="relative z-10 text-center text-white">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 shadow-xl backdrop-blur-sm ring-2 ring-white/30">
            <span className="text-5xl font-black text-white">G</span>
          </div>
          <h2 className="text-4xl font-black tracking-tight">GoodieGear</h2>
          <p className="mt-3 text-lg font-medium text-pink-100">Your ultimate gear destination</p>

          <div className="mt-10 grid grid-cols-2 gap-4 text-left">
            {[
              { icon: '📦', label: 'Orders', value: 'Manage' },
              { icon: '👕', label: 'Products', value: 'Catalog' },
              { icon: '👥', label: 'Customers', value: 'Database' },
              { icon: '📊', label: 'Analytics', value: 'Reports' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm ring-1 ring-white/20">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-pink-200 uppercase tracking-wide">{item.label}</p>
                  <p className="text-sm font-bold text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* wave divider on the right edge */}
        <svg
          className="absolute right-0 top-0 h-full w-12 text-white"
          viewBox="0 0 48 800"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M48 0 C20 200, 40 400, 20 600 C10 700, 30 750, 48 800 L48 0Z" />
        </svg>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12 lg:px-16">

        {/* mobile-only brand */}
        <div className="mb-8 flex flex-col items-center lg:hidden">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-pink-400 to-rose-500 shadow-lg mb-3">
            <span className="text-2xl font-black text-white">G</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">
            Goodie<span className="text-pink-500">Gear</span>
          </h1>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900">Welcome back</h2>
            <p className="mt-1 text-sm text-gray-400">Sign in to your admin account</p>
          </div>

          <LoginForm />

          <div className="mt-6 rounded-xl border border-pink-100 bg-pink-50/70 px-4 py-3.5">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-pink-500 uppercase tracking-wide">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Admin Credentials
            </p>
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-400 font-medium">Email</span>
                <span className="font-mono font-semibold text-gray-800">admin@gudigere.com</span>
              </div>
              <div className="h-px bg-pink-100" />
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-400 font-medium">Password</span>
                <span className="font-mono font-semibold text-gray-800">Admin@123</span>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-300">
            &copy; {new Date().getFullYear()} GoodieGear. All rights reserved.
          </p>
        </div>
      </div>

    </main>
  )
}

/* ── inline SVG icon helpers ──────────────────────────────── */

function ShoppingBagIcon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 24V18a12 12 0 0124 0v6h6l4 32H10L14 24h6zm4 0h16v-6a8 8 0 00-16 0v6z" />
    </svg>
  )
}

function SparkleIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2l1.6 5.4H19l-4.5 3.3 1.7 5.3L12 13l-4.2 3 1.7-5.3L5 7.4h5.4L12 2z" />
    </svg>
  )
}

function GearIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 15.5A3.5 3.5 0 018.5 12 3.5 3.5 0 0112 8.5a3.5 3.5 0 013.5 3.5 3.5 3.5 0 01-3.5 3.5m7.43-2.92c.04-.34.07-.68.07-1.08s-.03-.74-.07-1.08l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.34-.07.69-.07 1.08s.03.74.07 1.08l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65z" />
    </svg>
  )
}