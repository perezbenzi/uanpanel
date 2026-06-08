import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SettingsView } from './_components/SettingsView'

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const meta = user.user_metadata ?? {}
  const displayName = (meta.display_name as string | undefined) ||
    (meta.first_name || meta.last_name
      ? `${meta.first_name ?? ''} ${meta.last_name ?? ''}`.trim()
      : '')

  return (
    <SettingsView
      displayName={displayName}
      email={user.email ?? ''}
    />
  )
}
