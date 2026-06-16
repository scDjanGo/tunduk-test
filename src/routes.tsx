import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy } from 'react'

const CandidatesPage = lazy(() =>
  import("./pages/CandidatesPage").then(module => ({ default: module.CandidatesPage }))
)
// import { CandidatesPage } from './pages/CandidatesPage'
const  CandidateDetailPage  = lazy(() => import('./pages/CandidateDetailPage').then(module =>({default: module.CandidateDetailPage})))
// import { CandidateDetailPage } from './pages/CandidateDetailPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CandidatesPage />} />
      <Route path="/candidate/:id" element={<CandidateDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
