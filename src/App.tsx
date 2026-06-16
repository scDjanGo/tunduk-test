import { Suspense } from 'react'
import { AppRoutes } from './routes'
import { PageLoader } from './components/UI/PageLoader'

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AppRoutes />
    </Suspense>
  )
}

export default App
