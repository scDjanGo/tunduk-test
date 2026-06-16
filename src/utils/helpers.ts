import type { CandidateStatus, CriteriaStatus, VerdictClass } from '../types/candidate'

export const verdictBadgeClasses: Record<VerdictClass, string> = {
  'verdict-green': 'bg-emerald-100 text-emerald-800',
  'verdict-orange': 'bg-amber-100 text-amber-800',
  'verdict-red': 'bg-red-100 text-red-800',
}

export const criteriaRowClasses: Record<CriteriaStatus, string> = {
  ok: 'text-emerald-600',
  partial: 'text-amber-600',
  no: 'text-red-500',
}

export const criteriaIcons: Record<CriteriaStatus, string> = {
  ok: '✓',
  partial: '≈',
  no: '✗',
}

export const statusBadgeClasses: Record<CandidateStatus, string> = {
  new: 'bg-slate-100 text-slate-600',
  review: 'bg-blue-100 text-blue-700',
  invited: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-600',
}
