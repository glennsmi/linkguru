import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { User } from 'firebase/auth'
import { useAuth } from '../contexts/AuthContext'
import { useTenant } from '../contexts/TenantContext'

interface HeaderProps {
  user: User | null
}

export default function Header({ user }: HeaderProps) {
  const { logout } = useAuth()
  const { currentTenant } = useTenant()
  const location = useLocation()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', current: location.pathname === '/dashboard' },
    { name: 'Links', href: '/links', current: location.pathname === '/links' },
    { name: 'Analytics', href: '/analytics', current: location.pathname === '/analytics' },
    { name: 'Settings', href: '/settings', current: location.pathname === '/settings' },
  ]

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LG</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Link Guru</h1>
            </Link>
          </div>

          {user && (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      item.current
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                {currentTenant && (
                  <div className="hidden sm:block text-sm text-gray-500">
                    {currentTenant.name}
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </>
          )}

          {!user && (
            <div className="flex items-center space-x-3">
              <Link
                to="/about"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                About
              </Link>
              <Link
                to="/design"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Design
              </Link>
              <Link
                to="/"
                className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {user && showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}