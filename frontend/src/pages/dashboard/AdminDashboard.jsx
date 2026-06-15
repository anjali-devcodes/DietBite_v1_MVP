import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome, {user?.full_name}</p>
          </div>
          <Button variant="secondary" onClick={logout}>Logout</Button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {['User Management', 'Food Database', 'System Settings'].map((item) => (
            <div key={item} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-700">{item}</h3>
              <p className="text-xs text-gray-400 mt-1">Coming soon</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}