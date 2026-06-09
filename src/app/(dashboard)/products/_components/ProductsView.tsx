'use client'

import { useRef, useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createProduct, deleteProduct, updateProduct, toggleProductActive } from '../actions'
import { ConfirmModal } from '@/components/ui/ConfirmModal'

type Product = {
  id: string
  name: string
  tag: string | null
  price: number
  active: boolean
  description: string | null
  image_url: string | null
}

const INPUT_CLASS =
  'h-[42px] w-full bg-[#fafafa] border border-[#e4e4e7] rounded-[10px] px-3.5 text-sm text-black placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#71717a] transition-colors'

// ─── Image upload area ────────────────────────────────────────────────────────

function ImageUploadArea({
  preview,
  error,
  onFile,
  onRemove,
}: {
  preview: string | null
  error: string | null
  onFile: (file: File) => void
  onRemove: () => void
}) {
  const ref = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-black">
        Image{' '}
        <span className="text-[12px] font-normal text-[#a1a1aa]">(optional)</span>
      </label>
      <div
        className="relative h-[120px] border-2 border-dashed border-[#e4e4e7] rounded-[10px] overflow-hidden cursor-pointer hover:border-[#a1a1aa] transition-colors"
        onClick={() => ref.current?.click()}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove() }}
              className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M8 2L2 8M2 2l6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-1.5 pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <p className="text-[13px] text-[#a1a1aa]">Click to upload image</p>
          </div>
        )}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onFile(file)
            e.target.value = ''
          }}
        />
      </div>
      {error && <p className="text-[13px] text-red-500">{error}</p>}
    </div>
  )
}

// ─── Upload helper ────────────────────────────────────────────────────────────

async function uploadImage(file: File, storeId: string): Promise<{ url: string } | { error: string }> {
  const supabase = createClient()
  const path = `${storeId}/products/${Date.now()}-${file.name}`
  const { error } = await supabase.storage.from('store-assets').upload(path, file)
  if (error) return { error: error.message }
  const { data } = supabase.storage.from('store-assets').getPublicUrl(path)
  return { url: data.publicUrl }
}

// ─── Status toggle badge ──────────────────────────────────────────────────────

function StatusToggle({ productId, active }: { productId: string; active: boolean }) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          await toggleProductActive(productId, !active)
        })
      }
      disabled={pending}
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        active
          ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'
          : 'bg-[#f4f4f5] text-[#71717a] border-[#e4e4e7] hover:bg-[#e4e4e7]',
      ].join(' ')}
    >
      <span
        className={[
          'w-1.5 h-1.5 rounded-full',
          active ? 'bg-green-500' : 'bg-[#a1a1aa]',
        ].join(' ')}
      />
      {active ? 'Active' : 'Inactive'}
    </button>
  )
}

// ─── Shared modal form fields ─────────────────────────────────────────────────

function ProductFormFields({
  product,
  imagePreview,
  imageError,
  onFile,
  onRemove,
  error,
  busy,
  uploading,
  pending,
  onClose,
  mode,
}: {
  product?: Product
  imagePreview: string | null
  imageError: string | null
  onFile: (file: File) => void
  onRemove: () => void
  error: string | null
  busy: boolean
  uploading: boolean
  pending: boolean
  onClose: () => void
  mode: 'add' | 'edit'
}) {
  return (
    <>
      <ImageUploadArea
        preview={imagePreview}
        error={imageError}
        onFile={onFile}
        onRemove={onRemove}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${mode}-name`} className="text-sm font-medium text-black">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id={`${mode}-name`}
          type="text"
          name="name"
          required
          defaultValue={product?.name}
          placeholder="e.g. Chocolate cake"
          className={INPUT_CLASS}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${mode}-price`} className="text-sm font-medium text-black">
          Price <span className="text-red-500">*</span>
        </label>
        <input
          id={`${mode}-price`}
          type="number"
          name="price"
          required
          min="0"
          step="0.01"
          defaultValue={product?.price}
          placeholder="0.00"
          className={INPUT_CLASS}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${mode}-tag`} className="text-sm font-medium text-black">
          Tag{' '}
          <span className="text-[12px] font-normal text-[#a1a1aa]">(optional)</span>
        </label>
        <input
          id={`${mode}-tag`}
          type="text"
          name="tag"
          defaultValue={product?.tag ?? ''}
          placeholder="e.g. gluten-free"
          className={INPUT_CLASS}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${mode}-description`} className="text-sm font-medium text-black">
          Description{' '}
          <span className="text-[12px] font-normal text-[#a1a1aa]">(optional)</span>
        </label>
        <textarea
          id={`${mode}-description`}
          name="description"
          rows={3}
          defaultValue={product?.description ?? ''}
          placeholder="Product description..."
          className="w-full bg-[#fafafa] border border-[#e4e4e7] rounded-[10px] px-3.5 py-2.5 text-sm text-black placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#71717a] transition-colors resize-none"
        />
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          name="active"
          defaultChecked={product?.active ?? true}
          className="w-4 h-4 rounded accent-black"
        />
        <span className="text-[13px] font-medium text-black">Publish as active</span>
      </label>

      {error && <p className="text-[13px] text-red-500">{error}</p>}

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
          disabled={busy}
          className="h-[38px] px-4 text-[13px] font-semibold text-white bg-black rounded-[8px] hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : pending ? 'Saving...' : mode === 'add' ? 'Save product' : 'Save changes'}
        </button>
      </div>
    </>
  )
}

