import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from '../src/components/UI/Pagination'

describe('Pagination — single page', () => {
  it('renders nothing when there is only one page', () => {
    const { container } = render(<Pagination page={1} totalPages={1} onPageChange={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('Pagination — small page count (<=7)', () => {
  it('renders a button for every page', () => {
    render(<Pagination page={1} totalPages={5} onPageChange={vi.fn()} />)
    for (const n of [1, 2, 3, 4, 5]) {
      expect(screen.getByRole('button', { name: String(n) })).toBeInTheDocument()
    }
  })

  it('marks the current page with aria-current', () => {
    render(<Pagination page={3} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: '3' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: '2' })).not.toHaveAttribute('aria-current')
  })

  it('disables the previous button on the first page', () => {
    render(<Pagination page={1} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Предыдущая страница' })).toBeDisabled()
  })

  it('disables the next button on the last page', () => {
    render(<Pagination page={5} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Следующая страница' })).toBeDisabled()
  })

  it('calls onPageChange with the clicked page number', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination page={1} totalPages={5} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: '3' }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('calls onPageChange with page - 1 when previous is clicked', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination page={3} totalPages={5} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: 'Предыдущая страница' }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange with page + 1 when next is clicked', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination page={3} totalPages={5} onPageChange={onPageChange} />)

    await user.click(screen.getByRole('button', { name: 'Следующая страница' }))
    expect(onPageChange).toHaveBeenCalledWith(4)
  })
})

describe('Pagination — large page count (>7) with ellipsis', () => {
  it('shows leading pages and a trailing ellipsis near the start', () => {
    render(<Pagination page={1} totalPages={12} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '12' })).toBeInTheDocument()
    expect(screen.getByText('…')).toBeInTheDocument()
  })

  it('shows ellipsis on both sides when current page is in the middle', () => {
    render(<Pagination page={6} totalPages={12} onPageChange={vi.fn()} />)
    const ellipses = screen.getAllByText('…')
    expect(ellipses).toHaveLength(2)
    expect(screen.getByRole('button', { name: '6' })).toHaveAttribute('aria-current', 'page')
  })

  it('shows a leading ellipsis near the end', () => {
    render(<Pagination page={12} totalPages={12} onPageChange={vi.fn()} />)
    expect(screen.getAllByText('…')).toHaveLength(1)
    expect(screen.getByRole('button', { name: '12' })).toHaveAttribute('aria-current', 'page')
  })
})
