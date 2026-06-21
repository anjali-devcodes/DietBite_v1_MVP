import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../../components/Layout/AppLayout'
import { StatCard } from '../../components/dashboard/DashboardCards'
import { Card, CardBody } from '../../components/ui/Card'
import { foodService } from '../../api/foodService'
import { useAuth } from '../../hooks/useAuth'

export default function UserDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [foodTotal, setFoodTotal] = useState(null)

  const fetchOverview = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await foodService.search({ limit: 1 })
      setFoodTotal(data.total)
    } catch {
      // Silently degrade — the card just stays blank rather than blocking the dashboard.
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOverview() }, [fetchOverview])

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.full_name?.split(' ')[0]} 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Track your nutrition today.</p>
        </div>

        {/* Only 3 cards here — these are the only features this role actually has access to.
            (Daily Tracker / My Progress were removed: they didn't link to any real page.) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon="🔍"
            label="Food Search"
            value={foodTotal}
            sublabel="Indian foods to browse"
            color="text-orange-600 bg-orange-50"
            loading={loading}
            onClick={() => navigate('/foods')}
          />
          <StatCard
            icon="🧮"
            label="Nutrient Calculator"
            sublabel="Calculate nutrition for any meal"
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

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl shrink-0">💡</div>
            <div>
              <p className="text-sm font-medium text-gray-800">Tip: combine foods in the Nutrient Calculator</p>
              <p className="text-xs text-gray-400 mt-0.5">Add multiple foods with custom quantities to see combined calories, macros, and key micronutrients update live.</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  )
}
