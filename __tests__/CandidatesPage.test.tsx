import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import type { Candidate } from '../src/types/candidate'
import { AppRoutes } from '../src/routes'
import { reduxStore } from '../src/store/store'
import * as api from '../src/services/api'
import { mockCandidates } from './fixtures'

vi.mock('../src/services/api', () => ({
  fetchCandidates: vi.fn(),
  patchCandidateStatus: vi.fn(),
}))

function renderApp(initialRoute = '/') {
  return render(
    <Provider store={reduxStore()}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <AppRoutes />
      </MemoryRouter>
    </Provider>,
  )
}

function buildCandidates(count: number): Candidate[] {
  return Array.from({ length: count }, (_, i) => ({
    ...mockCandidates[0],
    id: `c-${i}`,
    name: `Кандидат ${i}`,
  }))
}

describe('CandidatesPage — pagination focus management', () => {
  beforeEach(() => {
    vi.mocked(api.fetchCandidates).mockResolvedValue(buildCandidates(15))
  })

  it('moves focus to the results count after changing page', async () => {
    const user = userEvent.setup()
    renderApp()

    await screen.findByText(/Найдено: 15/)
    const nextButton = screen.getByRole('button', { name: 'Следующая страница' })
    await user.click(nextButton)

    await waitFor(() => {
      expect(document.activeElement).toHaveTextContent(/Найдено: 15/)
    })
  })
})

describe('CandidatesPage — reset filters', () => {
  beforeEach(() => {
    vi.mocked(api.fetchCandidates).mockResolvedValue(mockCandidates)
  })

  it('clears the search query when "Сбросить фильтры" is clicked', async () => {
    const user = userEvent.setup()
    renderApp()

    const searchInput = await screen.findByRole('searchbox')
    await user.type(searchInput, 'Иванов')
    await waitFor(() => expect(screen.getByText(/поиск: «Иванов»/)).toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: 'Сбросить фильтры' }))

    await waitFor(() => expect(screen.queryByText(/поиск:/)).not.toBeInTheDocument())
    expect(searchInput).toHaveValue('')
  })
})

describe('CandidatesPage — count label pluralization', () => {
  it('uses "кандидат" for a single result', async () => {
    vi.mocked(api.fetchCandidates).mockResolvedValue(buildCandidates(1))
    renderApp()
    await screen.findByText(/Найдено: 1 кандидат(?!а|ов)/)
  })

  it('uses "кандидата" for results ending in 2-4', async () => {
    vi.mocked(api.fetchCandidates).mockResolvedValue(buildCandidates(3))
    renderApp()
    await screen.findByText(/Найдено: 3 кандидата/)
  })

  it('uses "кандидатов" for results ending in 5-9, 11-14, etc.', async () => {
    vi.mocked(api.fetchCandidates).mockResolvedValue(buildCandidates(15))
    renderApp()
    await screen.findByText(/Найдено: 15 кандидатов/)
  })
})
