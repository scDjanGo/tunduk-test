import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { reduxStore } from '../src/store/store'
import { FilterPanel } from '../src/components/FilterPanel'

function renderWithStore() {
  const store = reduxStore()
  render(
    <Provider store={store}>
      <FilterPanel />
    </Provider>,
  )
  return store
}

describe('FilterPanel', () => {
  it('dispatches setVerdict when a verdict button is clicked', async () => {
    const user = userEvent.setup()
    const store = renderWithStore()

    await user.click(screen.getByRole('button', { name: 'Подходит' }))

    expect(store.getState().filters.verdict).toBe('ПОДХОДИТ')
  })

  it('marks the active verdict button as pressed', async () => {
    const user = userEvent.setup()
    renderWithStore()

    const button = screen.getByRole('button', { name: 'Подходит' })
    await user.click(button)

    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('dispatches setSortField when a sort button is clicked', async () => {
    const user = userEvent.setup()
    const store = renderWithStore()

    await user.click(screen.getByRole('button', { name: /по имени/i }))

    expect(store.getState().filters.sortField).toBe('name')
    expect(store.getState().filters.sortDirection).toBe('asc')
  })

  it('shows a direction arrow next to the active sort field', async () => {
    const user = userEvent.setup()
    renderWithStore()

    const button = screen.getByRole('button', { name: /по имени/i })
    await user.click(button)

    expect(button).toHaveTextContent('↑')
  })

  it('toggles sort direction when the active sort field is clicked again', async () => {
    const user = userEvent.setup()
    const store = renderWithStore()

    const button = screen.getByRole('button', { name: /по имени/i })
    await user.click(button)
    await user.click(button)

    expect(store.getState().filters.sortDirection).toBe('desc')
  })
})
