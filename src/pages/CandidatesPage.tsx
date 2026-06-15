import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/redux-hooks'
import { setFilters, setPage, resetFilters, selectFilters, selectFiltersForUrl } from '../store/filtersSlice'
import { useCandidates } from '../hooks/useCandidates'
import { SearchBar } from '../components/SearchBar'
import { FilterPanel } from '../components/FilterPanel'
import { CandidateList } from '../components/CandidateList'
import { Pagination } from '../components/UI/Pagination'
import type { VerdictFilter, SortField, SortDirection } from '../types/candidate'

const VALID_VERDICTS: VerdictFilter[] = ['ALL', 'ПОДХОДИТ', 'ЧАСТИЧНО', 'НЕ СООТВЕТСТВУЕТ']
const VALID_SORTS: SortField[] = ['name', 'total_exp', 'createdAt']
const VALID_DIRS: SortDirection[] = ['asc', 'desc']

function parseUrlFilters(params: URLSearchParams) {
  const verdict = params.get('verdict') as VerdictFilter
  const sortField = params.get('sortField') as SortField
  const sortDirection = params.get('sortDirection') as SortDirection
  const page = parseInt(params.get('page') ?? '1', 10)

  return {
    search: params.get('search') ?? '',
    verdict: VALID_VERDICTS.includes(verdict) ? verdict : 'ALL',
    sortField: VALID_SORTS.includes(sortField) ? sortField : 'createdAt',
    sortDirection: VALID_DIRS.includes(sortDirection) ? sortDirection : 'desc',
    page: isNaN(page) || page < 1 ? 1 : page,
  } satisfies Parameters<typeof setFilters>[0]
}

export function CandidatesPage() {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useAppSelector(selectFilters)
  const filtersForUrl = useAppSelector(selectFiltersForUrl)
  const { items, total, totalPages, page, loading, error } = useCandidates()

  // Initialize filters from URL on mount
  useEffect(() => {
    dispatch(setFilters(parseUrlFilters(searchParams)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync store → URL on every filter change
  useEffect(() => {
    const cleanParams = Object.fromEntries(
      Object.entries(filtersForUrl).filter(([, v]) => v !== undefined),
    ) as Record<string, string>
    setSearchParams(cleanParams, { replace: true })
  }, [filtersForUrl, setSearchParams])

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Candidate Dashboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">React — ведущий программист</p>
          </div>
          <button
            onClick={() => dispatch(resetFilters())}
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-300 transition-colors"
          >
            Сбросить фильтры
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 space-y-3">
          <div className="flex gap-3 items-center flex-wrap">
            <SearchBar />
          </div>
          <FilterPanel />
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-gray-400 mb-3">
            {total === 0
              ? 'Кандидаты не найдены'
              : `Найдено: ${total} ${getCountLabel(total)}`}
            {filters.search && <span className="text-indigo-500"> · поиск: «{filters.search}»</span>}
          </p>
        )}

        {/* Error state */}
        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/* List */}
        {!error && <CandidateList candidates={items} loading={loading} />}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(p) => dispatch(setPage(p))}
            />
          </div>
        )}
      </div>
    </main>
  )
}

function getCountLabel(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return 'кандидат'
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'кандидата'
  return 'кандидатов'
}
