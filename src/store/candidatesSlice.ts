import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import type { Candidate, CandidateStatus } from '../types/candidate'
import { PAGE_SIZE } from '../types/candidate'
import { fetchCandidates, patchCandidateStatus } from '../services/api'
import type { RootState } from './store'

interface CandidatesState {
  items: Candidate[]
  loaded: boolean
  loading: boolean
  error: string | null
  updatingId: string | null
  pendingStatus: { id: string; prevStatus: CandidateStatus } | null
}

const initialState: CandidatesState = {
  items: [],
  loaded: false,
  loading: false,
  error: null,
  updatingId: null,
  pendingStatus: null,
}

export const loadCandidates = createAsyncThunk('candidates/load', fetchCandidates)

export const updateCandidateStatus = createAsyncThunk<
  { id: string; status: CandidateStatus },
  { id: string; status: CandidateStatus }
>(
  'candidates/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await patchCandidateStatus(id, status)
    } catch {
      return rejectWithValue('Не удалось обновить статус')
    }
  },
)

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCandidates.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadCandidates.fulfilled, (state, { payload }) => {
        state.loading = false
        state.loaded = true
        state.items = payload
      })
      .addCase(loadCandidates.rejected, (state, { error }) => {
        state.loading = false
        state.error = error.message ?? 'Ошибка загрузки данных'
      })

      .addCase(updateCandidateStatus.pending, (state, { meta }) => {
        const candidate = state.items.find((c) => c.id === meta.arg.id)
        if (!candidate) return
        state.pendingStatus = { id: meta.arg.id, prevStatus: candidate.status }
        candidate.status = meta.arg.status
        state.updatingId = meta.arg.id
      })
      .addCase(updateCandidateStatus.fulfilled, (state) => {
        state.updatingId = null
        state.pendingStatus = null
      })
      .addCase(updateCandidateStatus.rejected, (state) => {
        if (state.pendingStatus) {
          const candidate = state.items.find((c) => c.id === state.pendingStatus!.id)
          if (candidate) candidate.status = state.pendingStatus.prevStatus
          state.pendingStatus = null
        }
        state.updatingId = null
      })
  },
})

export default candidatesSlice.reducer

// --- Base selectors ---

export const selectCandidatesLoaded = (state: RootState) => state.candidates.loaded
export const selectCandidatesLoading = (state: RootState) => state.candidates.loading
export const selectCandidatesError = (state: RootState) => state.candidates.error
export const selectCandidatesUpdatingId = (state: RootState) => state.candidates.updatingId

const selectItems = (state: RootState) => state.candidates.items
const selectFilters = (state: RootState) => state.filters

// --- Memoized selectors ---

const parseExp = (exp: string): number => {
  const match = exp.match(/[\d.]+/)
  return match ? parseFloat(match[0]) : 0
}

export const selectFilteredCandidates = createSelector(
  [selectItems, selectFilters],
  (items, filters) => {
    let result = items

    if (filters.verdict !== 'ALL') {
      result = result.filter((c) => c.verdict === filters.verdict)
    }

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim()
      result = result.filter((c) => c.name.toLowerCase().includes(q))
    }

    const { sortField, sortDirection } = filters
    const sorted = [...result].sort((a, b) => {
      let cmp = 0
      if (sortField === 'name') {
        cmp = a.name.localeCompare(b.name, 'ru')
      } else if (sortField === 'total_exp') {
        cmp = parseExp(a.total_exp) - parseExp(b.total_exp)
      } else {
        cmp = a.createdAt.localeCompare(b.createdAt)
      }
      return sortDirection === 'asc' ? cmp : -cmp
    })

    return sorted
  },
)

export const selectPaginatedCandidates = createSelector(
  [selectFilteredCandidates, selectFilters],
  (filtered, filters) => {
    const page = filters.page
    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    return { items, total, totalPages, page }
  },
)

export const selectCandidateById = (id: string) => (state: RootState) =>
  state.candidates.items.find((c) => c.id === id) ?? null
