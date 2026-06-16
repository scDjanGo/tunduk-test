import type { Candidate } from '../../types/candidate'
import { CandidateCard } from '../CandidateCard'
import { CandidateRow } from '../CandidateCard/CandidateRow'
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
      {/* Desktop layout — real table */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
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
            {candidates.map((candidate) => (
              <CandidateRow key={candidate.id} candidate={candidate} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile layout — card style */}
      <div className="md:hidden flex flex-col gap-2">
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </div>
  )
}
