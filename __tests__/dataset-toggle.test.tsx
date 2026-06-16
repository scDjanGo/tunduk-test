import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '../src/routes'
import { reduxStore } from '../src/store/store'
import candidatesReducer, { setDataset } from '../src/store/candidatesSlice'
import * as api from '../src/services/api'
import { mockCandidates } from './fixtures'

vi.mock('../src/services/api', () => ({
  fetchCandidates: vi.fn(),
  patchCandidateStatus: vi.fn(),
}))

function renderApp() {
  return render(
    <Provider store={reduxStore()}>
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    </Provider>,
  )
}

describe('CandidatesPage — dataset toggle', () => {
  beforeEach(() => {
    vi.mocked(api.fetchCandidates).mockResolvedValue(mockCandidates)
  })

  it('requests the small dataset by default', async () => {
    renderApp()
    await screen.findByText(/Найдено: 3/)
    expect(api.fetchCandidates).toHaveBeenCalledWith('small')
  })

  it('switches to the large dataset and refetches when "120" is clicked', async () => {
    const user = userEvent.setup()
    renderApp()
    await screen.findByText(/Найдено: 3/)

    await user.click(screen.getByRole('button', { name: '120' }))

    await waitFor(() => expect(api.fetchCandidates).toHaveBeenCalledWith('large'))
  })

  it('marks the active dataset button as pressed', async () => {
    renderApp()
    await screen.findByText(/Найдено: 3/)
    expect(screen.getByRole('button', { name: '25' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '120' })).toHaveAttribute('aria-pressed', 'false')
  })
})

describe('CandidatesPage — pagination with the large dataset', () => {
  it('paginates 120 candidates into 12 pages of 10', async () => {
    vi.mocked(api.fetchCandidates).mockResolvedValue(
      Array.from({ length: 120 }, (_, i) => ({ ...mockCandidates[0], id: `c-${i}`, name: `Кандидат ${i}` })),
    )
    const user = userEvent.setup()
    renderApp()

    await screen.findByText(/Найдено: 120/)
    expect(screen.getAllByRole('button', { name: /Кандидат \d+/ }).length).toBe(10)
    expect(screen.getByRole('button', { name: '12' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '12' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '12' })).toHaveAttribute('aria-current', 'page')
    })
    expect(screen.getAllByRole('button', { name: /Кандидат \d+/ }).length).toBe(10)
  })
})

describe('candidatesSlice — setDataset reducer', () => {
  it('switches the dataset and resets loaded/items so a reload is triggered', () => {
    const loadedState = {
      items: mockCandidates,
      dataset: 'small' as const,
      loaded: true,
      loading: false,
      error: null,
      updatingId: null,
      pendingStatus: null,
    }
    const next = candidatesReducer(loadedState, setDataset('large'))
    expect(next.dataset).toBe('large')
    expect(next.loaded).toBe(false)
    expect(next.items).toEqual([])
  })

  it('does nothing when the dataset is already selected', () => {
    const state = {
      items: mockCandidates,
      dataset: 'small' as const,
      loaded: true,
      loading: false,
      error: null,
      updatingId: null,
      pendingStatus: null,
    }
    const next = candidatesReducer(state, setDataset('small'))
    expect(next).toEqual(state)
  })
})
