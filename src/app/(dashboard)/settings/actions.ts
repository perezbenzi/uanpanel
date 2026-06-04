'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ActionState = { error?: string; success?: boolean } | null

export async function updateProfile(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const displayName = (formData.get('display_name') as string | null)?.trim()
  if (!displayName) return { error: 'Display name is required' }

  const { error } = await supabase.auth.updateUser({
    data: { display_name: displayName },
  })

  if (error) return { error: error.message }

  revalidatePath('/settings')
  return { success: true }
}


export async function updatePassword(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const currentPassword = (formData.get('current_password') as string | null) ?? ''
  const newPassword = (formData.get('new_password') as string | null) ?? ''
  const confirmPassword = (formData.get('confirm_password') as string | null) ?? ''

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'All password fields are required' }
  }
  if (newPassword.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }
  if (newPassword !== confirmPassword) {
    return { error: 'Passwords do not match' }
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  })
  if (signInError) return { error: 'Current password is incorrect' }

  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) return { error: error.message }

  return { success: true }
}
