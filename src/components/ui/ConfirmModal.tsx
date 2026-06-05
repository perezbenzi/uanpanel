'use client'

type ConfirmModalProps = {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  danger = true,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[16px] shadow-xl w-full max-w-[380px] p-6">
        <p className="text-[15px] font-semibold text-black mb-2">{title}</p>
        <p className="text-[13px] text-[#71717a] mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-[36px] px-4 text-[13px] font-semibold text-[#71717a] bg-[#f4f4f5] rounded-[8px] hover:bg-[#e4e4e7] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`h-[36px] px-4 text-[13px] font-semibold text-white rounded-[8px] transition-colors ${
              danger
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-black hover:bg-[#1a1a1a]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
