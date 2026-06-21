import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../../components/Layout/AppLayout'
import { StatCard } from '../../components/dashboard/DashboardCards'
import { RecentList } from '../../components/dashboard/RecentList'
import { adminService } from '../../api/adminService'
import { foodService } from '../../api/foodService'
import { useAuth } from '../../hooks/useAuth'

const ROLE_DOT = {
  admin: 'bg-purple-500',
  dietitian: 'bg-green-500',
  user: 'bg-blue-500',
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [userTotal, setUserTotal] = useState(null)
  const [dietitianCount, setDietitianCount] = useState(null)
  const [foodTotal, setFoodTotal] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])

  const fetchOverview = useCallback(async () => {
    setLoading(true)
    try {
      // NOTE: pulls up to 100 users to compute the role breakdown + "recently joined" list
      // client-side, since /admin/users doesn't sort by created_at or expose role counts yet.
      // Fine at current scale; revisit with a dedicated stats endpoint if the user base grows past ~100.
      const [usersRes, foodsRes] = await Promise.all([
        adminService.getUsers(0, 100),
        foodService.search({ limit: 1 }),
      ])

      const users = usersRes.data.users
      setUserTotal(usersRes.data.total)
      setDietitianCount(users.filter((u) => u.role === 'dietitian').length)
      setFoodTotal(foodsRes.data.total)

      const sorted = [...users].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      setRecentUsers(sorted.slice(0, 5))
    } catch {
      // Silently degrade — cards just stay blank rather than blocking the dashboard.
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOverview() }, [fetchOverview])

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.full_name?.split(' ')[0]} 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Here's how the platform is doing today.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon="👥"
            label="Total Users"
            value={userTotal}
            sublabel={dietitianCount !== null ? `${dietitianCount} dietitians` : undefined}
            color="text-purple-600 bg-purple-50"
            loading={loading}
            onClick={() => navigate('/admin/users')}
          />
          <StatCard
            icon="🥘"
            label="Food Database"
            value={foodTotal}
            sublabel="Indian foods tracked"
            color="text-green-600 bg-green-50"
            loading={loading}
            onClick={() => navigate('/foods')}
          />
          <StatCard
            icon="🧮"
            label="Nutrient Calculator"
            sublabel="Build a meal, see live totals"
            color="text-blue-600 bg-blue-50"
            onClick={() => navigate('/calculator')}
          />
          <StatCard
            icon="👤"
            label="My Profile"
            value={user?.role}
            sublabel={user?.email}
            color="text-gray-600 bg-gray-100"
            onClick={() => navigate('/profile')}
          />
        </div>

        <RecentList
          title="Recently Joined Users"
          loading={loading}
          items={recentUsers}
          emptyIcon="👥"
          emptyMessage="No users yet."
          viewAllLabel="View all users →"
          onViewAll={() => navigate('/admin/users')}
          renderItem={(u) => (
            <div key={u.id} className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-2 h-2 rounded-full shrink-0 ${ROLE_DOT[u.role] || 'bg-gray-300'}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{u.full_name}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400 shrink-0">
                {new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          )}
        />
      </div>
    </AppLayout>
  )
}
