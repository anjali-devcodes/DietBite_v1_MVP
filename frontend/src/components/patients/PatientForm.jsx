import { useState } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Alert } from '../ui/Alert'

const GOALS = [
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'weight_gain', label: 'Weight Gain' },
  { value: 'muscle_gain', label: 'Muscle Gain' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'clinical_management', label: 'Clinical Management' },
]

const emptyForm = {
  full_name: '', age: '', gender: '', phone: '', email: '',
  height_cm: '', current_weight_kg: '', target_weight_kg: '',
  medical_conditions: '', dietary_preferences: '', goal: 'maintenance', notes: '',
}

export function PatientForm({ initialData, onSubmit, onCancel, submitLabel = 'Create Patient' }) {
  const [form, setForm] = useState(initialData ? { ...emptyForm, ...initialData } : emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Clean up empty strings -> null for optional numeric fields
      const payload = {
        ...form,
        age: form.age ? Number(form.age) : null,
        height_cm: form.height_cm ? Number(form.height_cm) : null,
        current_weight_kg: form.current_weight_kg ? Number(form.current_weight_kg) : null,
        target_weight_kg: form.target_weight_kg ? Number(form.target_weight_kg) : null,
        gender: form.gender || null,
        email: form.email || null,
      }
      await onSubmit(payload)
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Basic Info */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Basic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name *" name="full_name" value={form.full_name} onChange={handleChange} required />
          <Input label="Age" name="age" type="number" min="0" value={form.age} onChange={handleChange} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
        </div>
      </div>

      {/* Physical Stats */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Physical Stats</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Height (cm)" name="height_cm" type="number" min="0" value={form.height_cm} onChange={handleChange} />
          <Input label="Current Weight (kg)" name="current_weight_kg" type="number" min="0" step="0.1" value={form.current_weight_kg} onChange={handleChange} />
          <Input label="Target Weight (kg)" name="target_weight_kg" type="number" min="0" step="0.1" value={form.target_weight_kg} onChange={handleChange} />
        </div>
      </div>

      {/* Clinical Info */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Clinical Information</h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Goal</label>
            <select name="goal" value={form.goal} onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500">
              {GOALS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </div>
          <Input label="Medical Conditions" name="medical_conditions" value={form.medical_conditions} onChange={handleChange} placeholder="e.g. Type 2 Diabetes, Hypertension" />
          <Input label="Dietary Preferences" name="dietary_preferences" value={form.dietary_preferences} onChange={handleChange} placeholder="e.g. vegetarian, no dairy, Jain food" />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>
        </div>
      </div>

      <Alert type="error" message={error} />

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </div>
    </form>
  )
}