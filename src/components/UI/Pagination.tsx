interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function getPages(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '...')[] = [1]
  if (current > 3) pages.push('...')
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const btnBase = 'min-w-9 h-9 flex items-center justify-center rounded-md text-sm transition-colors'
  const btnDefault = 'text-gray-600 hover:bg-gray-100'
  const btnActive = 'bg-blue-600 text-white font-medium'
  const btnDisabled = 'opacity-40 cursor-not-allowed'

  return (
    <nav aria-label="Пагинация" className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`${btnBase} px-2 ${page === 1 ? btnDisabled : btnDefault}`}
        aria-label="Предыдущая страница"
      >
        ←
      </button>

      {getPages(page, totalPages).map((p, i) =>
        p === '...' ? (
          <span key={`e${i}`} className="w-9 text-center text-gray-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={page === p ? 'page' : undefined}
            className={`${btnBase} ${page === p ? btnActive : btnDefault}`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={`${btnBase} px-2 ${page === totalPages ? btnDisabled : btnDefault}`}
        aria-label="Следующая страница"
      >
        →
      </button>
    </nav>
  )
}
