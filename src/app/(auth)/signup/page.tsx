'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

const signupSchema = z.object({
  inviteCode: z.string().min(8, { error: 'El código debe tener al menos 8 caracteres' }),
  firstName: z.string().min(1, { error: 'Requerido' }),
  lastName: z.string().min(1, { error: 'Requerido' }),
  email: z.email({ error: 'Ingresá un email válido' }),
  password: z.string().min(8, { error: 'Mínimo 8 caracteres' }),
  terms: z.boolean().refine((v) => v === true, { error: 'Debés aceptar los términos' }),
})

type SignupForm = z.infer<typeof signupSchema>

const steps = [
  { label: 'Invitación' },
  { label: 'Tu cuenta' },
  { label: 'Listo' },
]

export default function SignupPage() {
  const router = useRouter()
  const [authError, setAuthError] = useState<string | null>(null)
  const [inviteCodeValue, setInviteCodeValue] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) })

  function handleInviteCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const upper = e.target.value.toUpperCase()
    setInviteCodeValue(upper)
    setValue('inviteCode', upper, { shouldValidate: true })
  }

  const isCodeValid = inviteCodeValue.length >= 8

  async function onSubmit(data: SignupForm) {
    setAuthError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
        },
      },
    })
    if (error) {
      setAuthError(error.message)
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
          <Link
            href="/login"
            className="pb-2.5 px-1 text-sm font-medium text-[#71717a] border-b-2 border-transparent -mb-px hover:text-black transition-colors"
          >
            Iniciar sesión
          </Link>
          <button
            type="button"
            className="pb-2.5 px-1 text-sm font-semibold text-black border-b-2 border-black -mb-px"
          >
            Registrarse
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-8">
          {steps.map((step, idx) => {
            const stepNum = idx + 1
            const isDone = stepNum < 2
            const isActive = stepNum === 2
            return (
              <div key={step.label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={[
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0',
                      isDone
                        ? 'bg-green-500 text-white'
                        : isActive
                          ? 'bg-black text-white'
                          : 'bg-[#e4e4e7] text-[#71717a]',
                    ].join(' ')}
                  >
                    {isDone ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      stepNum
                    )}
                  </div>
                  <span
                    className={[
                      'text-[11px] font-medium whitespace-nowrap',
                      isActive ? 'text-black' : 'text-[#a1a1aa]',
                    ].join(' ')}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-px bg-[#e4e4e7] mx-2 mb-4" />
                )}
              </div>
            )
          })}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
          {/* Invitation code */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="inviteCode" className="text-sm font-medium text-black">
              Código de invitación
            </label>
            <div className="relative">
              <input
                id="inviteCode"
                type="text"
                placeholder="XXXXXXXX"
                value={inviteCodeValue}
                onChange={handleInviteCodeChange}
                className="h-[42px] w-full bg-[#fafafa] border border-[#e4e4e7] rounded-[10px] px-3.5 pr-20 text-sm text-black placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#71717a] transition-colors uppercase tracking-widest"
              />
              {isCodeValid && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-green-50 text-green-600 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-green-200">
                  Válido
                </span>
              )}
            </div>
            {errors.inviteCode && (
              <p className="text-[13px] text-red-500">{errors.inviteCode.message}</p>
            )}
          </div>

          {/* Name grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="firstName" className="text-sm font-medium text-black">
                Nombre
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="Juan"
                {...register('firstName')}
                className="h-[42px] bg-[#fafafa] border border-[#e4e4e7] rounded-[10px] px-3.5 text-sm text-black placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#71717a] transition-colors"
              />
              {errors.firstName && (
                <p className="text-[13px] text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lastName" className="text-sm font-medium text-black">
                Apellido
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="García"
                {...register('lastName')}
                className="h-[42px] bg-[#fafafa] border border-[#e4e4e7] rounded-[10px] px-3.5 text-sm text-black placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#71717a] transition-colors"
              />
              {errors.lastName && (
                <p className="text-[13px] text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-black">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              {...register('email')}
              className="h-[42px] bg-[#fafafa] border border-[#e4e4e7] rounded-[10px] px-3.5 text-sm text-black placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#71717a] transition-colors"
            />
            {errors.email && (
              <p className="text-[13px] text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-black">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              {...register('password')}
              className="h-[42px] bg-[#fafafa] border border-[#e4e4e7] rounded-[10px] px-3.5 text-sm text-black placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#71717a] transition-colors"
            />
            <p className="text-[12px] text-[#a1a1aa]">Mínimo 8 caracteres</p>
            {errors.password && (
              <p className="text-[13px] text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="flex flex-col gap-1">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                {...register('terms')}
                className="mt-0.5 w-4 h-4 rounded border-[#e4e4e7] accent-black cursor-pointer flex-shrink-0"
              />
              <span className="text-[13px] text-[#71717a] leading-snug">
                Acepto los{' '}
                <Link href="/terms" className="text-black underline underline-offset-2 hover:no-underline">
                  Términos de uso
                </Link>{' '}
                y{' '}
                <Link href="/privacy" className="text-black underline underline-offset-2 hover:no-underline">
                  Política de privacidad
                </Link>
              </span>
            </label>
            {errors.terms && (
              <p className="text-[13px] text-red-500 ml-6">{errors.terms.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-[42px] w-full bg-black text-white rounded-[10px] text-sm font-semibold hover:bg-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-1"
          >
            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
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
