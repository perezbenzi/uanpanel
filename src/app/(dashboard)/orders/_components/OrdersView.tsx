'use client'

import { useState, useTransition } from 'react'
import type { Order, OrderStatus } from '@/types'
import { updateOrderStatus } from '../actions'

const STATUS_CONFIG: Record<OrderStatus, { label: string; badgeClass: string }> = {
  pending: {
    label: 'Pending',
    badgeClass: 'bg-blue-50 text-blue-600 border border-blue-100',
  },
  confirmed: {
    label: 'Confirmed',
    badgeClass: 'bg-amber-50 text-amber-600 border border-amber-100',
  },
  ready: {
    label: 'Ready',
    badgeClass: 'bg-purple-50 text-purple-600 border border-purple-100',
  },
  collected: {
    label: 'Collected',
    badgeClass: 'bg-green-50 text-green-600 border border-green-100',
  },
  cancelled: {
    label: 'Cancelled',
    badgeClass: 'bg-red-50 text-red-600 border border-red-100',
  },
}

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as OrderStatus[]

const FILTERS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'ready', label: 'Ready' },
  { value: 'collected', label: 'Collected' },
  { value: 'cancelled', label: 'Cancelled' },
]

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function OrderRow({ order }: { order: Order }) {
  const [status, setStatus] = useState<OrderStatus>(order.status)
  const [pending, startTransition] = useTransition()

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as OrderStatus
    setStatus(next)
    startTransition(async () => {
      await updateOrderStatus(order.id, next)
    })
  }

  const { label, badgeClass } = STATUS_CONFIG[status] ?? {
    label: status,
    badgeClass: 'bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]',
  }

  return (
    <tr className="border-b border-[#f4f4f5] last:border-0">
      <td className="px-5 py-3.5 text-[13px] font-medium text-black font-mono">
        #{order.id.slice(0, 8).toUpperCase()}
      </td>
      <td className="px-5 py-3.5 text-[13px] text-black">{order.customer_name}</td>
      <td className="px-5 py-3.5 text-[13px] font-medium text-black tabular-nums">
        ${order.total.toFixed(2)}
      </td>
      <td className="px-5 py-3.5">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badgeClass}`}>
          {label}
        </span>
      </td>
      <td className="px-5 py-3.5 text-[13px] text-[#71717a]">{formatDate(order.created_at)}</td>
      <td className="px-5 py-3.5">
        <select
          value={status}
          onChange={handleStatusChange}
          disabled={pending}
          className="h-[30px] bg-[#fafafa] border border-[#e4e4e7] rounded-[6px] px-2 text-[12px] text-black focus:outline-none focus:border-[#71717a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_CONFIG[s].label}
            </option>
          ))}
        </select>
      </td>
    </tr>
  )
}

export function OrdersView({ orders }: { orders: Order[] }) {
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all')

  const filtered =
    activeFilter === 'all' ? orders : orders.filter((o) => o.status === activeFilter)

  return (
    <div className="p-7">
      {/* Topbar */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="text-[12px] text-[#a1a1aa] font-medium mb-0.5">
            AdminPanel &rsaquo; Orders
          </p>
          <h1 className="text-[22px] font-bold text-black leading-tight">Orders</h1>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={[
              'h-[32px] px-3.5 rounded-full text-[12px] font-medium transition-colors',
              activeFilter === f.value
                ? 'bg-black text-white'
                : 'bg-white border border-[#e4e4e7] text-[#71717a] hover:text-black hover:border-[#a1a1aa]',
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e4e4e7] rounded-[14px] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#d4d4d8]"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            <p className="text-[14px] font-semibold text-[#71717a]">
              {activeFilter === 'all' ? 'No orders yet' : 'No orders with this status'}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#f9f9f9] border-b border-[#e4e4e7]">
                {['ID', 'Customer', 'Total', 'Status', 'Date', 'Change status'].map((col) => (
                  <th
                    key={col}
                    className="px-5 py-3 text-left text-[11px] font-semibold text-[#71717a] uppercase tracking-wide"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
