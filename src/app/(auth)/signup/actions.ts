'use server'

import { createServiceClient } from '@/lib/supabase/service'

type ValidateResult =
  | { valid: true; storeId: string }
  | { valid: false; error: string }

export async function validateInviteCode(code: string): Promise<ValidateResult> {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('invitations')
    .select('store_id, used_at, expires_at')
    .ilike('code', code)
    .maybeSingle()

  if (error || !data) return { valid: false, error: 'Invalid code' }

  if (data.used_at !== null) return { valid: false, error: 'Code already used' }

  if (data.expires_at !== null && new Date(data.expires_at) < new Date()) {
    return { valid: false, error: 'Code expired' }
  }

  return { valid: true, storeId: data.store_id }
}

export async function markInviteCodeUsed(code: string): Promise<void> {
  const supabase = createServiceClient()
  await supabase
    .from('invitations')
    .update({ used_at: new Date().toISOString() })
    .eq('code', code)
}
