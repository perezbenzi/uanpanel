import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OrdersView } from './_components/OrdersView'

export default async function OrdersPage() {
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

  const { data: orders } = await supabase
    .from('orders')
    .select('id, created_at, customer_name, total, status, store_id, tenant_id')
    .eq('tenant_id', tenant.id)
    .order('created_at', { ascending: false })

  return <OrdersView orders={orders ?? []} />
}
