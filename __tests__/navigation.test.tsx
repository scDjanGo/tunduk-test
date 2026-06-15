import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
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

// ─── List page ────────────────────────────────────────────────────────────────

describe('CandidatesPage', () => {
  beforeEach(() => {
    vi.mocked(api.fetchCandidates).mockResolvedValue(mockCandidates)
  })

  it('renders the page heading', async () => {
    renderApp()
    expect(await screen.findByText('Candidate Dashboard')).toBeInTheDocument()
  })

  it('loads and displays candidates from the API', async () => {
    renderApp()
    // CandidateCard renders name in both desktop and mobile layouts → use getAllByText
    await waitFor(() => {
      expect(screen.getAllByText('Иванов Иван Иванович').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Петрова Анна Сергеевна').length).toBeGreaterThan(0)
    })
  })

  it('calls fetchCandidates exactly once on mount', async () => {
    renderApp()
    await waitFor(() => {
      expect(screen.getAllByText('Иванов Иван Иванович').length).toBeGreaterThan(0)
    })
    expect(vi.mocked(api.fetchCandidates)).toHaveBeenCalledTimes(1)
  })
})

// ─── List → Detail navigation ─────────────────────────────────────────────────

describe('Navigation: список → детальная страница', () => {
  beforeEach(() => {
    vi.mocked(api.fetchCandidates).mockResolvedValue(mockCandidates)
  })

  it('navigates to the detail page when a card is clicked', async () => {
    const user = userEvent.setup()
    renderApp()

    const card = await screen.findByRole('button', { name: /иванов иван иванович/i })
    await user.click(card)

    await screen.findByText('Контакты')
  })

  it('shows candidate full name as heading on detail page', async () => {
    const user = userEvent.setup()
    renderApp()

    const card = await screen.findByRole('button', { name: /иванов иван иванович/i })
    await user.click(card)

    await screen.findByRole('heading', { name: /иванов иван иванович/i })
  })

  it('shows all expected sections on detail page', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(await screen.findByRole('button', { name: /петрова анна/i }))

    await screen.findByText('Контакты')
    await screen.findByText('Опыт работы')
    await screen.findByText('Критерии оценки')
    await screen.findByText('Summary')
    await screen.findByText('Вопросы для собеседования')
  })

  it('displays candidate email on detail page', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(await screen.findByRole('button', { name: /иванов иван иванович/i }))

    await screen.findByText('ivanov@email.com')
  })

  it('navigates back to the list when "Назад" is clicked', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(await screen.findByRole('button', { name: /иванов иван иванович/i }))
    const backBtn = await screen.findByRole('button', { name: /назад к списку/i })
    await user.click(backBtn)

    await screen.findByText('Candidate Dashboard')
  })
})

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe('Edge cases', () => {
  it('shows error alert when API throws', async () => {
    vi.mocked(api.fetchCandidates).mockRejectedValue(new Error('Network error'))
    renderApp()

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('shows empty state when API returns empty array', async () => {
    vi.mocked(api.fetchCandidates).mockResolvedValue([])
    renderApp()

    // "Кандидаты не найдены" appears in CandidatesPage count AND CandidateList empty state
    await waitFor(() => {
      expect(screen.getAllByText(/не найден/i).length).toBeGreaterThan(0)
    })
  })

  it('shows 404 page when navigating to unknown candidate id', async () => {
    vi.mocked(api.fetchCandidates).mockResolvedValue(mockCandidates)
    renderApp('/candidate/nonexistent-xyz')

    await waitFor(
      () => {
        expect(screen.getByText(/не найден/i)).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })

  it('renders back button on 404 page', async () => {
    vi.mocked(api.fetchCandidates).mockResolvedValue(mockCandidates)
    renderApp('/candidate/nonexistent-xyz')

    await waitFor(
      () => {
        expect(screen.getByRole('button', { name: /вернуться к списку/i })).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })
})
