import { Spinner } from './Spinner'

/**
 * Suspense fallback for the lazy-loaded route components in `routes.tsx`.
 * Mirrors the page background so the swap from loader to real content
 * doesn't flash a different color.
 */
export function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Spinner size="lg" className="text-blue-600" />
    </div>
  )
}
