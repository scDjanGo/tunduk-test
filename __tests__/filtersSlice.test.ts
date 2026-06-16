import { describe, it, expect } from 'vitest'
import filtersReducer, {
  setSearch,
  setVerdict,
  setSortField,
  setSortDirection,
  setPage,
  setFilters,
  resetFilters,
} from '../src/store/filtersSlice'
import type { FiltersState } from '../src/types/candidate'

const initialState: FiltersState = {
  search: '',
  verdict: 'ALL',
  sortField: 'createdAt',
  sortDirection: 'desc',
  page: 1,
}

describe('filtersSlice reducer', () => {
  it('returns the initial state by default', () => {
    expect(filtersReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('setSearch updates the query and resets the page', () => {
    const state = filtersReducer({ ...initialState, page: 3 }, setSearch('Иван'))
    expect(state.search).toBe('Иван')
    expect(state.page).toBe(1)
  })

  it('setVerdict updates the verdict filter and resets the page', () => {
    const state = filtersReducer({ ...initialState, page: 2 }, setVerdict('ПОДХОДИТ'))
    expect(state.verdict).toBe('ПОДХОДИТ')
    expect(state.page).toBe(1)
  })

  it('setSortField switches to a new field with ascending direction', () => {
    const state = filtersReducer({ ...initialState, page: 2 }, setSortField('name'))
    expect(state.sortField).toBe('name')
    expect(state.sortDirection).toBe('asc')
    expect(state.page).toBe(1)
  })

  it('setSortField toggles direction when the same field is selected again', () => {
    const sorted = { ...initialState, sortField: 'name' as const, sortDirection: 'asc' as const }
    const state = filtersReducer(sorted, setSortField('name'))
    expect(state.sortField).toBe('name')
    expect(state.sortDirection).toBe('desc')
  })

  it('setSortDirection sets the direction explicitly', () => {
    const state = filtersReducer(initialState, setSortDirection('asc'))
    expect(state.sortDirection).toBe('asc')
  })

  it('setPage sets the current page', () => {
    const state = filtersReducer(initialState, setPage(5))
    expect(state.page).toBe(5)
  })

  it('setFilters merges partial filters over the initial state', () => {
    const state = filtersReducer(
      { ...initialState, page: 4, search: 'old' },
      setFilters({ verdict: 'НЕ СООТВЕТСТВУЕТ', page: 2 }),
    )
    expect(state).toEqual({ ...initialState, verdict: 'НЕ СООТВЕТСТВУЕТ', page: 2 })
  })

  it('resetFilters restores the initial state', () => {
    const dirty: FiltersState = {
      search: 'test',
      verdict: 'ПОДХОДИТ',
      sortField: 'name',
      sortDirection: 'asc',
      page: 7,
    }
    expect(filtersReducer(dirty, resetFilters())).toEqual(initialState)
  })
})
