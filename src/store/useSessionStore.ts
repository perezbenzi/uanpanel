import { create } from 'zustand'

type SessionStore = {
  tenantId: string | null
  storeId: string | null
  setSession: (tenantId: string, storeId: string) => void
}

export const useSessionStore = create<SessionStore>((set) => ({
  tenantId: null,
  storeId: null,
  setSession: (tenantId, storeId) => set({ tenantId, storeId }),
}))
