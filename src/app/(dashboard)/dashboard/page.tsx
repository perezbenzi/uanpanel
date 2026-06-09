import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { OrderStatus } from '@/types'

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-blue-50 text-blue-600 border border-blue-100',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-amber-50 text-amber-600 border border-amber-100',
  },
  ready: {
    label: 'Ready',
    className: 'bg-purple-50 text-purple-600 border border-purple-100',
  },
  collected: {
    label: 'Collected',
    className: 'bg-green-50 text-green-600 border border-green-100',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-50 text-red-600 border border-red-100',
  },
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default async function DashboardPage() {
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

  const { data: store } = await supabase
    .from('stores')
    .select('store_id')
    .eq('tenant_id', tenant.id)
    .limit(1)
    .maybeSingle()

  if (!store) notFound()

  const now = new Date()
  const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString()
  const tomorrowStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)).toISOString()

  const [
    { count: activeProductsCount },
    { count: ordersTodayCount },
    { data: revenueTodayRows },
    { count: pendingCount },
    { data: recentOrders },
  ] = await Promise.all([
    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', store.store_id)
      .eq('active', true),

    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id)
      .gte('created_at', todayStart)
      .lt('created_at', tomorrowStart),

    supabase
      .from('orders')
      .select('total')
      .eq('tenant_id', tenant.id)
      .gte('created_at', todayStart)
      .lt('created_at', tomorrowStart)
      .neq('status', 'cancelled'),

    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id)
      .eq('status', 'pending'),

    supabase
      .from('orders')
      .select('id, customer_name, total, status, created_at')
      .eq('tenant_id', tenant.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const revenueToday = (revenueTodayRows ?? []).reduce((sum, o) => sum + (o.total ?? 0), 0)

  const statCards = [
    { label: 'Active products', value: String(activeProductsCount ?? 0), valueClass: 'text-black' },
    { label: 'Orders today', value: String(ordersTodayCount ?? 0), valueClass: 'text-black' },
    { label: 'Revenue today', value: `$${revenueToday.toFixed(2)} AUD`, valueClass: 'text-black' },
    { label: 'Pending', value: String(pendingCount ?? 0), valueClass: 'text-[#d97706]' },
  ]

  const orders = recentOrders ?? []

  return (
    <div className="px-[18px] py-4 md:p-7">
      {/* Topbar */}
      <div className="flex items-start justify-between mb-5 md:mb-7">
        <div>
          <p className="text-[12px] text-[#a1a1aa] font-medium mb-0.5">
            AdminPanel &rsaquo; Dashboard
          </p>
          <h1 className="text-[20px] md:text-[22px] font-bold text-black leading-tight">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <a
            href="/products"
            className="flex items-center gap-1.5 h-[36px] px-3 md:px-4 bg-black text-white text-[12px] md:text-[13px] font-semibold rounded-[8px] hover:bg-[#1a1a1a] transition-colors whitespace-nowrap"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New product
          </a>
        </div>
      </div>

      {/* Stat cards — 2 cols mobile, 4 cols sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5 md:mb-7">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-[#e4e4e7] rounded-[14px] px-3 py-3 sm:px-5 sm:py-5"
          >
            <p className="text-[9px] sm:text-[11px] font-medium text-[#71717a] mb-1.5 sm:mb-2 uppercase tracking-wide leading-tight">
              {card.label}
            </p>
            <p className={`text-[18px] sm:text-[26px] font-bold leading-none ${card.valueClass}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent orders table */}
      <div className="bg-white border border-[#e4e4e7] rounded-[14px] overflow-hidden">
        <div className="px-4 md:px-5 py-4 border-b border-[#e4e4e7]">
          <h2 className="text-[14px] font-semibold text-black">Recent orders</h2>
        </div>
        {orders.length === 0 ? (
          <div className="py-16 flex items-center justify-center">
            <p className="text-[14px] text-[#71717a]">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f9f9f9] border-b border-[#e4e4e7]">
                  <th className="hidden md:table-cell px-[10px] md:px-5 py-2.5 md:py-3 text-left text-[10px] md:text-[11px] font-semibold text-[#71717a] uppercase tracking-wide">
                    ID
                  </th>
                  <th className="px-[10px] md:px-5 py-2.5 md:py-3 text-left text-[10px] md:text-[11px] font-semibold text-[#71717a] uppercase tracking-wide">
                    Customer
                  </th>
                  <th className="px-[10px] md:px-5 py-2.5 md:py-3 text-left text-[10px] md:text-[11px] font-semibold text-[#71717a] uppercase tracking-wide">
                    Total
                  </th>
                  <th className="px-[10px] md:px-5 py-2.5 md:py-3 text-left text-[10px] md:text-[11px] font-semibold text-[#71717a] uppercase tracking-wide">
                    Status
                  </th>
                  <th className="hidden md:table-cell px-[10px] md:px-5 py-2.5 md:py-3 text-left text-[10px] md:text-[11px] font-semibold text-[#71717a] uppercase tracking-wide">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => {
                  const status = STATUS_CONFIG[order.status as OrderStatus]
                  return (
                    <tr
                      key={order.id}
                      className={i < orders.length - 1 ? 'border-b border-[#f4f4f5]' : ''}
                    >
                      <td className="hidden md:table-cell px-[10px] md:px-5 py-[10px] md:py-3.5 text-[11px] md:text-[13px] font-medium text-black font-mono">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-[10px] md:px-5 py-[10px] md:py-3.5 text-[11px] md:text-[13px] text-black">
                        {order.customer_name}
                      </td>
                      <td className="px-[10px] md:px-5 py-[10px] md:py-3.5 text-[11px] md:text-[13px] font-medium text-black tabular-nums">
                        ${(order.total as number).toFixed(2)}
                      </td>
                      <td className="px-[10px] md:px-5 py-[10px] md:py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-[11px] font-semibold ${status?.className ?? 'bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]'}`}
                        >
                          {status?.label ?? order.status}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-[10px] md:px-5 py-[10px] md:py-3.5 text-[11px] md:text-[13px] text-[#71717a]">
                        {formatDate(order.created_at as string)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
