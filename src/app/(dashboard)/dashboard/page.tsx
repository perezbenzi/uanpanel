import type { OrderStatus } from '@/types'

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  nuevo: {
    label: 'Nuevo',
    className: 'bg-blue-50 text-blue-600 border border-blue-100',
  },
  en_preparacion: {
    label: 'En preparación',
    className: 'bg-amber-50 text-amber-600 border border-amber-100',
  },
  entregado: {
    label: 'Entregado',
    className: 'bg-green-50 text-green-600 border border-green-100',
  },
  cancelado: {
    label: 'Cancelado',
    className: 'bg-red-50 text-red-600 border border-red-100',
  },
}

const RECENT_ORDERS: {
  id: string
  customer: string
  total: string
  status: OrderStatus
  date: string
}[] = [
  { id: '#2401', customer: 'Laura Díaz', total: '$52.00 AUD', status: 'entregado', date: '31 May 2026' },
  { id: '#2402', customer: 'Marcos Gil', total: '$38.50 AUD', status: 'en_preparacion', date: '31 May 2026' },
  { id: '#2403', customer: 'Ana Torres', total: '$97.00 AUD', status: 'nuevo', date: '31 May 2026' },
]

const STAT_CARDS = [
  { label: 'Productos activos', value: '12', valueClass: 'text-black' },
  { label: 'Órdenes hoy', value: '8', valueClass: 'text-black' },
  { label: 'Revenue hoy', value: '$284 AUD', valueClass: 'text-black' },
  { label: 'Pendientes', value: '3', valueClass: 'text-[#d97706]' },
]

export default function DashboardPage() {
  return (
    <div className="p-7">
      {/* Topbar */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="text-[12px] text-[#a1a1aa] font-medium mb-0.5">
            AdminPanel &rsaquo; Dashboard
          </p>
          <h1 className="text-[22px] font-bold text-black leading-tight">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3 mt-1">
          {/* Tenant pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e4e4e7] rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
            <span className="text-[13px] font-medium text-black">Baked by Clara</span>
          </div>
          {/* New product button */}
          <button className="flex items-center gap-1.5 h-[36px] px-4 bg-black text-white text-[13px] font-semibold rounded-[8px] hover:bg-[#1a1a1a] transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Nuevo producto
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-[#e4e4e7] rounded-[14px] px-5 py-5"
          >
            <p className="text-[12px] font-medium text-[#71717a] mb-2 uppercase tracking-wide">
              {card.label}
            </p>
            <p className={`text-[30px] font-bold leading-none ${card.valueClass}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent orders table */}
      <div className="bg-white border border-[#e4e4e7] rounded-[14px] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e4e4e7]">
          <h2 className="text-[14px] font-semibold text-black">Últimas órdenes</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-[#f9f9f9] border-b border-[#e4e4e7]">
              {['ID', 'Cliente', 'Total', 'Estado', 'Fecha'].map((col) => (
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
            {RECENT_ORDERS.map((order, i) => {
              const status = STATUS_CONFIG[order.status]
              return (
                <tr
                  key={order.id}
                  className={i < RECENT_ORDERS.length - 1 ? 'border-b border-[#f4f4f5]' : ''}
                >
                  <td className="px-5 py-3.5 text-[13px] font-medium text-black font-mono">
                    {order.id}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-black">{order.customer}</td>
                  <td className="px-5 py-3.5 text-[13px] font-medium text-black">
                    {order.total}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#71717a]">{order.date}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
