import { AppLayout } from '../../components/layout/AppLayout'
import { Card, CardBody } from '../../components/ui/Card'
import { useAuth } from '../../hooks/useAuth'

const STAT_CARDS = [
  { label: 'Total Users', value: '—', icon: '👥', color: 'text-purple-600 bg-purple-50' },
  { label: 'Food Items', value: '—', icon: '🥘', color: 'text-green-600 bg-green-50' },
  { label: 'Active Sessions', value: '—', icon: '📡', color: 'text-blue-600 bg-blue-50' },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Welcome back, {user?.full_name} 👋</h1>
          <p className="text-sm text-gray-400 mt-0.5">Here's your platform overview</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {STAT_CARDS.map(({ label, value, icon, color }) => (
            <Card key={label}>
              <CardBody className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
                  {icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{value}</p>
                  <p className="text-sm text-gray-400">{label}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
        <Card>
          <CardBody>
            <p className="text-sm text-gray-400 text-center py-6">
              More analytics coming in future milestones.
            </p>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  )
}