// ─── Modal shell (bottom-sheet on mobile, centered on desktop) ────────────────

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-[20px] sm:rounded-[20px] shadow-xl w-full sm:max-w-[480px] max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-[#e4e4e7] sticky top-0 bg-white z-10">
          <h2 className="text-[15px] font-semibold text-black">{title}</h2>
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
        {children}
      </div>
    </div>
  )
}

// ─── Add product modal ────────────────────────────────────────────────────────

function AddProductModal({ storeId, onClose }: { storeId: string; onClose: () => void }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)

  function handleFile(file: File) {
    if (file.size > 2 * 1024 * 1024) { setImageError('Image must be under 2MB'); return }
    setImageError(null)
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function handleRemove() {
    setImageFile(null)
    setImagePreview(null)
    setImageError(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setError(null)
    if (imageFile) {
      setUploading(true)
      const result = await uploadImage(imageFile, storeId)
      setUploading(false)
      if ('error' in result) { setError(result.error); return }
      formData.set('image_url', result.url)
    }
    startTransition(async () => {
      const result = await createProduct(storeId, null, formData)
      if (result?.error) setError(result.error)
      else if (result?.success) onClose()
    })
  }

  return (
    <ModalShell title="New product" onClose={onClose}>
      <form onSubmit={handleSubmit} className="px-5 sm:px-6 py-5 flex flex-col gap-4">
        <ProductFormFields
          imagePreview={imagePreview}
          imageError={imageError}
          onFile={handleFile}
          onRemove={handleRemove}
          error={error}
          busy={uploading || pending}
          uploading={uploading}
          pending={pending}
          onClose={onClose}
          mode="add"
        />
      </form>
    </ModalShell>
  )
}

// ─── Edit product modal ───────────────────────────────────────────────────────

function EditProductModal({
  product,
  storeId,
  onClose,
}: {
  product: Product
  storeId: string
  onClose: () => void
}) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(product.image_url)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(product.image_url)
  const [imageError, setImageError] = useState<string | null>(null)

  function handleFile(file: File) {
    if (file.size > 2 * 1024 * 1024) { setImageError('Image must be under 2MB'); return }
    setImageError(null)
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setExistingImageUrl(null)
  }

  function handleRemove() {
    setImageFile(null)
    setImagePreview(null)
    setExistingImageUrl(null)
    setImageError(null)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setError(null)
    let imageUrl: string | null = existingImageUrl
    if (imageFile) {
      setUploading(true)
      const result = await uploadImage(imageFile, storeId)
      setUploading(false)
      if ('error' in result) { setError(result.error); return }
      imageUrl = result.url
    }
    if (imageUrl) formData.set('image_url', imageUrl)
    startTransition(async () => {
      const result = await updateProduct(product.id, storeId, null, formData)
      if (result?.error) setError(result.error)
      else if (result?.success) onClose()
    })
  }

  return (
    <ModalShell title="Edit product" onClose={onClose}>
      <form onSubmit={handleSubmit} className="px-5 sm:px-6 py-5 flex flex-col gap-4">
        <ProductFormFields
          product={product}
          imagePreview={imagePreview}
          imageError={imageError}
          onFile={handleFile}
          onRemove={handleRemove}
          error={error}
          busy={uploading || pending}
          uploading={uploading}
          pending={pending}
          onClose={onClose}
          mode="edit"
        />
      </form>
    </ModalShell>
  )
}

