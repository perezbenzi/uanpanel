'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

const loginSchema = z.object({
  email: z.email({ error: 'Enter a valid email' }),
  password: z.string().min(8, { error: 'Minimum 8 characters' }),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginForm) {
    setAuthError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      setAuthError('Incorrect email or password')
      return
    }
    router.push('/dashboard')
  }

  return (
    <div className="w-full max-w-[440px] mx-4">
      <div className="bg-white rounded-[20px] shadow-lg px-8 py-10">
        {/* Logo */}
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

        {/* Tab switcher */}
        <div className="flex gap-1 mb-8 border-b border-[#e4e4e7]">
          <button
            type="button"
            className="pb-2.5 px-1 text-sm font-semibold text-black border-b-2 border-black -mb-px"
          >
            Sign in
          </button>
          <Link
            href="/signup"
            className="pb-2.5 px-1 text-sm font-medium text-[#71717a] border-b-2 border-transparent -mb-px hover:text-black transition-colors"
          >
            Sign up
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-black">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              {...register('email')}
              className="h-[42px] bg-[#fafafa] border border-[#e4e4e7] rounded-[10px] px-3.5 text-sm text-black placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#71717a] transition-colors"
            />
            {errors.email && (
              <p className="text-[13px] text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-black">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[13px] text-[#71717a] hover:text-black transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password')}
              className="h-[42px] bg-[#fafafa] border border-[#e4e4e7] rounded-[10px] px-3.5 text-sm text-black placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#71717a] transition-colors"
            />
            {errors.password && (
              <p className="text-[13px] text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-[42px] w-full bg-black text-white rounded-[10px] text-sm font-semibold hover:bg-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-1"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>

          {/* Auth error */}
          {authError && (
            <p className="text-[13px] text-red-500 text-center -mt-1">{authError}</p>
          )}
        </form>
      </div>
    </div>
  )
}
