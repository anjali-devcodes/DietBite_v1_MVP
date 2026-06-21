import { useState, useEffect, useCallback } from 'react'
import { adminService } from '../../api/adminService'
import { AppLayout } from '../../components/Layout/AppLayout'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { useAuth } from '../../hooks/useAuth'

const ROLE_BADGE = {
  admin: 'bg-purple-100 text-purple-700',
  dietitian: 'bg-green-100 text-green-700',
  user: 'bg-blue-100 text-blue-700',
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionStatus, setActionStatus] = useState({})

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await adminService.getUsers()
      setUsers(data.users)
      setTotal(data.total)
    } catch {
      setError('Failed to load users.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const setStatus = (id, msg, type = 'success') => {
    setActionStatus((prev) => ({ ...prev, [id]: { msg, type } }))
    setTimeout(() => setActionStatus((prev) => ({ ...prev, [id]: null })), 3000)
  }

  const handleToggleActive = async (user) => {
    try {
      await adminService.updateUser(user.id, { is_active: !user.is_active })
      setStatus(user.id, user.is_active ? 'User deactivated.' : 'User activated.')
      fetchUsers()
    } catch {
      setStatus(user.id, 'Action failed.', 'error')
    }
  }

  const handleRoleChange = async (user, role) => {
    try {
      await adminService.updateUser(user.id, { role })
      setStatus(user.id, 'Role updated.')
      fetchUsers()
    } catch {
      setStatus(user.id, 'Role update failed.', 'error')
    }
  }

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.full_name}? This cannot be undone.`)) return
    try {
      await adminService.deleteUser(user.id)
      fetchUsers()
    } catch (err) {
      setStatus(user.id, err.response?.data?.detail || 'Delete failed.', 'error')
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">User Management</h1>
            <p className="text-sm text-gray-400 mt-0.5">{total} total users</p>
          </div>
          <Button onClick={fetchUsers} variant="secondary">↻ Refresh</Button>
        </div>

        <Alert type="error" message={error} />

        <Card>
          <CardHeader title="All Users" subtitle="Manage roles, status, and accounts" />
          {loading ? (
            <CardBody>
              <p className="text-sm text-gray-400 text-center py-8">Loading users...</p>
            </CardBody>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      {/* User info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700">
                            {u.full_name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {u.full_name}
                              {u.id === currentUser?.id && (
                                <span className="ml-2 text-xs text-gray-400">(you)</span>
                              )}
                            </p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role selector */}
                      <td className="px-6 py-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u, e.target.value)}
                          disabled={u.id === currentUser?.id}
                          className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer outline-none ${ROLE_BADGE[u.role]} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <option value="user">user</option>
                          <option value="dietitian">dietitian</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>

                      {/* Active status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${u.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-green-500' : 'bg-red-400'}`} />
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Join date */}
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {actionStatus[u.id] && (
                            <span className={`text-xs ${actionStatus[u.id].type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                              {actionStatus[u.id].msg}
                            </span>
                          )}
                          {u.id !== currentUser?.id && (
                            <>
                              <button
                                onClick={() => handleToggleActive(u)}
                                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${u.is_active ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                              >
                                {u.is_active ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDelete(u)}
                                className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  )
}