// ─── Products view ────────────────────────────────────────────────────────────

export function ProductsView({ products, storeId }: { products: Product[]; storeId: string }) {
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [, startDelete] = useTransition()

  function handleDelete(productId: string) {
    setDeletingId(productId)
    startDelete(async () => {
      await deleteProduct(productId)
      setDeletingId(null)
    })
  }

  return (
    <div className="px-[18px] py-4 md:p-7">
      {/* Topbar */}
      <div className="flex items-start justify-between mb-5 md:mb-7">
        <div>
          <p className="text-[12px] text-[#a1a1aa] font-medium mb-0.5">
            AdminPanel &rsaquo; Products
          </p>
          <h1 className="text-[20px] md:text-[22px] font-bold text-black leading-tight">
            Products
          </h1>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-1.5 h-[36px] px-3 md:px-4 bg-black text-white text-[12px] md:text-[13px] font-semibold rounded-[8px] hover:bg-[#1a1a1a] transition-colors mt-1 whitespace-nowrap"
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f9f9f9] border-b border-[#e4e4e7]">
                  <th className="px-[10px] md:px-5 py-2.5 md:py-3 text-left text-[10px] md:text-[11px] font-semibold text-[#71717a] uppercase tracking-wide">
                    Name
                  </th>
                  <th className="hidden md:table-cell px-[10px] md:px-5 py-2.5 md:py-3 text-left text-[10px] md:text-[11px] font-semibold text-[#71717a] uppercase tracking-wide">
                    Tag
                  </th>
                  <th className="px-[10px] md:px-5 py-2.5 md:py-3 text-left text-[10px] md:text-[11px] font-semibold text-[#71717a] uppercase tracking-wide">
                    Price
                  </th>
                  <th className="px-[10px] md:px-5 py-2.5 md:py-3 text-left text-[10px] md:text-[11px] font-semibold text-[#71717a] uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-[10px] md:px-5 py-2.5 md:py-3 text-left text-[10px] md:text-[11px] font-semibold text-[#71717a] uppercase tracking-wide">
                    Actions
                  </th>
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
                    <td className="px-[10px] md:px-5 py-[10px] md:py-3.5">
                      <div className="flex items-center gap-2 md:gap-3">
                        {product.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.image_url}
                            alt=""
                            className="w-7 h-7 md:w-8 md:h-8 rounded-[6px] object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-[6px] bg-[#f4f4f5] flex-shrink-0" />
                        )}
                        <span className="text-[11px] md:text-[13px] font-medium text-black">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-[10px] md:px-5 py-[10px] md:py-3.5 text-[11px] md:text-[13px] text-[#71717a]">
                      {product.tag ?? '—'}
                    </td>
                    <td className="px-[10px] md:px-5 py-[10px] md:py-3.5 text-[11px] md:text-[13px] font-medium text-black tabular-nums">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-[10px] md:px-5 py-[10px] md:py-3.5">
                      <StatusToggle productId={product.id} active={product.active} />
                    </td>
                    <td className="px-[10px] md:px-5 py-[10px] md:py-3.5">
                      <div className="flex items-center gap-2 md:gap-3">
                        <button
                          onClick={() => setEditProduct(product)}
                          disabled={deletingId !== null}
                          className="text-[11px] md:text-[13px] font-medium text-[#71717a] hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmDelete({ id: product.id, name: product.name })}
                          disabled={deletingId !== null}
                          className="text-[11px] md:text-[13px] font-medium text-red-500 hover:text-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {deletingId === product.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {addModalOpen && (
        <AddProductModal storeId={storeId} onClose={() => setAddModalOpen(false)} />
      )}
      {editProduct && (
        <EditProductModal
          product={editProduct}
          storeId={storeId}
          onClose={() => setEditProduct(null)}
        />
      )}
      <ConfirmModal
        isOpen={confirmDelete !== null}
        title="Delete product"
        message={`Are you sure you want to delete "${confirmDelete?.name}"? This action cannot be undone.`}
        onConfirm={() => { handleDelete(confirmDelete!.id); setConfirmDelete(null) }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}
