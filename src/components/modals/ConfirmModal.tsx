import type { ReactNode } from 'react'
import { Warning } from '@phosphor-icons/react'
import BaseModal from './BaseModal'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  /** "danger" for destructive actions (red confirm), "primary" otherwise. */
  variant?: 'danger' | 'primary'
  /** Disables the buttons and shows a working state on confirm. */
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * In-app confirmation dialog. Replaces the native window.confirm() so
 * destructive actions match the app's look instead of the browser's.
 */
export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const confirmClasses =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 focus-visible:outline-red-600'
      : 'bg-slate-900 hover:bg-slate-800 focus-visible:outline-slate-900'

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={loading ? undefined : onCancel}
      hideCloseButton
      className="max-w-md"
    >
      <div className="p-6">
        <div className="flex gap-4">
          <div
            className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-full ${
              variant === 'danger' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Warning size={22} weight="fill" />
          </div>
          <div className="min-w-0 pt-0.5">
            <h2 className="text-[16px] font-semibold text-slate-900">{title}</h2>
            {message && <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{message}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-[13px] font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${confirmClasses}`}
          >
            {loading ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </BaseModal>
  )
}
