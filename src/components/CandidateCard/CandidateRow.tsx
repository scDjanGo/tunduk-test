import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Candidate } from '../../types/candidate'
import { VerdictBadge, StatusBadge } from '../StatusBadge'

interface CandidateRowProps {
  candidate: Candidate
}

export const CandidateRow = memo(function CandidateRow({ candidate }: CandidateRowProps) {
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
      className="cursor-pointer odd:bg-white even:bg-gray-50/40 hover:bg-indigo-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
    >
      <td className="px-4 py-3.5 align-middle">
        <p className="font-semibold text-gray-900 text-sm leading-snug">{candidate.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{candidate.pos_label}</p>
      </td>
      <td className="px-4 py-3.5 align-middle text-sm text-gray-600 whitespace-nowrap">{candidate.city}</td>
      <td className="px-4 py-3.5 align-middle text-sm text-gray-600 whitespace-nowrap">{candidate.total_exp}</td>
      <td className="px-4 py-3.5 align-middle text-xs text-gray-500 max-w-xs truncate">{candidate.stack}</td>
      <td className="px-4 py-3.5 align-middle whitespace-nowrap">
        <VerdictBadge verdict={candidate.verdict} vc={candidate.vc} />
      </td>
      <td className="px-4 py-3.5 align-middle whitespace-nowrap">
        <StatusBadge status={candidate.status} />
      </td>
    </tr>
  )
})
