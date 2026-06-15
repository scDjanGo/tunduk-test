import { createSlice, createSelector } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { FiltersState, SortField, SortDirection, VerdictFilter } from '../types/candidate'
import type { RootState } from './store'

const initialState: FiltersState = {
  search: '',
  verdict: 'ALL',
  sortField: 'createdAt',
  sortDirection: 'desc',
  page: 1,
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
      state.page = 1
    },
    setVerdict(state, action: PayloadAction<VerdictFilter>) {
      state.verdict = action.payload
      state.page = 1
    },
    setSortField(state, action: PayloadAction<SortField>) {
      if (state.sortField === action.payload) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        state.sortField = action.payload
        state.sortDirection = 'asc'
      }
      state.page = 1
    },
    setSortDirection(state, action: PayloadAction<SortDirection>) {
      state.sortDirection = action.payload
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    setFilters(_state, action: PayloadAction<Partial<FiltersState>>) {
      return { ...initialState, ...action.payload }
    },
    resetFilters() {
      return initialState
    },
  },
})

export const { setSearch, setVerdict, setSortField, setSortDirection, setPage, setFilters, resetFilters } =
  filtersSlice.actions

export default filtersSlice.reducer

export const selectFilters = (state: RootState) => state.filters

export const selectFiltersForUrl = createSelector(selectFilters, (filters) => ({
  search: filters.search || undefined,
  verdict: filters.verdict !== 'ALL' ? filters.verdict : undefined,
  sortField: filters.sortField !== 'createdAt' ? filters.sortField : undefined,
  sortDirection: filters.sortDirection !== 'desc' ? filters.sortDirection : undefined,
  page: filters.page !== 1 ? String(filters.page) : undefined,
}))
