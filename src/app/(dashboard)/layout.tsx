import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { SessionProvider } from '@/components/layout/SessionProvider'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, name')
    .eq('owner_id', user.id)
    .maybeSingle()

  const { data: store } = await supabase
    .from('stores')
    .select('store_id')
    .eq('tenant_id', tenant?.id ?? '')
    .limit(1)
    .maybeSingle()

  const meta = user.user_metadata as { first_name?: string; last_name?: string } | undefined
  const userName =
    meta?.first_name && meta?.last_name
      ? `${meta.first_name} ${meta.last_name}`
      : (meta?.first_name ?? user.email ?? '')

  return (
    <SessionProvider tenantId={tenant?.id ?? ''} storeId={store?.store_id ?? ''}>
      <div className="flex h-screen overflow-hidden bg-[#f9f9f9]">
        <Sidebar userName={userName} tenantName={tenant?.name ?? ''} />
        <main className="flex-1 overflow-y-auto min-w-0">{children}</main>
      </div>
    </SessionProvider>
  )
}
