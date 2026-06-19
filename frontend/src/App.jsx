import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { RoleRoute } from './routes/RoleRoute'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import DashboardRouter from './pages/dashboard/DashboardRouter'
import ProfilePage from './pages/ProfilePage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import FoodSearchPage from './pages/FoodSearchPage'
import CalculatorPage from './pages/CalculatorPage'
import PatientListPage from './pages/patients/PatientListPage'
import PatientDetailPage from './pages/patients/PatientDetailPage'
import MealPlanDetailPage from './pages/mealplans/MealPlanDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardRouter /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/foods" element={
            <ProtectedRoute><FoodSearchPage /></ProtectedRoute>
          } />

          <Route path="/patients" element={
            <RoleRoute roles={['dietitian', 'admin']}>
             <PatientListPage />
               </RoleRoute>
          } />
          <Route path="/patients/:id" element={
            <RoleRoute roles={['dietitian', 'admin']}>
             <PatientDetailPage />
              </RoleRoute>
          } />

          <Route path="/admin/users" element={
            <RoleRoute roles={['admin']}>
              <AdminUsersPage />
            </RoleRoute>
          } />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

          <Route path="/calculator" element={
            <ProtectedRoute><CalculatorPage /></ProtectedRoute>
          } />

          <Route path="/meal-plans/:id" element={
            <RoleRoute roles={['dietitian', 'admin']}>
              <MealPlanDetailPage />
              </RoleRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}