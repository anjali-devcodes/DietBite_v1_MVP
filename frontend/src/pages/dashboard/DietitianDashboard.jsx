import { AppLayout } from '../../components/layout/AppLayout'
import { Card, CardBody } from '../../components/ui/Card'
import { useAuth } from '../../hooks/useAuth'

const QUICK_ACTIONS = [
  { label: 'My Patients', icon: '🧑‍⚕️', desc: 'Manage patient profiles' },
  { label: 'Meal Plans', icon: '🍱', desc: 'Create and assign plans' },
  { label: 'Nutrition Reports', icon: '📋', desc: 'View patient progress' },
  { label: 'Food Search', icon: '🔍', desc: 'Browse IFCT database' },
]

export default function DietitianDashboard() {
  const { user } = useAuth()
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Welcome, {user?.full_name} 👋</h1>
          <p className="text-sm text-gray-400 mt-0.5">Your clinical workspace</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {QUICK_ACTIONS.map(({ label, icon, desc }) => (
            <Card key={label} className="hover:border-green-200 transition-colors cursor-pointer">
              <CardBody className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">
                  {icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}