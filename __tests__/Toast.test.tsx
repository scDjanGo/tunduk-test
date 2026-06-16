import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toast } from '../src/components/UI/Toast'

describe('Toast', () => {
  it('renders nothing when not visible', () => {
    const { container } = render(
      <Toast toast={{ message: 'hi', type: 'success', visible: false }} onClose={vi.fn()} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders a success message with the success icon', () => {
    render(<Toast toast={{ message: 'Готово', type: 'success', visible: true }} onClose={vi.fn()} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Готово')
    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('renders an error message with the error icon and styling', () => {
    render(<Toast toast={{ message: 'Ошибка', type: 'error', visible: true }} onClose={vi.fn()} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Ошибка')
    expect(screen.getByText('✕')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Toast toast={{ message: 'Готово', type: 'success', visible: true }} onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: 'Закрыть уведомление' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
