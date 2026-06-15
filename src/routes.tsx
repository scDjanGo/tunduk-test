import { Routes, Route, Navigate } from 'react-router-dom'
import { CandidatesPage } from './pages/CandidatesPage'
import { CandidateDetailPage } from './pages/CandidateDetailPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CandidatesPage />} />
      <Route path="/candidate/:id" element={<CandidateDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
