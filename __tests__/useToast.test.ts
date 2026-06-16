import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useToast } from '../src/hooks/useToast'

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts hidden', () => {
    const { result } = renderHook(() => useToast())
    expect(result.current.toast.visible).toBe(false)
  })

  it('shows a toast with the given message and type', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.showToast('Готово', 'success')
    })
    expect(result.current.toast).toEqual({ message: 'Готово', type: 'success', visible: true })
  })

  it('auto-hides the toast after 3 seconds', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.showToast('Ошибка', 'error')
    })
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(result.current.toast.visible).toBe(false)
  })

  it('hideToast hides the toast immediately and clears the pending timer', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.showToast('Готово')
    })
    act(() => {
      result.current.hideToast()
    })
    expect(result.current.toast.visible).toBe(false)
  })

  it('restarts the auto-hide timer when shown again before it fires', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.showToast('Первое')
    })
    act(() => {
      vi.advanceTimersByTime(2000)
      result.current.showToast('Второе')
    })
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(result.current.toast.visible).toBe(true)
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.toast.visible).toBe(false)
  })

  it('clears the pending timer on unmount without throwing', () => {
    const { result, unmount } = renderHook(() => useToast())
    act(() => {
      result.current.showToast('Готово')
    })
    expect(() => unmount()).not.toThrow()
  })
})
