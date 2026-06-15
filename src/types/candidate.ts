export type CriteriaStatus = 'ok' | 'partial' | 'no'
export type CriteriaItem = [CriteriaStatus, string]

export type ExpItem = [string, string, string, string]

export type Verdict = 'ПОДХОДИТ' | 'ЧАСТИЧНО' | 'НЕ СООТВЕТСТВУЕТ'
export type VerdictClass = 'verdict-green' | 'verdict-orange' | 'verdict-red'

export type CandidateStatus = 'new' | 'review' | 'invited' | 'rejected'

export type SortField = 'name' | 'total_exp' | 'createdAt'
export type SortDirection = 'asc' | 'desc'

export type VerdictFilter = 'ALL' | Verdict

export interface Candidate {
  id: string
  name: string
  position: string
  pos_label: string
  file: string
  email: string
  phone: string | null
  city: string
  tg: string
  exp: ExpItem[]
  total_exp: string
  stack: string
  edu: string
  verdict: Verdict
  vc: VerdictClass
  criteria: CriteriaItem[]
  summary: string
  questions: string[]
  status: CandidateStatus
  createdAt: string
}

export interface FiltersState {
  search: string
  verdict: VerdictFilter
  sortField: SortField
  sortDirection: SortDirection
  page: number
}

export const CANDIDATE_STATUS_LABELS: Record<CandidateStatus, string> = {
  new: 'Новый',
  review: 'На рассмотрении',
  invited: 'Приглашён',
  rejected: 'Отклонён',
}

export const VERDICT_FILTER_LABELS: Record<VerdictFilter, string> = {
  ALL: 'Все',
  'ПОДХОДИТ': 'Подходит',
  'ЧАСТИЧНО': 'Частично',
  'НЕ СООТВЕТСТВУЕТ': 'Не соответствует',
}

export const SORT_FIELD_LABELS: Record<SortField, string> = {
  name: 'По имени',
  total_exp: 'По опыту',
  createdAt: 'По дате',
}

export const STATUS_FLOW: CandidateStatus[] = ['new', 'review', 'invited', 'rejected']

export const PAGE_SIZE = 10
