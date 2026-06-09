'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'

function getInitials(name: string): string {
  if (!name) return '?'
  if (name.includes('@')) return name.split('@')[0].slice(0, 2).toUpperCase()
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function DashboardShell({
  userName,
  tenantName,
  children,
}: {
  userName: string
  tenantName: string
  children: React.ReactNode
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-[#f9f9f9]">
      {/* ─── Mobile header (hidden on md+) ──────────────────────────── */}
      <header
        className="md:hidden fixed top-0 inset-x-0 z-30 bg-white border-b border-[#e4e4e7]"
        style={{ paddingTop: 'env(safe-area-inset-top, 0)' }}
      >
        <div className="h-[52px] flex items-center justify-between px-4">
          <button
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-[8px] text-[#71717a] hover:text-black hover:bg-[#f4f4f5] transition-colors -ml-1"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M3 5h14M3 10h14M3 15h14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-[24px] h-[24px] bg-black rounded-[5px] flex items-center justify-center flex-shrink-0">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
                <rect x="8" y="1" width="5" height="5" rx="1" fill="white" />
                <rect x="1" y="8" width="5" height="5" rx="1" fill="white" />
                <rect x="8" y="8" width="5" height="5" rx="1" fill="white" />
              </svg>
            </div>
            <span className="font-semibold text-[14px] text-black tracking-tight">
              AdminPanel
            </span>
          </div>

          <div className="w-[32px] h-[32px] rounded-full bg-black flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-bold text-white leading-none">
              {getInitials(userName)}
            </span>
          </div>
        </div>
      </header>

      {/* ─── Backdrop (mobile only, fades in/out) ───────────────────── */}
      <div
        className={[
          'md:hidden fixed inset-0 z-40 bg-black/40 transition-opacity duration-200',
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* ─── Sidebar / Drawer ───────────────────────────────────────── */}
      {/*
        Mobile  → fixed overlay, slides from left (75vw, max 280px)
        Desktop → normal flex child, always visible, 220px
      */}
      <aside
        className={[
          'flex-shrink-0 bg-white border-r border-[#e4e4e7] flex flex-col',
          'fixed inset-y-0 left-0 z-50',
          'w-[75vw] max-w-[280px]',
          'transition-transform duration-200 ease-out',
          drawerOpen ? 'translate-x-0' : '-translate-x-full',
          'md:relative md:inset-y-auto md:left-auto md:z-auto',
          'md:w-[220px] md:translate-x-0 md:transition-none',
        ].join(' ')}
      >
        <Sidebar
          userName={userName}
          tenantName={tenantName}
          onLinkClick={() => setDrawerOpen(false)}
        />
      </aside>

      {/* ─── Main content ───────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 mobile-header-offset">
        {children}
      </main>
    </div>
  )
}
