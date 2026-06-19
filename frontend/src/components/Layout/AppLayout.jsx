import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const NAV_LINKS = {
  admin: [
    { to: '/dashboard', label: 'Overview', icon: '📊' },
    { to: '/foods', label: 'Food Search', icon: '🔍' },
    { to: '/calculator', label: 'Nutrient Calculator', icon: '🧮' },
    { to: '/admin/users', label: 'User Management', icon: '👥' },
    { to: '/profile', label: 'My Profile', icon: '👤' },
  ],
  dietitian: [
    { to: '/dashboard', label: 'Overview', icon: '📊' },
    { to: '/patients', label: 'My Patients', icon: '🧑‍⚕️' },
    { to: '/foods', label: 'Food Search', icon: '🔍' },
    { to: '/calculator', label: 'Nutrient Calculator', icon: '🧮' },
    { to: '/profile', label: 'My Profile', icon: '👤' },
  ],
  user: [
    { to: '/dashboard', label: 'Overview', icon: '📊' },
    { to: '/foods', label: 'Food Search', icon: '🔍' },
    { to: '/calculator', label: 'Nutrient Calculator', icon: '🧮' },
    { to: '/profile', label: 'My Profile', icon: '👤' },
  ],
}

const ROLE_BADGE = {
  admin: 'bg-purple-100 text-purple-700',
  dietitian: 'bg-green-100 text-green-700',
  user: 'bg-blue-100 text-blue-700',
}

export function AppLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const links = NAV_LINKS[user?.role] || NAV_LINKS.user

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-white border-r border-gray-200 flex flex-col transition-all duration-200`}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-100">
          <span className="text-2xl">🥗</span>
          {sidebarOpen && (
            <span className="font-bold text-green-700 text-lg">DietBite</span>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span className="text-lg">{icon}</span>
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="p-3 border-t border-gray-100">
          {sidebarOpen ? (
            <div className="flex flex-col gap-2">
              <div className="px-2">
                <p className="text-sm font-medium text-gray-800 truncate">{user?.full_name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_BADGE[user?.role]}`}>
                  {user?.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} className="w-full flex justify-center py-2 text-red-400 hover:text-red-600">
              🚪
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ☰
          </button>
          <h1 className="text-gray-800 font-semibold text-sm">
            Indian Nutrition Intelligence Platform
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}