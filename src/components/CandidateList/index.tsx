import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Candidate } from '../../types/candidate'
import { CandidateCard } from '../CandidateCard'
import { Spinner } from '../UI/Spinner'

interface CandidateListProps {
  candidates: Candidate[]
  loading: boolean
}

const TABLE_HEADERS = ['ФИО', 'Город', 'Опыт', 'Стек', 'Вердикт', 'Статус']
const ROW_HEIGHT_PX = 64
/**
 * Overscan covers the whole current page (PAGE_SIZE candidates), so every
 * row in the active page is always rendered. The virtualizer still only
 * mounts rows within its window — if PAGE_SIZE ever grows past this value,
 * off-screen rows in a long page are skipped automatically without any
 * change to this component.
 */
const OVERSCAN = 10

export function CandidateList({ candidates, loading }: CandidateListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  /**
   * `useVirtualizer()` returns functions that React Compiler can't safely
   * memoize, so it flags this hook call. That's fine here — the result is
   * only read locally below, never passed into a memoized child, so there's
   * no stale-UI risk to guard against.
   */
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: candidates.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT_PX,
    overscan: OVERSCAN,
    initialRect: { width: 0, height: ROW_HEIGHT_PX * OVERSCAN },
  })

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
        <Spinner size="lg" className="text-blue-600" />
        <p className="text-sm">Загрузка кандидатов...</p>
      </div>
    )
  }

  if (candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-gray-700 font-medium">Кандидаты не найдены</p>
        <p className="text-gray-400 text-sm mt-1">Попробуйте изменить параметры поиска или фильтры</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
      <div ref={scrollRef} className="">
        <table className="w-full">
          <thead className="hidden md:table-header-group">
            <tr className="bg-gray-50 border-b border-gray-200">
              {TABLE_HEADERS.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rowVirtualizer.getVirtualItems().map((virtualRow) => (
              <CandidateCard key={candidates[virtualRow.index].id} candidate={candidates[virtualRow.index]} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
