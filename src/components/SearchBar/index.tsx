import { useState, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/redux-hooks'
import { setSearch, selectFilters } from '../../store/filtersSlice'
import { useDebounce } from '../../hooks/useDebounce'

export function SearchBar() {
  const dispatch = useAppDispatch()
  const storeSearch = useAppSelector(selectFilters).search
  const [localSearch, setLocalSearch] = useState(storeSearch)
  const debouncedSearch = useDebounce(localSearch, 300)
  const lastDispatched = useRef(storeSearch)

  useEffect(() => {
    lastDispatched.current = debouncedSearch
    dispatch(setSearch(debouncedSearch))
  }, [debouncedSearch, dispatch])

  /**
   * Keeps the input in sync when the search term changes from outside this
   * component (URL parsing on mount, "Сбросить фильтры"). Guarded by
   * `lastDispatched` so the debounce-driven dispatch above doesn't loop
   * back and reset the user's in-progress typing.
   */
  useEffect(() => {
    if (storeSearch !== lastDispatched.current) {
      setLocalSearch(storeSearch)
    }
  }, [storeSearch])

  return (
    <div className="relative flex-1 min-w-0">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="search"
        placeholder="Поиск по ФИО..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        aria-label="Поиск по ФИО"
        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </div>
  )
}
