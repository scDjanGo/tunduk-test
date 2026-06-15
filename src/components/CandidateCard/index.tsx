import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Candidate } from '../../types/candidate'
import { VerdictBadge, StatusBadge } from '../StatusBadge'

interface CandidateCardProps {
  candidate: Candidate
}

export const CandidateCard = memo(function CandidateCard({ candidate }: CandidateCardProps) {
  const navigate = useNavigate()

  const handleClick = () => navigate(`/candidate/${candidate.id}`)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <article
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Открыть карточку кандидата ${candidate.name}`}
      className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      {/* Desktop layout — table row style */}
      <div className="hidden md:grid md:grid-cols-[2fr_1fr_auto_2fr_auto_auto] md:gap-4 md:items-center">
        <div>
          <p className="font-semibold text-gray-900 text-sm leading-snug">{candidate.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{candidate.pos_label}</p>
        </div>
        <p className="text-sm text-gray-600">{candidate.city}</p>
        <p className="text-sm text-gray-600 whitespace-nowrap">{candidate.total_exp}</p>
        <p className="text-xs text-gray-500 line-clamp-1">{candidate.stack}</p>
        <VerdictBadge verdict={candidate.verdict} vc={candidate.vc} />
        <StatusBadge status={candidate.status} />
      </div>

      {/* Mobile layout — card style */}
      <div className="md:hidden">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">{candidate.name}</h3>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <VerdictBadge verdict={candidate.verdict} vc={candidate.vc} />
            <StatusBadge status={candidate.status} />
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
          <span>📍 {candidate.city}</span>
          <span>⏱ {candidate.total_exp}</span>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2">{candidate.stack}</p>
      </div>
    </article>
  )
})
