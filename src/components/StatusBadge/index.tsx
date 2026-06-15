import { Badge } from '../UI/Badge'
import { verdictBadgeClasses, statusBadgeClasses } from '../../utils/helpers'
import type { VerdictClass, CandidateStatus, Verdict } from '../../types/candidate'
import { CANDIDATE_STATUS_LABELS } from '../../types/candidate'

interface VerdictBadgeProps {
  verdict: Verdict
  vc: VerdictClass
}

export function VerdictBadge({ verdict, vc }: VerdictBadgeProps) {
  return <Badge className={verdictBadgeClasses[vc]}>{verdict}</Badge>
}

interface StatusBadgeProps {
  status: CandidateStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge className={statusBadgeClasses[status]}>{CANDIDATE_STATUS_LABELS[status]}</Badge>
}
