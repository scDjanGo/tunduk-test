import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/redux-hooks'
import { setFilters, setPage, resetFilters, selectFilters, selectFiltersForUrl } from '../store/filtersSlice'
import { setDataset } from '../store/candidatesSlice'
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
  const { items, total, totalPages, page, loading, error, dataset } = useCandidates()
  const listTopRef = useRef<HTMLParagraphElement>(null)

  const handlePageChange = (p: number) => {
    dispatch(setPage(p))
    listTopRef.current?.focus()
  }

  const handleDatasetChange = (next: 'small' | 'large') => {
    dispatch(setDataset(next))
  }

  /**
   * Runs once on mount to seed the store from whatever filters/page/sort
   * were already in the URL (deep link, browser back/forward, refresh).
   * Intentionally has no deps — re-running on every searchParams change
   * would fight with the sync effect below and reset user interaction.
   */
  useEffect(() => {
    dispatch(setFilters(parseUrlFilters(searchParams)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Mirrors filter/sort/page state back into the URL so it stays
   * shareable and survives a refresh. `replace: true` avoids polluting
   * browser history with one entry per keystroke/filter click.
   */
  useEffect(() => {
    const cleanParams = Object.fromEntries(
      Object.entries(filtersForUrl).filter(([, v]) => v !== undefined),
    ) as Record<string, string>
    setSearchParams(cleanParams, { replace: true })
  }, [filtersForUrl, setSearchParams])

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Candidate Dashboard</h1>
            <p className="text-sm text-gray-400 mt-0.5">React — ведущий программист</p>
          </div>
          <div className="flex items-center gap-3">
            <div role="group" aria-label="Размер набора данных" className="flex text-sm border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => handleDatasetChange('small')}
                aria-pressed={dataset === 'small'}
                className={`px-3 py-1.5 transition-colors ${
                  dataset === 'small' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                25
              </button>
              <button
                onClick={() => handleDatasetChange('large')}
                aria-pressed={dataset === 'large'}
                className={`px-3 py-1.5 transition-colors border-l border-gray-200 ${
                  dataset === 'large' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                120
              </button>
            </div>
            <button
              onClick={() => dispatch(resetFilters())}
              className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-300 transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 space-y-3">
          <div className="flex gap-3 items-center flex-wrap">
            <SearchBar />
          </div>
          <FilterPanel />
        </div>

        {!loading && (
          <p ref={listTopRef} tabIndex={-1} className="text-sm text-gray-400 mb-3 focus:outline-none">
            {total === 0
              ? 'Кандидаты не найдены'
              : `Найдено: ${total} ${getCountLabel(total)}`}
            {filters.search && <span className="text-indigo-500"> · поиск: «{filters.search}»</span>}
          </p>
        )}

        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        {!error && <CandidateList candidates={items} loading={loading} />}

        {!loading && totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
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
