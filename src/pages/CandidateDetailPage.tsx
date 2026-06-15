import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/redux-hooks'
import { loadCandidates, selectCandidateById, selectCandidatesLoading } from '../store/candidatesSlice'
import { selectFiltersForUrl } from '../store/filtersSlice'
import { CandidateDetail } from '../components/CandidateDetail'
import { Spinner } from '../components/UI/Spinner'

export function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const candidate = useAppSelector(selectCandidateById(id ?? ''))
  const loading = useAppSelector(selectCandidatesLoading)
  const filtersForUrl = useAppSelector(selectFiltersForUrl)
  const dispatched = useRef(false)

  // Load candidates if navigated directly to this URL
  useEffect(() => {
    if (!dispatched.current && !candidate) {
      dispatched.current = true
      void dispatch(loadCandidates())
    }
  }, [dispatch, candidate])

  const handleBack = () => {
    const cleanParams = Object.fromEntries(
      Object.entries(filtersForUrl).filter(([, v]) => v !== undefined),
    ) as Record<string, string>
    const qs = new URLSearchParams(cleanParams).toString()
    navigate(qs ? `/?${qs}` : '/')
  }

  if (loading && !candidate) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Spinner size="lg" />
          <p className="text-sm">Загрузка...</p>
        </div>
      </main>
    )
  }

  if (!candidate) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">404</p>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Кандидат не найден</h1>
          <p className="text-gray-400 text-sm mb-6">Возможно, профиль был удалён или ссылка неверная</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
          >
            ← Вернуться к списку
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 group transition-colors"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          Назад к списку
        </button>

        <CandidateDetail candidate={candidate} />
      </div>
    </main>
  )
}
