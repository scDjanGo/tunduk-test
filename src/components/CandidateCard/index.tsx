import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Candidate } from '../../types/candidate'
import { VerdictBadge, StatusBadge } from '../StatusBadge'

interface CandidateCardProps {
  candidate: Candidate
}

/**
 * Single table row that adapts to viewport width via Tailwind's `md:` prefix:
 * desktop renders six `<td>` table cells, mobile collapses into one
 * `colSpan` cell styled as a card. Only one interactive element is ever
 * exposed per candidate (no duplicate role="button" nodes for AT/keyboard
 * users), regardless of which breakpoint is visually active.
 */
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
    <tr
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Открыть карточку кандидата ${candidate.name}`}
      className="cursor-pointer bg-white hover:bg-blue-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
    >
      {/* Desktop cells */}
      <td className="hidden md:table-cell px-4 py-3.5 align-middle">
        <p className="font-semibold text-gray-900 text-sm leading-snug">{candidate.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{candidate.pos_label}</p>
      </td>
      <td className="hidden md:table-cell px-4 py-3.5 align-middle text-sm text-gray-600 whitespace-nowrap">
        {candidate.city}
      </td>
      <td className="hidden md:table-cell px-4 py-3.5 align-middle text-sm text-gray-600 whitespace-nowrap">
        {candidate.total_exp}
      </td>
      <td className="hidden md:table-cell px-4 py-3.5 align-middle text-xs text-gray-500 max-w-xs truncate">
        {candidate.stack}
      </td>
      <td className="hidden md:table-cell px-4 py-3.5 align-middle whitespace-nowrap">
        <VerdictBadge verdict={candidate.verdict} vc={candidate.vc} />
      </td>
      <td className="hidden md:table-cell px-4 py-3.5 align-middle whitespace-nowrap">
        <StatusBadge status={candidate.status} />
      </td>

      {/* Mobile card cell */}
      <td className="table-cell md:hidden p-4" colSpan={6}>
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
      </td>
    </tr>
  )
})
