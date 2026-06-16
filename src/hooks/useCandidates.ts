import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/redux-hooks'
import {
  loadCandidates,
  selectCandidatesLoaded,
  selectCandidatesLoading,
  selectCandidatesError,
  selectPaginatedCandidates,
  selectDataset,
} from '../store/candidatesSlice'

export function useCandidates() {
  const dispatch = useAppDispatch()
  const { items, total, totalPages, page } = useAppSelector(selectPaginatedCandidates)
  const loaded = useAppSelector(selectCandidatesLoaded)
  const loading = useAppSelector(selectCandidatesLoading)
  const error = useAppSelector(selectCandidatesError)
  const dataset = useAppSelector(selectDataset)

  useEffect(() => {
    if (!loaded && !loading) {
      void dispatch(loadCandidates())
    }
  }, [dispatch, loaded, loading])

  return { items, total, totalPages, page, loading, error, dataset }
}
