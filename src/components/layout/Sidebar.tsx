'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function ProductsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function OrdersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  )
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: DashboardIcon, badge: null },
  { href: '/products', label: 'Products', icon: ProductsIcon, badge: null },
  { href: '/orders', label: 'Orders', icon: OrdersIcon, badge: null },
  { href: '/settings', label: 'Settings', icon: SettingsIcon, badge: null },
] as const

function getInitials(name: string): string {
  if (!name) return '?'
  if (name.includes('@')) return name.split('@')[0].slice(0, 2).toUpperCase()
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Sidebar({
  userName,
  tenantName,
  onLinkClick,
}: {
  userName: string
  tenantName: string
  onLinkClick?: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [loadingHref, setLoadingHref] = useState<string | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    setLoadingHref(null)
  }, [pathname])

  async function handleLogout() {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-[60px] border-b border-[#e4e4e7] flex-shrink-0">
        <div className="w-[28px] h-[28px] bg-black rounded-[6px] flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
            <rect x="8" y="1" width="5" height="5" rx="1" fill="white" />
            <rect x="1" y="8" width="5" height="5" rx="1" fill="white" />
            <rect x="8" y="8" width="5" height="5" rx="1" fill="white" />
          </svg>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-[14px] text-black tracking-tight leading-tight">
            AdminPanel
          </span>
          {tenantName && (
            <span className="text-[11px] text-[#a1a1aa] font-medium truncate leading-tight">
              {tenantName}
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          const isLoading = loadingHref === href
          return (
            <Link
              key={href}
              href={href}
              onClick={() => {
                if (!isActive) setLoadingHref(href)
                onLinkClick?.()
              }}
              className={[
                'flex items-center gap-2.5 px-3 py-[7px] rounded-[8px] text-[13.5px] transition-colors',
                isActive
                  ? 'bg-[#f4f4f5] text-black font-semibold'
                  : 'text-[#71717a] font-medium hover:bg-[#f4f4f5] hover:text-black',
                isLoading ? 'opacity-50 pointer-events-none' : '',
              ].join(' ')}
            >
              <Icon className="w-[16px] h-[16px] flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {badge !== null && (
                <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                  {badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom user section */}
      <div className="px-3 py-3 border-t border-[#e4e4e7] flex-shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-[8px]">
          <div className="w-[30px] h-[30px] rounded-full bg-black flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-bold text-white">{getInitials(userName)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-black truncate">{userName || '—'}</p>
            <p className="text-[11px] text-[#a1a1aa] leading-tight">
              {isLoggingOut ? 'Signing out...' : 'owner'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Sign out"
            className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[#a1a1aa] hover:text-black hover:bg-[#f4f4f5] transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M6 2H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3M10 10l3-2.5L10 5M13 7.5H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
