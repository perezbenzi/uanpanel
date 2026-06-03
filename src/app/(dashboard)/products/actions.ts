'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ActionState = { error?: string; success?: boolean } | null

export async function createProduct(
  storeId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const name = (formData.get('name') as string | null)?.trim()
  const priceRaw = formData.get('price') as string | null
  const price = priceRaw ? parseFloat(priceRaw) : NaN
  const tag = (formData.get('tag') as string | null)?.trim() || null
  const description = (formData.get('description') as string | null)?.trim() || null
  const active = formData.get('active') === 'on'

  if (!name) return { error: 'Name is required' }
  if (isNaN(price) || price < 0) return { error: 'Invalid price' }

  const { error } = await supabase.from('products').insert({
    name,
    price,
    tag,
    description,
    active,
    store_id: storeId,
    image_url: null,
  })

  if (error) return { error: error.message }

  revalidatePath('/products')
  return { success: true }
}

export async function deleteProduct(productId: string): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const storeId = user.user_metadata.store_id as string | undefined
  if (!storeId) throw new Error('Unauthorized')

  const { data: product } = await supabase
    .from('products')
    .select('store_id')
    .eq('id', productId)
    .single()

  if (!product) throw new Error('Product not found')
  if (product.store_id !== storeId) throw new Error('Unauthorized')

  await supabase.from('products').delete().eq('id', productId)
  revalidatePath('/products')
}
