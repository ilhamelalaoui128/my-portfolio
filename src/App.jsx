import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import Admin from './pages/Admin'
import LoadingScreen from './components/LoadingScreen'
import { ThemeProvider } from './hooks/useTheme'
import { useAppLoader } from './hooks/useAppLoader'
import { PortfolioDataProvider, usePortfolioData } from './context/PortfolioDataContext'
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext'
import BackToTop from './components/BackToTop'

function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

function DocumentTitle() {
  const { pathname } = useLocation()
  const { profile } = usePortfolioData()

  useEffect(() => {
    if (!profile) return
    if (pathname === '/') {
      document.title = `${profile.fullName || profile.name} — ${profile.title}`
    } else if (pathname.startsWith('/admin')) {
      document.title = `Admin — ${profile.name}`
    }
  }, [pathname, profile])

  return null
}

function AppContent() {
  const { isReady, progress } = useAppLoader()
  const { ready } = usePortfolioData()
  const { pathname } = useLocation()
  const { session, checking } = useAdminAuth()

  const showContent = ready && isReady
  const isAdmin = pathname === '/admin'
  const showChrome = showContent && !(isAdmin && (!session || checking))

  return (
    <>
      <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
        {showChrome && <Navbar />}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        {showChrome && <Footer />}
      </div>
      <BackToTop />

      <AnimatePresence mode="wait">
        {!showContent && <LoadingScreen key="loader" progress={progress} />}
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToHash />
        <a
          href="#hero"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
        >
          Aller au contenu
        </a>
        <PortfolioDataProvider>
          <AdminAuthProvider>
            <DocumentTitle />
            <AppContent />
          </AdminAuthProvider>
        </PortfolioDataProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
