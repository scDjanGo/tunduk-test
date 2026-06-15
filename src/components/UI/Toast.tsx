import type { ToastState } from '../../hooks/useToast'

interface ToastProps {
  toast: ToastState
  onClose: () => void
}

export function Toast({ toast, onClose }: ToastProps) {
  if (!toast.visible) return null

  const colorClasses =
    toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-64 max-w-sm ${colorClasses}`}
    >
      <span className="text-lg">{toast.type === 'success' ? '✓' : '✕'}</span>
      <span className="flex-1 text-sm font-medium">{toast.message}</span>
      <button
        onClick={onClose}
        aria-label="Закрыть уведомление"
        className="opacity-70 hover:opacity-100 text-xl leading-none"
      >
        ×
      </button>
    </div>
  )
}
