'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { OrderStatus } from '@/types'

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select('id, status')

  console.log('[updateOrderStatus] orderId:', orderId, 'status:', status)
  console.log('[updateOrderStatus] result:', { data, error })

  if (error) return { error: error.message }

  revalidatePath('/orders')
  return {}
}
