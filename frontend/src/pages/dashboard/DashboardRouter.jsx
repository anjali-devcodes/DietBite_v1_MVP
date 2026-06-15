import { useAuth } from '../../hooks/useAuth'
import AdminDashboard from './AdminDashboard'
import DietitianDashboard from './DietitianDashboard'
import UserDashboard from './UserDashboard'

export default function DashboardRouter() {
  const { user } = useAuth()
  if (user?.role === 'admin') return <AdminDashboard />
  if (user?.role === 'dietitian') return <DietitianDashboard />
  return <UserDashboard />
}