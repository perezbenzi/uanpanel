'use client'

import { useState } from 'react'
import Link from 'next/link'

type Lang = 'es' | 'en'

// ─── Tiny icon components ────────────────────────────────────────────────────

function GridIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" width={size} height={size}>
      <rect x="1" y="1" width="5" height="5" fill="currentColor" />
      <rect x="8" y="1" width="5" height="5" fill="currentColor" />
      <rect x="1" y="8" width="5" height="5" fill="currentColor" />
      <rect x="8" y="8" width="5" height="5" fill="currentColor" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0a8 8 0 00-7 11.8L0 16l4.3-1A8 8 0 108 0zm0 14.5a6.5 6.5 0 01-3.3-.9l-.3-.1L2 14l.6-2.4-.2-.3a6.5 6.5 0 1110.5-7.5A6.5 6.5 0 018 14.5zm3.5-4.9c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.4.1-.1.2-.5.6-.6.7-.1.1-.2.2-.4 0-.2-.1-.9-.3-1.7-1-.6-.6-1-1.3-1.1-1.5-.1-.2 0-.3.1-.4l.3-.4c.1-.1.1-.2.2-.3 0-.1 0-.2 0-.3 0-.1-.4-1-.6-1.4-.1-.4-.3-.3-.4-.3h-.4c-.1 0-.3 0-.5.2-.2.2-.7.7-.7 1.7s.7 2 .8 2.1c.1.1 1.4 2.2 3.5 3 .5.2.9.3 1.2.4.5.2 1 .1 1.3.1.4 0 1.2-.5 1.4-1 .2-.5.2-.9.1-1 0-.1-.2-.2-.4-.2z" />
    </svg>
  )
}

// ─── Shared button class strings ─────────────────────────────────────────────

const BTN =
  'inline-flex items-center justify-center gap-1.5 px-[18px] py-[10px] rounded-lg font-semibold text-sm cursor-pointer border border-transparent no-underline transition-all duration-[150ms] whitespace-nowrap'
const BTN_PRIMARY = `${BTN} bg-ink text-white border-ink hover:bg-[#1f1f1f] hover:-translate-y-px`
const BTN_GHOST = `${BTN} bg-transparent text-ink border-line hover:bg-bg-elev hover:border-line-strong`

// ─── Status badge ─────────────────────────────────────────────────────────────

type BadgeVariant = 'ready' | 'pending' | 'collected' | 'cancelled' | 'active' | 'confirmed'

const BADGE_CLS: Record<BadgeVariant, { wrap: string; dot: string }> = {
  active:    { wrap: 'bg-accent-soft text-[#166534]',  dot: 'bg-accent' },
  pending:   { wrap: 'bg-info-soft text-info-ink',      dot: 'bg-[#3b82f6]' },
  ready:     { wrap: 'bg-[#f3e8ff] text-[#6b21a8]',   dot: 'bg-[#a855f7]' },
  collected: { wrap: 'bg-accent-soft text-[#166534]',  dot: 'bg-accent' },
  cancelled: { wrap: 'bg-danger-soft text-danger-ink', dot: 'bg-danger-ink' },
  confirmed: { wrap: 'bg-warn-soft text-warn-ink',     dot: 'bg-[#f59e0b]' },
}

function StatusBadge({ variant, children }: { variant: BadgeVariant; children: React.ReactNode }) {
  const c = BADGE_CLS[variant]
  return (
    <span className={`inline-flex items-center gap-[5px] px-[9px] py-[3px] rounded-full text-[11px] font-semibold ${c.wrap}`}>
      <span className={`w-[5px] h-[5px] rounded-full ${c.dot}`} />
      {children}
    </span>
  )
}

// ─── Mockup sidebar nav item ──────────────────────────────────────────────────

