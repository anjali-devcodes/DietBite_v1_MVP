import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { userService } from '../api/userService'
import { AppLayout } from '../components/layout/AppLayout'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'

export default function ProfilePage() {
  const { user, login } = useAuth()

  const [profile, setProfile] = useState({ full_name: user?.full_name || '', email: user?.email || '' })
  const [profileStatus, setProfileStatus] = useState({ loading: false, success: '', error: '' })

  const [passwords, setPasswords] = useState({ current_password: '', new_password: '', confirm_password: '' })
  const [passStatus, setPassStatus] = useState({ loading: false, success: '', error: '' })

  const handleProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value })
  const handlePassChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value })

  const saveProfile = async (e) => {
    e.preventDefault()
    setProfileStatus({ loading: true, success: '', error: '' })
    try {
      await userService.updateProfile(profile)
      setProfileStatus({ loading: false, success: 'Profile updated successfully.', error: '' })
    } catch (err) {
      setProfileStatus({ loading: false, success: '', error: err.response?.data?.detail || 'Update failed.' })
    }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    if (passwords.new_password !== passwords.confirm_password) {
      setPassStatus({ loading: false, success: '', error: 'New passwords do not match.' })
      return
    }
    setPassStatus({ loading: true, success: '', error: '' })
    try {
      await userService.changePassword({
        current_password: passwords.current_password,
        new_password: passwords.new_password,
      })
      setPasswords({ current_password: '', new_password: '', confirm_password: '' })
      setPassStatus({ loading: false, success: 'Password changed successfully.', error: '' })
    } catch (err) {
      setPassStatus({ loading: false, success: '', error: err.response?.data?.detail || 'Password change failed.' })
    }
  }

  const ROLE_BADGE = {
    admin: 'bg-purple-100 text-purple-700',
    dietitian: 'bg-green-100 text-green-700',
    user: 'bg-blue-100 text-blue-700',
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your account details</p>
        </div>

        {/* Account Info Banner */}
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold text-green-700">
              {user?.full_name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{user?.full_name}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_BADGE[user?.role]}`}>
                {user?.role}
              </span>
            </div>
          </CardBody>
        </Card>

        {/* Update Profile */}
        <Card>
          <CardHeader title="Personal Information" subtitle="Update your name and email" />
          <CardBody>
            <form onSubmit={saveProfile} className="flex flex-col gap-4">
              <Input
                label="Full Name"
                name="full_name"
                value={profile.full_name}
                onChange={handleProfileChange}
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleProfileChange}
                required
              />
              <Alert type="success" message={profileStatus.success} />
              <Alert type="error" message={profileStatus.error} />
              <div className="flex justify-end">
                <Button type="submit" loading={profileStatus.loading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader title="Change Password" subtitle="Choose a strong password" />
          <CardBody>
            <form onSubmit={savePassword} className="flex flex-col gap-4">
              <Input
                label="Current Password"
                name="current_password"
                type="password"
                value={passwords.current_password}
                onChange={handlePassChange}
                required
              />
              <Input
                label="New Password"
                name="new_password"
                type="password"
                value={passwords.new_password}
                onChange={handlePassChange}
                required
              />
              <Input
                label="Confirm New Password"
                name="confirm_password"
                type="password"
                value={passwords.confirm_password}
                onChange={handlePassChange}
                required
              />
              <Alert type="success" message={passStatus.success} />
              <Alert type="error" message={passStatus.error} />
              <div className="flex justify-end">
                <Button type="submit" loading={passStatus.loading}>
                  Change Password
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  )
}