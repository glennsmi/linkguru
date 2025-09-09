import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, User } from 'firebase/auth'
import { firebaseConfig } from './config/firebase'
import HomePage from './pages/HomePage.tsx'
import AboutPage from './pages/AboutPage.tsx'
import AuthPage from './pages/AuthPage.tsx'
import DashboardPage from './pages/DashboardPage.tsx'
import LinkManagementPage from './pages/LinkManagementPage.tsx'
import AnalyticsPage from './pages/AnalyticsPage.tsx'
import SettingsPage from './pages/SettingsPage.tsx'
import DesignReferencePage from './pages/DesignReferencePage.tsx'
import AppLayout from './layouts/AppLayout'
import { AuthProvider } from './contexts/AuthContext'
import { TenantProvider } from './contexts/TenantContext'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

function App() {
  const [, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize dark mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lg_theme')
    if (saved) {
      const dark = saved === 'dark'
      document.documentElement.classList.toggle('dark', dark)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Link Guru...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <TenantProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/design" element={<DesignReferencePage />} />
                <Route path="/app" element={<AppLayout />}>
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="links" element={<LinkManagementPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Routes>
            </main>
          </div>
        </Router>
      </TenantProvider>
    </AuthProvider>
  )
}

export default App


