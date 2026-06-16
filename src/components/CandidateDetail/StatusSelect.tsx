import type { CandidateStatus } from '../../types/candidate'
import { CANDIDATE_STATUS_LABELS, STATUS_FLOW } from '../../types/candidate'
import { useAppDispatch, useAppSelector } from '../../store/redux-hooks'
import { updateCandidateStatus, selectCandidatesUpdatingId } from '../../store/candidatesSlice'
import { Spinner } from '../UI/Spinner'
import type { ToastType } from '../../hooks/useToast'

interface StatusSelectProps {
  candidateId: string
  currentStatus: CandidateStatus
  onToast: (message: string, type: ToastType) => void
}

export function StatusSelect({ candidateId, currentStatus, onToast }: StatusSelectProps) {
  const dispatch = useAppDispatch()
  const updatingId = useAppSelector(selectCandidatesUpdatingId)
  const isUpdating = updatingId === candidateId

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as CandidateStatus
    if (newStatus === currentStatus) return

    try {
      await dispatch(updateCandidateStatus({ id: candidateId, status: newStatus })).unwrap()
      onToast('Статус успешно обновлён', 'success')
    } catch {
      onToast('Не удалось обновить статус. Попробуйте ещё раз.', 'error')
    }
  }

  return (
    <div className="flex items-center gap-3">
      <label htmlFor={`status-${candidateId}`} className="text-sm font-medium text-gray-600 shrink-0">
        Статус:
      </label>
      <div className="relative">
        <select
          id={`status-${candidateId}`}
          value={currentStatus}
          onChange={handleChange}
          disabled={isUpdating}
          aria-busy={isUpdating}
          className="appearance-none pl-3 pr-10 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {STATUS_FLOW.map((s) => (
            <option key={s} value={s}>
              {CANDIDATE_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        {isUpdating && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <Spinner size="sm" className="text-blue-600" />
          </div>
        )}
        {!isUpdating && (
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}