function MockNavItem({ active, children }: { active?: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[6px] text-[13px] font-medium cursor-default select-none ${
        active ? 'bg-[#f5f5f4] text-ink' : 'text-ink-2'
      }`}
    >
      {children}
    </div>
  )
}

// ─── Shared section heading block ─────────────────────────────────────────────

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-jb-mono text-[11px] text-ink-3 uppercase tracking-[0.12em] mb-4">
      {children}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>('es')
  const es = lang === 'es'

  return (
    <div className="bg-bg text-ink text-base leading-normal">

      {/* ═══ NAV ═══════════════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-[100] bg-[rgba(250,250,249,0.85)] backdrop-blur-[12px] [-webkit-backdrop-filter:blur(12px)] border-b border-line">
        <div className="flex items-center justify-between py-3 px-5 md:py-4 md:px-6 max-w-[1180px] mx-auto">

          {/* Logo */}
          <div className="flex items-center gap-2.5 font-bold text-[15px] tracking-[-0.01em]">
            <div className="w-7 h-7 bg-ink rounded-[6px] grid place-items-center text-white">
              <GridIcon />
            </div>
            <span className="hidden md:inline">AdminPanel</span>
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <div className="flex bg-bg-elev border border-line rounded-lg p-[3px] font-jb-mono text-[11px] font-medium">
              {(['es', 'en'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-[5px] rounded-[5px] cursor-pointer border-0 font-[inherit] text-[inherit] transition-all duration-[150ms] ${
                    lang === l ? 'bg-ink text-white' : 'bg-transparent text-ink-3'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <a href="#pricing" className={`${BTN_GHOST} hidden md:inline-flex`}>
              {es ? 'Ver precios' : 'Pricing'}
            </a>
            <Link href="/login" className={BTN_GHOST}>
              {es ? 'Iniciar sesión' : 'Login'}
            </Link>
            <a href="#cta" className={BTN_PRIMARY}>
              {es ? 'Empezar' : 'Get started'}
            </a>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ══════════════════════════════════════════════════════════════ */}
      <header className="pt-14 pb-10 md:pt-24 md:pb-16 text-center relative overflow-hidden">
        {/* Radial gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 10%, rgba(0,0,0,0.025), transparent 40%), radial-gradient(circle at 80% 0%, rgba(22,163,74,0.04), transparent 40%)',
          }}
        />

        <div className="max-w-[1180px] mx-auto px-5 md:px-6 relative">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-bg-elev text-ink-2 rounded-full text-xs font-semibold mb-6 border border-line">
            <span className="w-1.5 h-1.5 bg-ink rounded-full animate-blink" />
            {es ? 'Acceso beta · USD 10/mes los primeros 3 meses' : 'Beta access · USD 10/mo for the first 3 months'}
          </div>

          {/* Headline */}  
          <h1 className="font-display font-normal text-[clamp(40px,6vw,72px)] leading-[1.05] tracking-[-0.02em] max-w-[880px] mx-auto mb-6">
          {es ? (
            <>
              Manejá tu negocio en Australia.{' '}
              <br />
              Tu <span className="text-[#166534]">tienda online</span> incluida.
            </>
          ) : 'Your online store, ready to use.'}
        </h1>

          {/* Sub */}
          <p className="text-[clamp(16px,2vw,20px)] text-ink-3 max-w-[580px] mx-auto mb-9 leading-[1.55]">
            {es
              ? 'Un panel simple para emprendedores en Australia que quieren vender online sin complicaciones.'
              : 'Online store included free. Management panel at $10/mo in beta, then $25/mo.'}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col items-stretch gap-3 mb-4 px-8 md:flex-row md:justify-center md:items-center md:flex-wrap md:px-0">
            <Link href="/signup" className={BTN_PRIMARY}>
              {es ? 'Quiero mi tienda' : 'I want my store'}
              <ChevronRight />
            </Link>
            <a href="#how" className={BTN_GHOST}>
              {es ? 'Cómo funciona' : 'How it works'}
            </a>
          </div>

          {/* Meta */}
          <p className="text-[13px] text-ink-4 mb-16 font-jb-mono">
            {es
              ? 'Tienda online gratis · Sin configuraciones · Cancelás cuando quieras'
              : 'Free online store · No setup required · Cancel anytime'}
          </p>

          {/* ── Dashboard mockup ── */}
          <div className="max-w-[1080px] mx-auto bg-bg-elev rounded-2xl border border-line shadow-lg overflow-hidden">
            {/* Browser chrome bar */}
            <div className="bg-[#f5f5f4] border-b border-line py-[10px] px-4 flex items-center gap-2">
              <span className="w-[11px] h-[11px] rounded-full bg-[#d4d4d4]" />
              <span className="w-[11px] h-[11px] rounded-full bg-[#d4d4d4]" />
              <span className="w-[11px] h-[11px] rounded-full bg-[#d4d4d4]" />
              <span className="mx-auto bg-white px-[14px] py-1 rounded-[6px] font-jb-mono text-[11px] text-ink-3 border border-line">
                app.tu-marca.com/dashboard
              </span>
            </div>

            {/* Panel grid */}
            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] min-h-[540px] bg-[#f9f9f9]">

              {/* Sidebar */}
              <aside className="hidden md:flex flex-col bg-white border-r border-line px-[14px] py-5">
                <div className="flex items-center gap-2.5 px-2 pb-6 border-b border-line mb-4">
                  <div className="w-8 h-8 bg-ink rounded-[7px] grid place-items-center text-white">
                    <GridIcon />
                  </div>
                  <div>
                    <div className="font-bold text-[13px]">AdminPanel</div>
                    <div className="text-[11px] text-ink-3">Tu Marca</div>
                  </div>
                </div>

                <div className="flex flex-col gap-0.5 flex-1">
                  <MockNavItem active>
                    <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                      <rect x="2" y="2" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
                      <rect x="9" y="2" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
                      <rect x="2" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
                      <rect x="9" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    Dashboard
                  </MockNavItem>
                  <MockNavItem>
                    <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                      <path d="M3 6V4a2 2 0 012-2h6a2 2 0 012 2v2M2 6h12v7a1 1 0 01-1 1H3a1 1 0 01-1-1V6z" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    {es ? 'Productos' : 'Products'}
                  </MockNavItem>
                  <MockNavItem>
                    <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                      <path d="M3 4h10M3 8h10M3 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    {es ? 'Pedidos' : 'Orders'}
                  </MockNavItem>
                  <MockNavItem>
                    <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 1v2M8 13v2M15 8h-2M3 8H1M12.5 3.5l-1.4 1.4M4.9 11.1l-1.4 1.4M12.5 12.5l-1.4-1.4M4.9 4.9L3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    {es ? 'Ajustes' : 'Settings'}
                  </MockNavItem>
                </div>

                <div className="flex items-center gap-2.5 pt-4 mt-2 border-t border-line">
                  <div className="w-7 h-7 rounded-full bg-ink text-white grid place-items-center text-[11px] font-semibold">M</div>
                  <div>
                    <div className="text-[12px] font-semibold">María</div>
                    <div className="text-[11px] text-ink-3">{es ? 'propietaria' : 'owner'}</div>
                  </div>
                </div>
              </aside>

              {/* Main area */}
              <div className="p-[18px] md:py-7 md:px-8 overflow-hidden">
                <div className="text-[11px] text-ink-3 mb-1.5">AdminPanel › Dashboard</div>
                <div className="text-[22px] font-bold tracking-[-0.01em] mb-[22px]">Dashboard</div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-[22px]">
                  {[
                    { es: 'Productos activos', en: 'Active products', val: '12', warn: false },
                    { es: 'Pedidos hoy',        en: 'Orders today',    val: '8',   warn: false },
                    { es: 'Ingresos hoy',       en: 'Revenue today',   val: '$420',warn: false },
                    { es: 'Pending',            en: 'Pending',         val: '3',   warn: true  },
                  ].map((s, i) => (
                    <div key={i} className="bg-white border border-line rounded-xl py-[14px] px-4">
                      <div className="text-[10px] text-ink-3 uppercase tracking-[0.06em] font-semibold mb-2">
                        {es ? s.es : s.en}
                      </div>
                      <div className={`text-[22px] font-bold tracking-[-0.01em] ${s.warn ? 'text-warn-ink' : ''}`}>
                        {s.val}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Orders table */}
                <div className="bg-white border border-line rounded-xl overflow-hidden">
                  <div className="px-4 py-[14px] border-b border-line font-semibold text-[13px]">
                    {es ? 'Pedidos recientes' : 'Recent orders'}
                  </div>
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr>
                        <th className="text-left px-4 py-[10px] text-[10px] text-ink-3 font-semibold tracking-[0.05em] border-b border-line">ID</th>
                        <th className="text-left px-4 py-[10px] text-[10px] text-ink-3 font-semibold tracking-[0.05em] border-b border-line">
                          {es ? 'Cliente' : 'Customer'}
                        </th>
                        <th className="text-left px-4 py-[10px] text-[10px] text-ink-3 font-semibold tracking-[0.05em] border-b border-line">Total</th>
                        <th className="text-left px-4 py-[10px] text-[10px] text-ink-3 font-semibold tracking-[0.05em] border-b border-line">Status</th>
                        <th className="hidden md:table-cell text-left px-4 py-[10px] text-[10px] text-ink-3 font-semibold tracking-[0.05em] border-b border-line">
                          {es ? 'Fecha' : 'Date'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: '#A93F12', name: 'Lucía Méndez',  total: '$72',  v: 'ready'     as BadgeVariant, status: 'Ready',     date: '08 Jun' },
                        { id: '#B81E37', name: 'Tomás Reyes',   total: '$48',  v: 'pending'   as BadgeVariant, status: 'Pending',   date: '08 Jun' },
                        { id: '#C5D204', name: 'Pamela Souza',  total: '$136', v: 'collected' as BadgeVariant, status: 'Collected', date: '07 Jun' },
                        { id: '#D72A91', name: 'Diego Acosta',  total: '$96',  v: 'pending'   as BadgeVariant, status: 'Pending',   date: '07 Jun' },
                      ].map((row, i, arr) => {
                        const last = i === arr.length - 1
                        const cell = `px-4 py-[11px] ${last ? '' : 'border-b border-line'}`
                        return (
                          <tr key={row.id}>
                            <td className={`${cell} hidden md:table-cell font-jb-mono text-[11px] text-ink-3`}>{row.id}</td>
                            <td className={`${cell} text-ink-2`}>{row.name}</td>
                            <td className={`${cell} text-ink-2`}>{row.total}</td>
                            <td className={cell}><StatusBadge variant={row.v}>{row.status}</StatusBadge></td>
                            <td className={`${cell} hidden md:table-cell text-ink-3 text-[11px]`}>{row.date}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ HOW IT WORKS ══════════════════════════════════════════════════════ */}
      <section id="how" className="py-16 md:py-24">
        <div className="max-w-[1180px] mx-auto px-5 md:px-6">
          <SectionEyebrow>{es ? '— Cómo funciona' : '— How it works'}</SectionEyebrow>

          <div className="bg-bg rounded-2xl p-6 md:p-10 lg:p-12">
            {/* Copy + mockup */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
              {/* Left: copy */}
              <div>
                <h2 className="font-display font-normal text-[clamp(28px,4vw,44px)] leading-[1.1] tracking-[-0.02em] text-ink mb-4">
                  {es ? (
                    <>¿De qué manera te 
                    <br />
                    ayuda el <span className="text-[#166534]">AdminPanel</span>?</>
                  ) : (
                    <>How does <span className="text-[#166534]">AdminPanel</span> help you?</>
                  )}
                </h2>
                <p className="text-[17px] text-ink-3 leading-[1.55]">
                  {es
                    ? 'No hace falta que configures nada, nosotros desarrollamos tu tienda y vos solo manejás tus ventas desde el panel.'
                    : "No setup needed — just manage your sales from the panel."}
                </p>
              </div>

              {/* Right: orders mockup */}
              <div className="bg-white border border-line rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.06)]">
                {/* Browser chrome bar */}
                <div className="bg-[#f5f5f4] border-b border-line py-[10px] px-4 flex items-center gap-2">
                  <span className="w-[11px] h-[11px] rounded-full bg-[#d4d4d4]" />
                  <span className="w-[11px] h-[11px] rounded-full bg-[#d4d4d4]" />
                  <span className="w-[11px] h-[11px] rounded-full bg-[#d4d4d4]" />
                  <span className="mx-auto bg-white px-[14px] py-1 rounded-[6px] font-jb-mono text-[11px] text-ink-3 border border-line">
                    app.tu-marca.com/pedidos
                  </span>
                </div>

                <div className="p-4 md:p-5">
                  <div className="text-[15px] font-bold text-ink mb-3 tracking-[-0.01em]">
                    {es ? 'Pedidos' : 'Orders'}
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-1.5 mb-3">
                    {(es ? ['Todos', 'Pending', 'Ready', 'Collected'] : ['All', 'Pending', 'Ready', 'Collected']).map((tab, i) => (
                      <span
                        key={tab}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                          i === 0 ? 'bg-ink text-white' : 'text-ink-3'
                        }`}
                      >
                        {tab}
                      </span>
                    ))}
                  </div>

                  {/* Orders table */}
                  <table className="w-full border-collapse text-[11px]">
                    <thead>
                      <tr>
                        {[es ? 'Cliente' : 'Customer', 'Total', 'Status', es ? 'Fecha' : 'Date'].map((h) => (
                          <th key={h} className="text-left px-2.5 py-2 border-b border-line text-[9px] text-ink-3 uppercase tracking-[0.05em] font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Lucía Méndez', total: '$72',  v: 'ready'     as BadgeVariant, status: 'Ready',     date: '08 Jun' },
                        { name: 'Tomás Reyes',  total: '$48',  v: 'pending'   as BadgeVariant, status: 'Pending',   date: '08 Jun' },
                        { name: 'Pamela Souza', total: '$136', v: 'collected' as BadgeVariant, status: 'Collected', date: '07 Jun' },
                        { name: 'Diego Acosta', total: '$96',  v: 'pending'   as BadgeVariant, status: 'Pending',   date: '07 Jun' },
                      ].map((row, i, arr) => {
                        const last = i === arr.length - 1
                        const cell = `px-2.5 py-2 ${last ? '' : 'border-b border-line'}`
                        return (
                          <tr key={row.name}>
                            <td className={`${cell} text-ink-2`}>{row.name}</td>
                            <td className={`${cell} text-ink-2`}>{row.total}</td>
                            <td className={cell}><StatusBadge variant={row.v}>{row.status}</StatusBadge></td>
                            <td className={`${cell} text-ink-3`}>{row.date}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 md:mt-16">
              {[
                {
                  num: '01',
                  esH: 'Recibís el pedido',
                  enH: 'You get the order',
                  esP: 'Tu cliente compra desde tu tienda, vos ves la venta al instante en el panel.',
                  enP: 'Your customer buys from your store, you see the sale instantly in the panel.',
                },
                {
                  num: '02',
                  esH: 'Vos lo gestionás',
                  enH: 'You manage it',
                  esP: 'Cambiás el estado del pedido (pending, ready, collected) con un click.',
                  enP: 'Change the order status (pending, ready, collected) with one click.',
                },
                {
                  num: '03',
                  esH: 'Todo queda registrado',
                  enH: 'Everything is logged',
                  esP: 'Ingresos, pedidos y productos en un dashboard claro.',
                  enP: 'Revenue, orders and products in one clear dashboard.',
                },
              ].map((step) => (
                <div key={step.num} className="bg-bg-elev border border-line rounded-xl p-6">
                  <div className="font-jb-mono text-xs font-semibold text-[#166534] mb-3">
                    {step.num}
                  </div>
                  <h3 className="text-ink text-[18px] font-bold mb-2 tracking-[-0.01em]">
                    {es ? step.esH : step.enH}
                  </h3>
                  <p className="text-ink-3 text-sm leading-[1.6]">
                    {es ? step.esP : step.enP}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1180px] mx-auto px-5 md:px-6">
          <SectionEyebrow>{es ? '— Lo que incluye' : "— What's included"}</SectionEyebrow>
          <h2 className="font-display font-normal text-[clamp(32px,4.5vw,52px)] leading-[1.1] tracking-[-0.02em] mb-4 max-w-[720px]">
            {es ? 'Qué encontrás en el panel.' : "What's inside the panel."}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">

            {/* ── Large: Order management ── */}
            <div className="col-span-1 md:col-span-2 bg-bg-elev border border-line rounded-2xl overflow-hidden flex flex-col hover:border-line-strong transition-all duration-200">
              <div className="px-7 pt-7 pb-0">
                <h3 className="text-[18px] font-bold mb-2 tracking-[-0.01em]">
                  {es ? 'Gestión de pedidos' : 'Order management'}
                </h3>
                <p className="text-sm text-ink-3 leading-[1.6] mb-6">
                  {es
                    ? 'Filtrá por estado, cambiá el status con un dropdown, mantené cada pedido bajo control desde una sola vista.'
                    : 'Filter by status, change with a dropdown, keep every order under control from a single view.'}
                </p>
              </div>
              <div className="mt-auto pt-3 px-7 pb-7 flex items-end justify-center min-h-[220px]">
                <div className="w-full max-w-[720px] bg-white border border-line rounded-xl overflow-hidden shadow-md">
                  <div className="px-[14px] py-2.5 bg-[#fafafa] border-b border-line flex gap-1.5">
                    {['All', 'Pending', 'Ready', 'Collected'].map((tab, i) => (
                      <span key={tab} className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${i === 0 ? 'bg-ink text-white' : 'text-ink-3'}`}>
                        {tab}
                      </span>
                    ))}
                  </div>
                  <table className="w-full text-[11px] border-collapse">
                    <thead>
                      <tr>
                        {['ID', es ? 'Cliente' : 'Customer', 'Total', 'Status'].map((h) => (
                          <th key={h} className="text-left px-[14px] py-[9px] border-b border-line text-[9px] text-ink-3 uppercase tracking-[0.05em] font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: '#9E61', name: 'Lucía Méndez', total: '$136', status: 'Ready' },
                        { id: '#2068', name: 'Tomás Reyes',  total: '$68',  status: 'Pending' },
                        { id: '#8E2B', name: 'Pamela Souza', total: '$72',  status: 'Collected' },
                      ].map((row, i, arr) => {
                        const last = i === arr.length - 1
                        const c = `px-[14px] py-[9px] ${last ? '' : 'border-b border-line'}`
                        return (
                          <tr key={row.id}>
                            <td className={`${c} font-jb-mono text-ink-3`}>{row.id}</td>
                            <td className={c}>{row.name}</td>
                            <td className={c}>{row.total}</td>
                            <td className={c}>
                              <span className="inline-flex items-center gap-1.5 px-2 py-[3px] border border-line-strong rounded-[5px] text-[10px] font-medium">
                                {row.status}
                                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                  <path d="M2 3l2 2 2-2" stroke="currentColor" />
                                </svg>
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ── Products with photos ── */}
            <div className="bg-bg-elev border border-line rounded-2xl overflow-hidden flex flex-col hover:border-line-strong transition-all duration-200">
              <div className="px-7 pt-7 pb-0">
                <h3 className="text-[18px] font-bold mb-2 tracking-[-0.01em]">
                  {es ? 'Tu catálogo, siempre actualizado' : 'Your catalog, always up to date'}
                </h3>
                <p className="text-sm text-ink-3 leading-[1.6] mb-6">
                  {es
                    ? 'Agregás, editás o pausás productos en segundos. Los cambios se reflejan en tu tienda al instante, sin tocar código.'
                    : 'Add, edit or pause products in seconds. Changes show on your store instantly, no code needed.'}
                </p>
              </div>
              <div className="mt-auto pt-3 px-7 pb-7 flex items-end justify-center min-h-[140px]">
                <div className="w-full bg-white border border-line rounded-[10px] overflow-hidden shadow-sm">
                  {[
                    { bg: 'linear-gradient(135deg, #d4a574, #a67c52)', name: 'Banana Caramel',   tag: '—',  price: '$70' },
                    { bg: 'linear-gradient(135deg, #c0d8a8, #8fb572)', name: 'Matcha Yuzu',       tag: 'GF', price: '$72' },
                    { bg: 'linear-gradient(135deg, #e8a8b8, #c97a8a)', name: 'Raspberry & Rose', tag: 'VG', price: '$68' },
                  ].map((p, i, arr) => (
                    <div
                      key={p.name}
                      className={`grid grid-cols-[28px_1fr_auto_auto] gap-2.5 items-center px-3 py-[9px] text-xs ${i < arr.length - 1 ? 'border-b border-line' : ''}`}
                    >
                      <div className="w-[26px] h-[26px] rounded-[5px]" style={{ background: p.bg }} />
                      <span className="font-medium text-ink">{p.name}</span>
                      <span className="text-[9px] px-1.5 py-[2px] bg-bg rounded-[4px] text-ink-3 font-semibold">{p.tag}</span>
                      <span className="text-[11px] text-ink-3 font-jb-mono">{p.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Toggle active / pause ── */}
            <div className="bg-bg-elev border border-line rounded-2xl overflow-hidden flex flex-col hover:border-line-strong transition-all duration-200">
              <div className="px-7 pt-7 pb-0">
                <h3 className="text-[18px] font-bold mb-2 tracking-[-0.01em]">
                  {es ? 'Activar y pausar con un click' : 'Activate and pause with one click'}
                </h3>
                <p className="text-sm text-ink-3 leading-[1.6] mb-6">
                  {es
                    ? 'Controlá la disponibilidad de cada producto desde la tabla, sin abrir formularios ni recargar la página.'
                    : "Control each product's availability right from the table, without opening forms or reloading."}
                </p>
              </div>
              <div className="mt-auto pt-3 px-7 pb-7 flex items-end justify-center min-h-[140px]">
                <div className="w-full max-w-[320px] bg-white border border-line rounded-[10px] overflow-hidden shadow-sm">
                  {[
                    { bg: 'linear-gradient(135deg, #fce7c4, #f5d59a)', name: 'Lemon & Vanilla',    on: true  },
                    { bg: 'linear-gradient(135deg, #b8a4d9, #8e7bb5)', name: 'Lavender Earl Grey', on: false },
                    { bg: 'linear-gradient(135deg, #d4a574, #a67c52)', name: 'Choc Hazelnut',      on: true  },
                  ].map((p, i, arr) => (
                    <div
                      key={p.name}
                      className={`grid grid-cols-[28px_1fr_auto] gap-2.5 items-center px-3 py-[9px] text-xs ${i < arr.length - 1 ? 'border-b border-line' : ''}`}
                    >
                      <div className="w-[26px] h-[26px] rounded-[5px]" style={{ background: p.bg }} />
                      <span className="font-medium text-ink">{p.name}</span>
                      <span
                        className={`inline-flex items-center gap-[5px] px-[9px] py-[3px] rounded-full text-[11px] font-semibold border-0 cursor-pointer transition-all duration-[150ms] ${
                          p.on ? 'bg-accent-soft text-[#166534]' : 'bg-[#f1efe8] text-[#5f5e5a]'
                        }`}
                      >
                        <span className={`w-[5px] h-[5px] rounded-full ${p.on ? 'bg-accent' : 'bg-[#888780]'}`} />
                        {p.on ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Clear metrics ── */}
            <div className="bg-bg-elev border border-line rounded-2xl overflow-hidden flex flex-col hover:border-line-strong transition-all duration-200">
              <div className="px-7 pt-7 pb-0">
                <h3 className="text-[18px] font-bold mb-2 tracking-[-0.01em]">
                  {es ? 'Métricas claras' : 'Clear metrics'}
                </h3>
                <p className="text-sm text-ink-3 leading-[1.6] mb-6">
                  {es
                    ? 'Ingresos del día, pedidos pendientes, productos activos. Sin gráficos confusos.'
                    : "Today's revenue, pending orders, active products. No confusing charts."}
                </p>
              </div>
              <div className="mt-auto pt-3 px-7 pb-7 flex items-end justify-center min-h-[140px]">
                <div className="grid grid-cols-2 gap-2 w-full max-w-[320px]">
                  {[
                    { es: 'Ingresos hoy', en: 'Revenue today', val: '$420', trend: '↑ 12%', warn: false },
                    { es: 'Pedidos',      en: 'Orders',        val: '8',    trend: '↑ 3',   warn: false },
                    { es: 'Activos',      en: 'Active',        val: '12',   trend: null,    warn: false },
                    { es: 'Pending',      en: 'Pending',       val: '3',    trend: null,    warn: true  },
                  ].map((s) => (
                    <div key={s.es} className="bg-white border border-line rounded-[10px] px-[14px] py-3">
                      <div className="text-[9px] text-ink-3 uppercase tracking-[0.05em] font-semibold mb-1.5">
                        {es ? s.es : s.en}
                      </div>
                      <div className={`text-[20px] font-bold tracking-[-0.01em] ${s.warn ? 'text-warn-ink' : ''}`}>{s.val}</div>
                      {s.trend && <div className="text-[10px] text-accent font-semibold font-jb-mono mt-0.5">{s.trend}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Your brand, your domain ── */}
            <div className="bg-bg-elev border border-line rounded-2xl overflow-hidden flex flex-col hover:border-line-strong transition-all duration-200">
              <div className="px-7 pt-7 pb-0">
                <h3 className="text-[18px] font-bold mb-2 tracking-[-0.01em]">
                  {es ? 'Tu marca, tu dominio' : 'Your brand, your domain'}
                </h3>
                <p className="text-sm text-ink-3 leading-[1.6] mb-6">
                  {es
                    ? 'El e-commerce funciona bajo tu propia marca y dominio. Sin "powered by" visible para tus clientes.'
                    : 'The e-commerce runs under your own brand and domain. No "powered by" visible to your customers.'}
                </p>
              </div>
              <div className="mt-auto pt-3 px-7 pb-7 flex items-end justify-center min-h-[140px]">
                <div className="w-full max-w-[320px] bg-white border border-line rounded-[10px] overflow-hidden shadow-sm">
                  <div className="bg-[#f5f5f4] border-b border-line px-3 py-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#d4d4d4]" />
                    <span className="w-2 h-2 rounded-full bg-[#d4d4d4]" />
                    <span className="w-2 h-2 rounded-full bg-[#d4d4d4]" />
                    <div className="flex-1 bg-white ml-1.5 px-2.5 py-[3px] rounded-[4px] font-jb-mono text-[10px] text-ink-2 border border-line flex items-center gap-[5px]">
                      <span className="text-ink-3 text-[9px]">🔒</span> tu-marca.com
                    </div>
                  </div>
                  <div
                    className="px-[14px] py-4"
                    style={{ background: 'linear-gradient(180deg, #fafaf9 0%, #ffffff 100%)' }}
                  >
                    <div className="font-display text-[16px] mb-1.5 text-ink">tu marca</div>
                    <div className="text-[10px] text-ink-3 mb-2.5">{es ? 'Pedidos online' : 'Online orders'}</div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        'linear-gradient(135deg, #d4a574, #a67c52)',
                        'linear-gradient(135deg, #c0d8a8, #8fb572)',
                        'linear-gradient(135deg, #e8a8b8, #c97a8a)',
                      ].map((g, i) => (
                        <div key={i} className="aspect-square rounded-[4px]" style={{ background: g }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══════════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-16 md:py-24">
        <div className="max-w-[1180px] mx-auto px-5 md:px-6">
          <SectionEyebrow>{es ? '— Precios' : '— Pricing'}</SectionEyebrow>
          <h2 className="font-display font-normal text-[clamp(32px,4.5vw,52px)] leading-[1.1] tracking-[-0.02em] mb-4 max-w-[720px]">
            {es ? (
              <>Una cuota mensual. <em className="italic text-ink-2">Nada más</em>.</>
            ) : (
              <>One monthly fee. <em className="italic text-ink-2">Nothing else</em>.</>
            )}
          </h2>
          <p className="text-[17px] text-ink-3 max-w-[560px] mb-14 leading-[1.55]">
            {es
              ? 'Un solo precio mensual por el panel. La tienda online está incluida sin costo adicional.'
              : 'One monthly price for the panel. The online store is included at no extra cost.'}
          </p>

          <div className="mt-12 max-w-[980px]">
            <div className="bg-ink text-white border border-ink rounded-2xl relative overflow-hidden">
              {/* Deal tag */}
              <span className="absolute top-4 right-4 bg-accent text-white text-[10px] font-bold px-2.5 py-1 rounded-full font-jb-mono tracking-[0.05em]">
                BETA
              </span>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr]">
                {/* Left: price */}
                <div className="px-12 py-11 flex flex-col border-b border-white/[0.08] md:border-b-0 md:border-r md:border-white/[0.08]">
                  <h3 className="text-sm font-semibold tracking-[0.02em] uppercase text-white/85 mb-[18px]">
                    {es ? 'Plan único' : 'Single plan'}
                  </h3>
                  <div className="font-display text-[56px] font-normal leading-none tracking-[-0.02em] mb-1 text-white">
                    $10
                    <small className="font-manrope text-sm font-medium text-white/60 ml-1.5">
                      USD/{es ? 'mes' : 'mo'}
                    </small>
                  </div>
                  <div className="text-[12px] text-white/55 mb-8 font-jb-mono">
                    {es ? '— precio beta · después $25/mes' : '— beta price · then $25/mo'}
                  </div>
                  <p className="text-[13px] text-white/70 mb-8 leading-normal min-h-[36px]">
                    {es
                      ? 'Todo lo necesario para vender online y gestionar tu negocio desde un solo lugar.'
                      : 'Everything you need to sell online and manage your business from a single place.'}
                  </p>
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-1.5 px-[18px] py-[10px] rounded-lg font-semibold text-sm cursor-pointer border border-white bg-white text-ink no-underline transition-all duration-[150ms] whitespace-nowrap mt-auto self-start hover:bg-[#f5f5f4]"
                  >
                    {es ? 'Empezar ahora' : 'Start now'}
                    <ChevronRight />
                  </Link>
                </div>

                {/* Right: feature list */}
                <div className="px-12 py-11 flex flex-col justify-center">
                  <ul className="flex flex-col gap-2.5 m-0">
                    {[
                      es ? <strong className="text-white">E-commerce incluido</strong> : <strong className="text-white">E-commerce included</strong>,
                      es ? 'Productos ilimitados, con fotos y tags' : 'Unlimited products, with photos and tags',
                      es ? 'Gestión de pedidos en tiempo real' : 'Real-time order management',
                      es ? 'Dashboard de métricas' : 'Metrics dashboard',
                      es ? 'Tu propio dominio y marca' : 'Your own domain and brand',
                      es ? 'Soporte directo y personalizado' : 'Direct, personalized support',
                      es ? 'Cancelación en cualquier momento' : 'Cancel anytime',
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="relative pl-[22px] text-sm text-white/70 leading-[1.5] before:content-['✓'] before:absolute before:left-0 before:text-accent before:font-bold"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══════════════════════════════════════════════════════════════ */}
      <div className="flex justify-center">
        <div
          id="cta"
          className="bg-ink text-white py-16 px-6 md:py-24 text-center rounded-2xl mt-4 mx-3 mb-10 md:mt-8 md:mx-6 md:mb-16 max-w-[1180px] w-full"
        >
          <h2 className="font-display font-normal text-[clamp(32px,4.5vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[640px] mx-auto mb-5 text-white">
            {es ? '¿Querés tener tu propia tienda online?' : 'Ready to sell online?'}
          </h2>
          <p className="text-[17px] text-white/65 max-w-[400px] mx-auto mb-8 leading-[1.55]">
            {es
              ? 'Escribinos por WhatsApp y te mostramos cómo quedaría tu tienda.'
              : "Write to us. We'll show you what your store would look like and we'll get started whenever you're ready."}
          </p>
          <a
            href="https://wa.me/61410461903"
            className="inline-flex items-center justify-center gap-1.5 px-[18px] py-[10px] rounded-lg font-semibold text-sm cursor-pointer border border-white bg-white text-ink no-underline transition-all duration-[150ms] whitespace-nowrap hover:bg-[#f5f5f4]"
          >
            <WhatsAppIcon />
            {es ? 'Contactame por WhatsApp' : 'Contact me on WhatsApp'}
          </a>
        </div>
      </div>

      {/* ═══ FOOTER ════════════════════════════════════════════════════════════ */}
      <footer className="pt-10 px-6 pb-14 border-t border-line">
        <div className="max-w-[1180px] mx-auto flex justify-between items-center flex-wrap gap-4">
          <span className="text-[13px] text-ink-3">
            © 2026 AdminPanel
          </span>
          <span className="font-jb-mono text-[11px] text-ink-3">v1.0 · BETA</span>
        </div>
      </footer>

    </div>
  )
}
