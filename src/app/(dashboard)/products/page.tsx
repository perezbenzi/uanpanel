import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProductsView } from './_components/ProductsView'

export default async function ProductsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  console.log('user:', user?.id)
  if (!user) redirect('/login')

  // Tenant del usuario
  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle()
  console.log('tenant:', tenant, tenantError)

  if (!tenant) notFound()

  // Store del tenant
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('store_id')
    .eq('tenant_id', tenant.id)
    .limit(1)
    .maybeSingle()
  console.log('store:', store, storeError)

  if (!store) notFound()

  // Productos de la store
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, tag, price, active')
    .eq('store_id', store.store_id)
    .order('name')
  console.log('products:', products, productsError)

  return <ProductsView products={products ?? []} storeId={store.store_id} />
}
