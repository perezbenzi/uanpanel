import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/DashboardShell'
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

  const meta = user.user_metadata ?? {}
  const displayName = meta.display_name as string | undefined
  const firstName = meta.first_name as string | undefined
  const lastName = meta.last_name as string | undefined
  const userName =
    displayName ||
    (firstName || lastName
      ? `${firstName ?? ''} ${lastName ?? ''}`.trim()
      : '') ||
    user.email ||
    ''

  return (
    <SessionProvider tenantId={tenant?.id ?? ''} storeId={store?.store_id ?? ''}>
      <DashboardShell userName={userName} tenantName={tenant?.name ?? ''}>
        {children}
      </DashboardShell>
    </SessionProvider>
  )
}
