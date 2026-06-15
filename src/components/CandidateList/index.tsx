import type { Candidate } from '../../types/candidate'
import { CandidateCard } from '../CandidateCard'
import { Spinner } from '../UI/Spinner'

interface CandidateListProps {
  candidates: Candidate[]
  loading: boolean
}

const TABLE_HEADERS = ['ФИО', 'Город', 'Опыт', 'Стек', 'Вердикт', 'Статус']

export function CandidateList({ candidates, loading }: CandidateListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
        <Spinner size="lg" />
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
    <div>
      {/* Desktop table header */}
      <div className="hidden md:grid md:grid-cols-[2fr_1fr_auto_2fr_auto_auto] md:gap-4 px-4 py-2 mb-1">
        {TABLE_HEADERS.map((h) => (
          <span key={h} className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            {h}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </div>
  )
}
