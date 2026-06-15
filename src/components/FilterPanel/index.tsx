import { useAppDispatch, useAppSelector } from '../../store/redux-hooks'
import { setVerdict, setSortField, selectFilters } from '../../store/filtersSlice'
import type { VerdictFilter, SortField } from '../../types/candidate'
import { VERDICT_FILTER_LABELS, SORT_FIELD_LABELS } from '../../types/candidate'

const VERDICTS: VerdictFilter[] = ['ALL', 'ПОДХОДИТ', 'ЧАСТИЧНО', 'НЕ СООТВЕТСТВУЕТ']
const SORT_FIELDS: SortField[] = ['name', 'total_exp', 'createdAt']

export function FilterPanel() {
  const dispatch = useAppDispatch()
  const { verdict, sortField, sortDirection } = useAppSelector(selectFilters)

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
      {/* Verdict filter */}
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Фильтр по вердикту">
        {VERDICTS.map((v) => (
          <button
            key={v}
            onClick={() => dispatch(setVerdict(v))}
            aria-pressed={verdict === v}
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
              verdict === v
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {VERDICT_FILTER_LABELS[v]}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex gap-1.5 sm:ml-auto" role="group" aria-label="Сортировка">
        <span className="text-xs text-gray-400 self-center hidden sm:inline">Сортировка:</span>
        {SORT_FIELDS.map((field) => (
          <button
            key={field}
            onClick={() => dispatch(setSortField(field))}
            aria-pressed={sortField === field}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors flex items-center gap-1 ${
              sortField === field
                ? 'bg-gray-100 border-gray-300 text-gray-900 font-medium'
                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            {SORT_FIELD_LABELS[field]}
            {sortField === field && <span aria-hidden="true">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
