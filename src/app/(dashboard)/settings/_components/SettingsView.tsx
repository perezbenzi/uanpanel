'use client'

import { useState, useTransition } from 'react'
import { updateProfile, updatePassword } from '../actions'

type SectionFeedback = { error?: string; success?: boolean } | null

const INPUT =
  'h-[36px] w-full border border-[#e4e4e7] rounded-[8px] px-3 text-[13px] text-black focus:outline-none focus:border-black focus:shadow-[0_0_0_3px_rgba(9,9,11,0.07)] transition-[border-color,box-shadow]'

const INPUT_READONLY =
  'h-[36px] w-full border border-[#e4e4e7] rounded-[8px] px-3 text-[13px] bg-[#f9f9f9] text-[#a1a1aa] cursor-not-allowed'

function getInitials(name: string): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function Feedback({ state }: { state: SectionFeedback }) {
  if (!state) return null
  if (state.error) return <p className="text-[12px] text-[#dc2626]">{state.error}</p>
  return <p className="text-[12px] text-[#16a34a]">Saved successfully</p>
}

function CardHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 px-5 py-[14px] border-b border-[#e4e4e7]">
      <span className="text-[#71717a] flex-shrink-0">{icon}</span>
      <span className="text-[13px] font-semibold text-black">{title}</span>
    </div>
  )
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

function SaveButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-[34px] px-4 bg-black text-white text-[12.5px] font-semibold rounded-[8px] hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Saving...' : 'Save'}
    </button>
  )
}

function ProfileForm({ displayName, email }: { displayName: string; email: string }) {
  const [pending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<SectionFeedback>(null)

  const resolvedName = displayName || email.split('@')[0]

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setFeedback(null)
    startTransition(async () => {
      const result = await updateProfile(null, formData)
      setFeedback(result)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#e4e4e7] rounded-[14px]">
      <CardHeader icon={<UserIcon />} title="Profile" />

      <div className="p-5 flex flex-col gap-5">
        {/* Avatar row */}
        <div className="flex items-center gap-3">
          <div className="w-[38px] h-[38px] rounded-full bg-black flex items-center justify-center flex-shrink-0">
            <span className="text-[13px] font-bold text-white leading-none">
              {getInitials(resolvedName)}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] font-semibold text-black truncate">{resolvedName}</span>
            <span className="text-[12px] text-[#a1a1aa] truncate">{email}</span>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="display_name" className="text-[12px] font-medium text-[#71717a]">
              Display name
            </label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              defaultValue={resolvedName}
              className={INPUT}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#71717a]">Email</label>
            <input
              type="email"
              value={email}
              disabled
              readOnly
              className={INPUT_READONLY}
            />
            <p className="text-[11px] text-[#a1a1aa]">Email cannot be changed</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e4e4e7]">
          <Feedback state={feedback} />
          <SaveButton pending={pending} />
        </div>
      </div>
    </form>
  )
}

function PasswordForm() {
  const [pending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<SectionFeedback>(null)
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null)
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const newPassword = formData.get('new_password') as string
    const confirmPassword = formData.get('confirm_password') as string

    setNewPasswordError(null)
    setConfirmPasswordError(null)
    setFeedback(null)

    let hasError = false
    if (newPassword.length < 8) {
      setNewPasswordError('Password must be at least 8 characters')
      hasError = true
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match')
      hasError = true
    }
    if (hasError) return

    startTransition(async () => {
      const result = await updatePassword(null, formData)
      setFeedback(result)
      if (result?.success) form.reset()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#e4e4e7] rounded-[14px]">
      <CardHeader icon={<LockIcon />} title="Change password" />

      <div className="p-5 flex flex-col gap-4">
        {/* Current password — full width */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="current_password" className="text-[12px] font-medium text-[#71717a]">
            Current password
          </label>
          <input
            id="current_password"
            name="current_password"
            type="password"
            autoComplete="current-password"
            className={INPUT}
          />
        </div>

        {/* New + Confirm — 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="new_password" className="text-[12px] font-medium text-[#71717a]">
              New password
            </label>
            <input
              id="new_password"
              name="new_password"
              type="password"
              autoComplete="new-password"
              className={INPUT}
            />
            {newPasswordError && (
              <p className="text-[12px] text-red-500">{newPasswordError}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm_password" className="text-[12px] font-medium text-[#71717a]">
              Confirm new password
            </label>
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              autoComplete="new-password"
              className={INPUT}
            />
            {confirmPasswordError && (
              <p className="text-[12px] text-red-500">{confirmPasswordError}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#e4e4e7]">
          <div className="flex flex-col gap-1">
            <p className="text-[11px] text-[#a1a1aa]">
              Use a strong password with letters, numbers and symbols
            </p>
            <Feedback state={feedback} />
          </div>
          <SaveButton pending={pending} />
        </div>
      </div>
    </form>
  )
}

export function SettingsView({
  displayName,
  email,
}: {
  displayName: string
  email: string
}) {
  return (
    <div className="px-[18px] py-4 md:p-7">
      <div className="mb-5 md:mb-7">
        <p className="text-[12px] text-[#a1a1aa] font-medium mb-0.5">
          AdminPanel &rsaquo; Settings
        </p>
        <h1 className="text-[20px] md:text-[22px] font-bold text-black leading-tight">Settings</h1>
      </div>

      <div className="flex flex-col gap-5 max-w-[600px]">
        <ProfileForm displayName={displayName} email={email} />
        <PasswordForm />
      </div>
    </div>
  )
}
