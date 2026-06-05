import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductsView } from './_components/ProductsView'

export default async function ProductsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle()

  if (!tenant) notFound()

  const { data: store } = await supabase
    .from('stores')
    .select('store_id')
    .eq('tenant_id', tenant.id)
    .limit(1)
    .maybeSingle()

  if (!store) notFound()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, tag, price, active, description, image_url')
    .eq('store_id', store.store_id)
    .order('name')

  return <ProductsView products={products ?? []} storeId={store.store_id} />
}
