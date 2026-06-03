'use client'

import { useEffect } from 'react'
import { useSessionStore } from '@/store/useSessionStore'

export function SessionProvider({
  tenantId,
  storeId,
  children,
}: {
  tenantId: string
  storeId: string
  children: React.ReactNode
}) {
  useEffect(() => {
    useSessionStore.getState().setSession(tenantId, storeId)
  }, [tenantId, storeId])

  return <>{children}</>
}
