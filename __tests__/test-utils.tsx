import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { reduxStore } from '../src/store/store'

interface WrapperProps {
  children: ReactNode
}

export function createWrapper() {
  const store = reduxStore()

  function Wrapper({ children }: WrapperProps) {
    return (
      <Provider store={store}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    )
  }

  return { store, Wrapper }
}

export function renderWithProviders(ui: ReactNode, options?: RenderOptions) {
  const { Wrapper } = createWrapper()
  return render(ui, { wrapper: Wrapper, ...options })
}
