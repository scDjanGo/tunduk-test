import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../store/redux-hooks'
import { loadCandidates, selectCandidatesLoading, selectCandidatesError, selectPaginatedCandidates } from '../store/candidatesSlice'

export function useCandidates() {
  const dispatch = useAppDispatch()
  const { items, total, totalPages, page } = useAppSelector(selectPaginatedCandidates)
  const loading = useAppSelector(selectCandidatesLoading)
  const error = useAppSelector(selectCandidatesError)
  const dispatched = useRef(false)

  useEffect(() => {
    if (!dispatched.current) {
      dispatched.current = true
      void dispatch(loadCandidates())
    }
  }, [dispatch])

  return { items, total, totalPages, page, loading, error }
}
