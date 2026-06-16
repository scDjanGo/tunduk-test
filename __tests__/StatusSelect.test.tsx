import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import candidatesReducer from '../src/store/candidatesSlice'
import filtersReducer from '../src/store/filtersSlice'
import { StatusSelect } from '../src/components/CandidateDetail/StatusSelect'
import * as api from '../src/services/api'
import { mockCandidates } from './fixtures'

vi.mock('../src/services/api', () => ({
  fetchCandidates: vi.fn(),
  patchCandidateStatus: vi.fn(),
}))

function renderWithStore(onToast = vi.fn()) {
  const store = configureStore({
    reducer: { candidates: candidatesReducer, filters: filtersReducer },
    preloadedState: { candidates: { items: mockCandidates, loaded: true, loading: false, error: null, updatingId: null, pendingStatus: null } },
  })
  render(
    <Provider store={store}>
      <StatusSelect candidateId="ivanov" currentStatus="new" onToast={onToast} />
    </Provider>,
  )
  return { store, onToast }
}

describe('StatusSelect', () => {
  beforeEach(() => {
    vi.mocked(api.patchCandidateStatus).mockReset()
  })

  it('shows a success toast and updates the store after a successful status change', async () => {
    vi.mocked(api.patchCandidateStatus).mockResolvedValue({ id: 'ivanov', status: 'review' })
    const user = userEvent.setup()
    const { store, onToast } = renderWithStore()

    await user.selectOptions(screen.getByLabelText('Статус:'), 'review')

    await waitFor(() => {
      expect(onToast).toHaveBeenCalledWith('Статус успешно обновлён', 'success')
    })
    expect(store.getState().candidates.items.find((c) => c.id === 'ivanov')?.status).toBe('review')
  })

  it('shows an error toast and rolls back the status when the API call fails', async () => {
    vi.mocked(api.patchCandidateStatus).mockRejectedValue(new Error('fail'))
    const user = userEvent.setup()
    const { store, onToast } = renderWithStore()

    await user.selectOptions(screen.getByLabelText('Статус:'), 'review')

    await waitFor(() => {
      expect(onToast).toHaveBeenCalledWith('Не удалось обновить статус. Попробуйте ещё раз.', 'error')
    })
    expect(store.getState().candidates.items.find((c) => c.id === 'ivanov')?.status).toBe('new')
  })

  it('does nothing when the selected value equals the current status', async () => {
    const user = userEvent.setup()
    const { onToast } = renderWithStore()

    await user.selectOptions(screen.getByLabelText('Статус:'), 'new')

    expect(onToast).not.toHaveBeenCalled()
    expect(api.patchCandidateStatus).not.toHaveBeenCalled()
  })
})
