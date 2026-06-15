import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { CandidateList } from '../src/components/CandidateList'
import { VerdictBadge } from '../src/components/StatusBadge'
import { mockCandidates } from './fixtures'

function withRouter(ui: ReactNode) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

// ─── Loading state ────────────────────────────────────────────────────────────

describe('CandidateList — loading state', () => {
  it('shows a loading spinner while loading', () => {
    withRouter(<CandidateList candidates={[]} loading={true} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('shows loading text while loading', () => {
    withRouter(<CandidateList candidates={[]} loading={true} />)
    expect(screen.getByText(/загрузка/i)).toBeInTheDocument()
  })

  it('does not render candidate names while loading', () => {
    withRouter(<CandidateList candidates={mockCandidates} loading={true} />)
    expect(screen.queryByText('Иванов Иван Иванович')).not.toBeInTheDocument()
  })
})

// ─── Empty state ──────────────────────────────────────────────────────────────

describe('CandidateList — empty state', () => {
  it('shows an empty-result message when list is empty and not loading', () => {
    withRouter(<CandidateList candidates={[]} loading={false} />)
    expect(screen.getByText(/не найден/i)).toBeInTheDocument()
  })

  it('suggests changing filters or search in empty state', () => {
    withRouter(<CandidateList candidates={[]} loading={false} />)
    expect(screen.getByText(/фильтр/i)).toBeInTheDocument()
  })

  it('does not show the spinner when empty and not loading', () => {
    withRouter(<CandidateList candidates={[]} loading={false} />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
})

// ─── Candidate display ────────────────────────────────────────────────────────

describe('CandidateList — candidate display', () => {
  it('renders a clickable card for each candidate', () => {
    withRouter(<CandidateList candidates={mockCandidates} loading={false} />)
    expect(screen.getAllByRole('button')).toHaveLength(mockCandidates.length)
  })

  it('displays candidate names', () => {
    withRouter(<CandidateList candidates={mockCandidates} loading={false} />)
    // On desktop grid and mobile card both render — getAllByText handles duplicates
    expect(screen.getAllByText('Иванов Иван Иванович').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Петрова Анна Сергеевна').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Сидоров Алексей Петрович').length).toBeGreaterThan(0)
  })

  it('displays city for a candidate', () => {
    withRouter(<CandidateList candidates={[mockCandidates[0]]} loading={false} />)
    expect(screen.getAllByText(/Бишкек/).length).toBeGreaterThan(0)
  })

  it('displays experience for a candidate', () => {
    withRouter(<CandidateList candidates={[mockCandidates[0]]} loading={false} />)
    expect(screen.getAllByText(/3\.5/).length).toBeGreaterThan(0)
  })

  it('each card has an accessible label with the candidate name', () => {
    withRouter(<CandidateList candidates={[mockCandidates[0]]} loading={false} />)
    expect(
      screen.getByRole('button', { name: /Иванов Иван Иванович/i }),
    ).toBeInTheDocument()
  })
})

// ─── Verdict colour indication ────────────────────────────────────────────────

describe('VerdictBadge — colour indication', () => {
  it('applies green (emerald) styles for ПОДХОДИТ', () => {
    render(<VerdictBadge verdict="ПОДХОДИТ" vc="verdict-green" />)
    const badge = screen.getByText('ПОДХОДИТ')
    expect(badge.className).toMatch(/emerald/)
  })

  it('applies orange (amber) styles for ЧАСТИЧНО', () => {
    render(<VerdictBadge verdict="ЧАСТИЧНО" vc="verdict-orange" />)
    const badge = screen.getByText('ЧАСТИЧНО')
    expect(badge.className).toMatch(/amber/)
  })

  it('applies red styles for НЕ СООТВЕТСТВУЕТ', () => {
    render(<VerdictBadge verdict="НЕ СООТВЕТСТВУЕТ" vc="verdict-red" />)
    const badge = screen.getByText('НЕ СООТВЕТСТВУЕТ')
    expect(badge.className).toMatch(/red/)
  })

  it('shows the verdict text inside the badge', () => {
    render(<VerdictBadge verdict="ПОДХОДИТ" vc="verdict-green" />)
    expect(screen.getByText('ПОДХОДИТ')).toBeInTheDocument()
  })
})
