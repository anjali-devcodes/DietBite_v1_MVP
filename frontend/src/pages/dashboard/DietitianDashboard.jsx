import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../../components/Layout/AppLayout'
import { StatCard, QuickAction } from '../../components/dashboard/DashboardCards'
import { RecentList } from '../../components/dashboard/RecentList'
import { patientService } from '../../api/patientService'
import { foodService } from '../../api/foodService'
import { useAuth } from '../../hooks/useAuth'

const GOAL_LABELS = {
  weight_loss: 'Weight Loss',
  weight_gain: 'Weight Gain',
  muscle_gain: 'Muscle Gain',
  maintenance: 'Maintenance',
  clinical_management: 'Clinical Management',
}

export default function DietitianDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [patientTotal, setPatientTotal] = useState(null)
  const [foodTotal, setFoodTotal] = useState(null)
  const [recentPatients, setRecentPatients] = useState([])

  const fetchOverview = useCallback(async () => {
    setLoading(true)
    try {
      // Patient list is already ordered newest-first by the backend, so the first
      // 5 results double as "recently added patients" with no extra sorting needed.
      const [patientsRes, foodsRes] = await Promise.all([
        patientService.list({ limit: 5 }),
        foodService.search({ limit: 1 }),
      ])
      setPatientTotal(patientsRes.data.total)
      setRecentPatients(patientsRes.data.patients)
      setFoodTotal(foodsRes.data.total)
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
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.full_name?.split(' ')[0]} 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening across your patients today.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon="🧑‍⚕️"
            label="My Patients"
            value={patientTotal}
            sublabel="under your care"
            color="text-green-600 bg-green-50"
            loading={loading}
            onClick={() => navigate('/patients')}
          />
          <StatCard
            icon="🔍"
            label="Food Search"
            value={foodTotal}
            sublabel="foods in the IFCT database"
            color="text-orange-600 bg-orange-50"
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

        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <QuickAction
              icon="➕"
              label="Add Patient"
              description="Create a new patient profile"
              onClick={() => navigate('/patients?new=true')}
            />
            <QuickAction
              icon="🍱"
              label="Create Meal Plan"
              description="Pick a patient to plan for"
              onClick={() => navigate('/patients')}
            />
            <QuickAction
              icon="🔍"
              label="Search Food"
              description="Browse the Indian food database"
              onClick={() => navigate('/foods')}
            />
          </div>
        </div>

        <RecentList
          title="Recently Added Patients"
          loading={loading}
          items={recentPatients}
          emptyIcon="🧑‍⚕️"
          emptyMessage='No patients yet. Use "Add Patient" above to create your first profile.'
          viewAllLabel="View all patients →"
          onViewAll={() => navigate('/patients')}
          renderItem={(p) => (
            <button
              key={p.id}
              onClick={() => navigate(`/patients/${p.id}`)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{p.full_name}</p>
                <p className="text-xs text-gray-400 truncate">
                  {GOAL_LABELS[p.goal]}{p.age ? ` · ${p.age} yrs` : ''}
                </p>
              </div>
              <span className="text-xs text-gray-400 shrink-0">
                {new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            </button>
          )}
        />
      </div>
    </AppLayout>
  )
}
