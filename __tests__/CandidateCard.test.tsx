import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CandidateList } from '../src/components/CandidateList'
import { mockCandidates } from './fixtures'

function renderWithRoutes() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="/"
          element={<CandidateList candidates={[mockCandidates[0]]} loading={false} />}
        />
        <Route path="/candidate/:id" element={<div>Детальная страница</div>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CandidateCard — keyboard activation', () => {
  it('navigates to the detail page when Enter is pressed', async () => {
    const user = userEvent.setup()
    renderWithRoutes()

    const row = screen.getByRole('button', { name: /иванов иван иванович/i })
    row.focus()
    await user.keyboard('{Enter}')

    expect(await screen.findByText('Детальная страница')).toBeInTheDocument()
  })

  it('navigates to the detail page when Space is pressed', async () => {
    const user = userEvent.setup()
    renderWithRoutes()

    const row = screen.getByRole('button', { name: /иванов иван иванович/i })
    row.focus()
    await user.keyboard(' ')

    expect(await screen.findByText('Детальная страница')).toBeInTheDocument()
  })

  it('does not navigate on unrelated key presses', async () => {
    const user = userEvent.setup()
    renderWithRoutes()

    const row = screen.getByRole('button', { name: /иванов иван иванович/i })
    row.focus()
    await user.keyboard('a')

    expect(screen.queryByText('Детальная страница')).not.toBeInTheDocument()
  })
})
