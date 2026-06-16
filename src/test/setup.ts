import '@testing-library/jest-dom'

/**
 * jsdom has no layout engine and does not implement ResizeObserver. Stub it
 * so libraries that rely on it (e.g. @tanstack/react-virtual) can register
 * observers without throwing; size measurement itself is irrelevant under
 * jsdom and is handled separately via each virtualizer's `initialRect`.
 */
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver

/**
 * jsdom has no layout engine, so every element's offsetWidth/offsetHeight
 * is always 0. @tanstack/react-virtual reads these on mount to size its
 * scroll container, which would otherwise make it think the viewport has
 * zero height and render no rows. Stubbing non-zero values here lets
 * virtualized lists behave under tests the way they do in a real browser.
 */
Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 800 })
Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 640 })
