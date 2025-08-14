import { Toaster } from 'sonner'
import { useRoutes } from 'react-router-dom'
import routes from './routes'
import Header from './components/Header'
import Footer from './components/Footer'
import { useEffect } from 'react'
import { api } from './lib/api'
import { useAuth } from './store/auth'
import FreeShippingBar from './components/FreeShippingBar'

export default function App() {
  const element = useRoutes(routes)
  const setUser = useAuth(s => s.setUser)

  useEffect(() => { api.auth.me().then(u => setUser(u)).catch(() => {}) }, [])

  return (
    <div className="min-h-dvh flex flex-col">
      <FreeShippingBar />         {/* <- fija + spacer */}
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        {element}
      </main>
      <Footer />
      <Toaster position="top-center" richColors expand className="z-[1000]" />
    </div>
  )
}
