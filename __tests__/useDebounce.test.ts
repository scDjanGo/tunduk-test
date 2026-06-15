import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '../src/hooks/useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns the initial value immediately without delay', () => {
    const { result } = renderHook(() => useDebounce('initial', 300))
    expect(result.current).toBe('initial')
  })

  it('does not update the value before the delay elapses', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), {
      initialProps: { v: 'a' },
    })

    rerender({ v: 'b' })
    act(() => void vi.advanceTimersByTime(299))

    expect(result.current).toBe('a')
  })

  it('updates the value exactly when delay elapses', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), {
      initialProps: { v: 'a' },
    })

    rerender({ v: 'b' })
    act(() => void vi.advanceTimersByTime(300))

    expect(result.current).toBe('b')
  })

  it('cancels intermediate values and only applies the last one', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), {
      initialProps: { v: 'a' },
    })

    rerender({ v: 'ab' })
    act(() => void vi.advanceTimersByTime(100))
    rerender({ v: 'abc' })
    act(() => void vi.advanceTimersByTime(100))
    rerender({ v: 'abcd' })

    // Still showing initial value — no timer fired yet
    expect(result.current).toBe('a')

    act(() => void vi.advanceTimersByTime(300))
    // Only the last value is applied
    expect(result.current).toBe('abcd')
  })

  it('resets the timer when value changes before delay', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), {
      initialProps: { v: 'first' },
    })

    rerender({ v: 'second' })
    act(() => void vi.advanceTimersByTime(250)) // almost done
    rerender({ v: 'third' })                    // reset timer
    act(() => void vi.advanceTimersByTime(250)) // not enough (only 250ms of new timer)

    expect(result.current).toBe('first') // still original

    act(() => void vi.advanceTimersByTime(50)) // now 300ms elapsed since "third"
    expect(result.current).toBe('third')
  })

  it('cleans up the timer on unmount to avoid memory leaks', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout')

    const { rerender, unmount } = renderHook(({ v }) => useDebounce(v, 300), {
      initialProps: { v: 'a' },
    })

    rerender({ v: 'b' }) // starts a timer
    unmount()             // should cancel it

    expect(clearSpy).toHaveBeenCalled()
    clearSpy.mockRestore()
  })

  it('works with numeric values', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 200), {
      initialProps: { v: 0 },
    })

    rerender({ v: 42 })
    act(() => void vi.advanceTimersByTime(200))

    expect(result.current).toBe(42)
  })
})
