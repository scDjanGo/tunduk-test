import { describe, it, expect } from 'vitest'
import { selectFilteredCandidates } from '../src/store/candidatesSlice'
import type { RootState } from '../src/store/store'
import type { FiltersState } from '../src/types/candidate'
import { mockCandidates } from './fixtures'

function makeState(filters: Partial<FiltersState> = {}): RootState {
  return {
    candidates: {
      items: mockCandidates,
      loading: false,
      error: null,
      updatingId: null,
      pendingStatus: null,
    },
    filters: {
      search: '',
      verdict: 'ALL',
      sortField: 'createdAt',
      sortDirection: 'desc',
      page: 1,
      ...filters,
    },
  }
}

describe('filters — verdict', () => {
  it('returns all candidates when verdict is ALL', () => {
    expect(selectFilteredCandidates(makeState())).toHaveLength(3)
  })

  it('filters to ПОДХОДИТ only', () => {
    const result = selectFilteredCandidates(makeState({ verdict: 'ПОДХОДИТ' }))
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('petrova')
  })

  it('filters to ЧАСТИЧНО only', () => {
    const result = selectFilteredCandidates(makeState({ verdict: 'ЧАСТИЧНО' }))
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('ivanov')
  })

  it('filters to НЕ СООТВЕТСТВУЕТ only', () => {
    const result = selectFilteredCandidates(makeState({ verdict: 'НЕ СООТВЕТСТВУЕТ' }))
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('sidorov')
  })

  it('returns empty array when no candidates match verdict', () => {
    const state = makeState({ verdict: 'ПОДХОДИТ' })
    state.candidates.items = mockCandidates.filter((c) => c.verdict !== 'ПОДХОДИТ')
    expect(selectFilteredCandidates(state)).toHaveLength(0)
  })
})

describe('filters — search', () => {
  it('filters by full name', () => {
    const result = selectFilteredCandidates(makeState({ search: 'Иванов Иван Иванович' }))
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('ivanov')
  })

  it('is case-insensitive', () => {
    const result = selectFilteredCandidates(makeState({ search: 'иванов' }))
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('ivanov')
  })

  it('supports partial match', () => {
    // "анна" uniquely matches "Петрова Анна Сергеевна"; "петров" would also hit "Петрович"
    const result = selectFilteredCandidates(makeState({ search: 'анна' }))
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('petrova')
  })

  it('returns all when search is empty string', () => {
    expect(selectFilteredCandidates(makeState({ search: '' }))).toHaveLength(3)
  })

  it('returns all when search is only whitespace', () => {
    expect(selectFilteredCandidates(makeState({ search: '   ' }))).toHaveLength(3)
  })

  it('returns empty array when nothing matches', () => {
    expect(selectFilteredCandidates(makeState({ search: 'несуществующий' }))).toHaveLength(0)
  })
})

describe('filters — combined', () => {
  it('applies verdict AND search simultaneously', () => {
    // Иванов — ЧАСТИЧНО; search="иванов" + verdict="ПОДХОДИТ" → 0
    const result = selectFilteredCandidates(makeState({ search: 'иванов', verdict: 'ПОДХОДИТ' }))
    expect(result).toHaveLength(0)
  })
})

describe('filters — sorting', () => {
  it('sorts by name ascending (А→Я)', () => {
    const ids = selectFilteredCandidates(makeState({ sortField: 'name', sortDirection: 'asc' })).map(
      (c) => c.id,
    )
    // И(иванов) < П(петрова) < С(сидоров) in Russian collation
    expect(ids).toEqual(['ivanov', 'petrova', 'sidorov'])
  })

  it('sorts by name descending (Я→А)', () => {
    const ids = selectFilteredCandidates(makeState({ sortField: 'name', sortDirection: 'desc' })).map(
      (c) => c.id,
    )
    expect(ids).toEqual(['sidorov', 'petrova', 'ivanov'])
  })

  it('sorts by total_exp descending (больший опыт первым)', () => {
    // petrova: 6.5, ivanov: 3.5, sidorov: 0.8
    const ids = selectFilteredCandidates(
      makeState({ sortField: 'total_exp', sortDirection: 'desc' }),
    ).map((c) => c.id)
    expect(ids).toEqual(['petrova', 'ivanov', 'sidorov'])
  })

  it('sorts by total_exp ascending', () => {
    const ids = selectFilteredCandidates(
      makeState({ sortField: 'total_exp', sortDirection: 'asc' }),
    ).map((c) => c.id)
    expect(ids).toEqual(['sidorov', 'ivanov', 'petrova'])
  })

  it('sorts by createdAt descending (новейший первым)', () => {
    // ivanov: 2026-04-10, petrova: 2026-04-09, sidorov: 2026-04-08
    const ids = selectFilteredCandidates(
      makeState({ sortField: 'createdAt', sortDirection: 'desc' }),
    ).map((c) => c.id)
    expect(ids).toEqual(['ivanov', 'petrova', 'sidorov'])
  })

  it('sorts by createdAt ascending', () => {
    const ids = selectFilteredCandidates(
      makeState({ sortField: 'createdAt', sortDirection: 'asc' }),
    ).map((c) => c.id)
    expect(ids).toEqual(['sidorov', 'petrova', 'ivanov'])
  })
})
