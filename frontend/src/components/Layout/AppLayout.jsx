import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Icon } from '../ui/Icon'
import { Badge } from '../ui/Badge'

const NAV_LINKS = {
  admin: [
    { to: '/dashboard', label: 'Overview', icon: 'dashboard' },
    { to: '/foods', label: 'Food Search', icon: 'search' },
    { to: '/calculator', label: 'Nutrient Calculator', icon: 'calculator' },
    { to: '/admin/users', label: 'User Management', icon: 'users' },
    { to: '/profile', label: 'My Profile', icon: 'user' },
  ],
  dietitian: [
    { to: '/dashboard', label: 'Overview', icon: 'dashboard' },
    { to: '/patients', label: 'My Patients', icon: 'users' },
    { to: '/foods', label: 'Food Search', icon: 'search' },
    { to: '/calculator', label: 'Nutrient Calculator', icon: 'calculator' },
    { to: '/profile', label: 'My Profile', icon: 'user' },
  ],
  user: [
    { to: '/dashboard', label: 'Overview', icon: 'dashboard' },
    { to: '/foods', label: 'Food Search', icon: 'search' },
    { to: '/calculator', label: 'Nutrient Calculator', icon: 'calculator' },
    { to: '/profile', label: 'My Profile', icon: 'user' },
  ],
}

/**
 * Shared sidebar content (logo, nav links, user/logout block).
 * Rendered twice: once inside the desktop collapsible <aside>, once inside
 * the mobile off-canvas drawer. `collapsed` only applies to the desktop variant.
 */
function SidebarContent({ links, collapsed, user, onNavigate, onLogout }) {
  return (
    <>
      <div className="flex items-center gap-2 px-4 py-5 border-b border-surface-100">
        <span className="text-2xl">🥗</span>
        {!collapsed && (
          <span className="font-bold text-brand-700 text-lg">DietBite</span>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 flex flex-col gap-1 overflow-y-auto">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
              ${isActive
                ? 'bg-brand-50 text-brand-700'
                : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
              }`
            }
          >
            <Icon name={icon} size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-surface-100">
        {!collapsed ? (
          <div className="flex flex-col gap-2">
            <div className="px-2">
              <p className="text-sm font-medium text-surface-800 truncate">{user?.full_name}</p>
              <p className="text-xs text-surface-400 truncate">{user?.email}</p>
              <Badge variant={user?.role} className="mt-1">{user?.role}</Badge>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 rounded-md transition-colors"
            >
              <Icon name="logout" size={16} />
              Logout
            </button>
          </div>
        ) : (
          <button onClick={onLogout} className="w-full flex justify-center py-2 text-danger-400 hover:text-danger-600">
            <Icon name="logout" size={18} />
          </button>
        )}
      </div>
    </>
  )
}

export function AppLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true) // desktop collapse/expand
  const [mobileOpen, setMobileOpen] = useState(false)   // mobile off-canvas drawer
  const links = NAV_LINKS[user?.role] || NAV_LINKS.user

  // Prevent background scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleLogout = () => {
    setMobileOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-surface-50">
      {/* Desktop sidebar (collapsible, hidden on mobile) */}
      <aside
        className={`hidden md:flex ${sidebarOpen ? 'w-60' : 'w-16'} bg-surface-0 border-r border-surface-200 flex-col transition-all duration-200`}
      >
        <SidebarContent links={links} collapsed={!sidebarOpen} user={user} onLogout={handleLogout} />
      </aside>

      {/* Mobile off-canvas drawer + backdrop */}
      <div
        className={`md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 max-w-[80vw] bg-surface-0 border-r border-surface-200 flex flex-col transform transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-end px-2 pt-2">
          <button
            onClick={() => setMobileOpen(false)}
            className="text-surface-400 hover:text-surface-600 p-2"
            aria-label="Close menu"
          >
            <Icon name="x" size={20} />
          </button>
        </div>
        <SidebarContent
          links={links}
          collapsed={false}
          user={user}
          onNavigate={() => setMobileOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-surface-0 border-b border-surface-200 px-4 md:px-6 py-4 flex items-center gap-4">
          {/* Mobile: opens the drawer */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-surface-400 hover:text-surface-600 transition-colors"
            aria-label="Open menu"
          >
            <Icon name="menu" size={20} />
          </button>
          {/* Desktop: collapses/expands the sidebar */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:inline-flex text-surface-400 hover:text-surface-600 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Icon name="menu" size={20} />
          </button>
          <h1 className="text-surface-800 font-semibold text-sm truncate">
            Indian Nutrition Intelligence Platform
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}