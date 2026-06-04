'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const INPUT_CLASS =
  'h-[42px] bg-[#fafafa] border border-[#e4e4e7] rounded-[10px] px-3.5 text-sm text-black placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#71717a] transition-colors'

function Logo() {
  return (
    <div className="flex items-center gap-2.5 mb-8">
      <div className="w-[30px] h-[30px] bg-black rounded-[6px] flex items-center justify-center flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="6" height="6" rx="1" fill="white" />
          <rect x="9" y="1" width="6" height="6" rx="1" fill="white" />
          <rect x="1" y="9" width="6" height="6" rx="1" fill="white" />
          <rect x="9" y="9" width="6" height="6" rx="1" fill="white" />
        </svg>
      </div>
      <span className="font-semibold text-[15px] text-black">AdminPanel</span>
    </div>
  )
}

function BackLink() {
  return (
    <Link
      href="/login"
      className="block text-center text-[13px] text-[#71717a] hover:text-black transition-colors mt-4"
    >
      ← Back to sign in
    </Link>
  )
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const supabase = createClient()
    const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setSubmitting(false)

    if (supabaseError) {
      setError(supabaseError.message)
      return
    }

    setSent(true)
  }

  return (
    <div className="w-full max-w-[440px] mx-4">
      <div className="bg-white rounded-[20px] shadow-lg px-8 py-10">
        <Logo />

        {sent ? (
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-[52px] h-[52px] bg-[#f0fdf4] border border-[#bbf7d0] rounded-full flex items-center justify-center mb-1">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h1 className="text-[20px] font-semibold text-black">Check your inbox</h1>
            <p className="text-[13px] text-[#71717a]">We sent a reset link to {email}</p>
            <BackLink />
          </div>
        ) : (
          <>
            <h1 className="text-[20px] font-semibold text-black mb-1.5">Reset password</h1>
            <p className="text-[13px] text-[#71717a] mb-6">
              Enter your email and we&apos;ll send you a reset link
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-black">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={INPUT_CLASS}
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !email}
                className="h-[42px] w-full bg-black text-white rounded-[10px] text-sm font-semibold hover:bg-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Sending...' : 'Send reset link'}
              </button>

              {error && (
                <p className="text-[13px] text-red-500 text-center -mt-1">{error}</p>
              )}
            </form>

            <BackLink />
          </>
        )}
      </div>
    </div>
  )
}
