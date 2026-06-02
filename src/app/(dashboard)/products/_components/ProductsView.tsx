'use client'

import { useState, useTransition } from 'react'
import { createProduct, deleteProduct } from '../actions'

type Product = {
  id: string
  name: string
  tag: string | null
  price: number
  active: boolean
}

const INPUT_CLASS =
  'h-[42px] w-full bg-[#fafafa] border border-[#e4e4e7] rounded-[10px] px-3.5 text-sm text-black placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#71717a] transition-colors'

// Isolated modal component so its state resets every time it mounts
function AddProductModal({
  storeId,
  onClose,
}: {
  storeId: string
  onClose: () => void
}) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setError(null)
    startTransition(async () => {
      const result = await createProduct(storeId, null, formData)
      if (result?.error) setError(result.error)
      else if (result?.success) onClose()
    })
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[20px] shadow-xl w-full max-w-[480px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e4e4e7]">
          <h2 className="text-[15px] font-semibold text-black">New product</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f4f4f5] transition-colors text-[#71717a]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {/* Nombre */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-black">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              required
              placeholder="e.g. Chocolate cake"
              className={INPUT_CLASS}
            />
          </div>

          {/* Precio */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="price" className="text-sm font-medium text-black">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              type="number"
              name="price"
              required
              min="0"
              step="0.01"
              placeholder="0.00"
              className={INPUT_CLASS}
            />
          </div>

          {/* Tag */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="tag" className="text-sm font-medium text-black">
              Tag{' '}
              <span className="text-[12px] font-normal text-[#a1a1aa]">(optional)</span>
            </label>
            <input
              id="tag"
              type="text"
              name="tag"
              placeholder="e.g. gluten-free"
              className={INPUT_CLASS}
            />
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-black">
              Description{' '}
              <span className="text-[12px] font-normal text-[#a1a1aa]">(optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Product description..."
              className="w-full bg-[#fafafa] border border-[#e4e4e7] rounded-[10px] px-3.5 py-2.5 text-sm text-black placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#71717a] transition-colors resize-none"
            />
          </div>

          {/* Activo */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              name="active"
              defaultChecked
              className="w-4 h-4 rounded accent-black"
            />
            <span className="text-[13px] font-medium text-black">Publish as active</span>
          </label>

          {/* Error */}
          {error && <p className="text-[13px] text-red-500">{error}</p>}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#f4f4f5]">
            <button
              type="button"
              onClick={onClose}
              className="h-[38px] px-4 text-[13px] font-semibold text-[#71717a] bg-[#f4f4f5] rounded-[8px] hover:bg-[#e4e4e7] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="h-[38px] px-4 text-[13px] font-semibold text-white bg-black rounded-[8px] hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? 'Saving...' : 'Save product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function ProductsView({
  products,
  storeId,
}: {
  products: Product[]
  storeId: string
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [, startDelete] = useTransition()

  function handleDelete(productId: string, name: string) {
    if (!window.confirm(`Delete "${name}"?\nThis action cannot be undone.`)) return
    setDeletingId(productId)
    startDelete(async () => {
      await deleteProduct(productId)
      setDeletingId(null)
    })
  }

  return (
    <div className="p-7">
      {/* Topbar */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="text-[12px] text-[#a1a1aa] font-medium mb-0.5">
            AdminPanel &rsaquo; Products
          </p>
          <h1 className="text-[22px] font-bold text-black leading-tight">Products</h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 h-[36px] px-4 bg-black text-white text-[13px] font-semibold rounded-[8px] hover:bg-[#1a1a1a] transition-colors mt-1"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add product
        </button>
      </div>

      {/* Table card */}
      <div className="bg-white border border-[#e4e4e7] rounded-[14px] overflow-hidden">
        {products.length === 0 ? (
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
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <p className="text-[14px] font-semibold text-[#71717a]">No products yet</p>
            <p className="text-[13px] text-[#a1a1aa]">
              Click &quot;Add product&quot; to get started
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#f9f9f9] border-b border-[#e4e4e7]">
                {['Name', 'Tag', 'Price', 'Status', 'Actions'].map((col) => (
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
              {products.map((product, i) => (
                <tr
                  key={product.id}
                  className={[
                    'transition-opacity',
                    i < products.length - 1 ? 'border-b border-[#f4f4f5]' : '',
                    deletingId === product.id ? 'opacity-40' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <td className="px-5 py-3.5 text-[13px] font-medium text-black">
                    {product.name}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-[#71717a]">
                    {product.tag ?? '—'}
                  </td>
                  <td className="px-5 py-3.5 text-[13px] font-medium text-black tabular-nums">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5">
                    {product.active ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-50 text-green-600 border border-green-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#f4f4f5] text-[#71717a] border border-[#e4e4e7]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#a1a1aa]" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={deletingId !== null}
                      className="text-[13px] font-medium text-red-500 hover:text-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {deletingId === product.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal — remounts on each open so state is always fresh */}
      {modalOpen && (
        <AddProductModal storeId={storeId} onClose={() => setModalOpen(false)} />
      )}
    </div>
  )
}
