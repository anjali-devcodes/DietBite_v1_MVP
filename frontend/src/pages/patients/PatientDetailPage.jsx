import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { patientService } from '../../api/patientService'
import { AppLayout } from '../../components/Layout/AppLayout'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { Input } from '../../components/ui/Input'
import { PatientForm } from '../../components/patients/PatientForm'
import { MealPlanList } from '../../components/mealplans/MealPlanList'

const GOAL_LABELS = {
  weight_loss: 'Weight Loss', weight_gain: 'Weight Gain', muscle_gain: 'Muscle Gain',
  maintenance: 'Maintenance', clinical_management: 'Clinical Management',
}

function bmiCategory(bmi) {
  if (!bmi) return null
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' }
  if (bmi < 25) return { label: 'Normal', color: 'text-green-500' }
  if (bmi < 30) return { label: 'Overweight', color: 'text-orange-500' }
  return { label: 'Obese', color: 'text-red-500' }
}

export default function PatientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)

  const [newWeight, setNewWeight] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [addingMeasurement, setAddingMeasurement] = useState(false)
  const [measurementError, setMeasurementError] = useState('')

  const fetchPatient = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await patientService.getById(id)
      setPatient(data)
    } catch {
      setError('Failed to load patient. They may not exist or you may not have access.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchPatient() }, [fetchPatient])

  const handleUpdate = async (payload) => {
    await patientService.update(id, payload)
    setEditing(false)
    fetchPatient()
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${patient.full_name}'s profile? This cannot be undone.`)) return
    await patientService.remove(id)
    navigate('/patients')
  }

  const handleAddMeasurement = async (e) => {
    e.preventDefault()
    setMeasurementError('')
    if (!newWeight || newWeight <= 0) {
      setMeasurementError('Enter a valid weight.')
      return
    }
    setAddingMeasurement(true)
    try {
      await patientService.addMeasurement(id, { weight_kg: Number(newWeight), notes: newNotes || null })
      setNewWeight('')
      setNewNotes('')
      fetchPatient()
    } catch (err) {
      setMeasurementError(err.response?.data?.detail || 'Failed to add measurement.')
    } finally {
      setAddingMeasurement(false)
    }
  }

  if (loading) {
    return <AppLayout><p className="text-sm text-gray-400 text-center py-12">Loading patient...</p></AppLayout>
  }

  if (error || !patient) {
    return (
      <AppLayout>
        <Alert type="error" message={error || 'Patient not found.'} />
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/patients')}>← Back to Patients</Button>
      </AppLayout>
    )
  }

  const latestMeasurement = patient.measurements?.[patient.measurements.length - 1]
  const bmiInfo = bmiCategory(latestMeasurement?.bmi)
  const weightChange = patient.measurements?.length > 1
    ? (patient.measurements[patient.measurements.length - 1].weight_kg - patient.measurements[0].weight_kg).toFixed(1)
    : null

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <button onClick={() => navigate('/patients')} className="text-sm text-gray-400 hover:text-gray-600">
            ← Back to Patients
          </button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEditing(true)}>Edit Profile</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        </div>

        {/* Profile Summary */}
        <Card>
          <CardBody>
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h1 className="text-xl font-bold text-gray-800">{patient.full_name}</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  {patient.age ? `${patient.age} yrs` : ''} {patient.gender ? `· ${patient.gender}` : ''}
                  {patient.phone ? ` · ${patient.phone}` : ''}
                </p>
              </div>
              <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full font-medium">
                {GOAL_LABELS[patient.goal]}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">Current Weight</p>
                <p className="text-lg font-semibold text-gray-800">{patient.current_weight_kg ?? '—'} kg</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">Target Weight</p>
                <p className="text-lg font-semibold text-gray-800">{patient.target_weight_kg ?? '—'} kg</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">Height</p>
                <p className="text-lg font-semibold text-gray-800">{patient.height_cm ?? '—'} cm</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">BMI</p>
                <p className="text-lg font-semibold text-gray-800">
                  {latestMeasurement?.bmi ?? '—'}
                  {bmiInfo && <span className={`text-xs ml-1 ${bmiInfo.color}`}>({bmiInfo.label})</span>}
                </p>
              </div>
            </div>

            {(patient.medical_conditions || patient.dietary_preferences) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {patient.medical_conditions && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Medical Conditions</p>
                    <p className="text-sm text-gray-700">⚠️ {patient.medical_conditions}</p>
                  </div>
                )}
                {patient.dietary_preferences && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Dietary Preferences</p>
                    <p className="text-sm text-gray-700">🥗 {patient.dietary_preferences}</p>
                  </div>
                )}
              </div>
            )}

            {patient.notes && (
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-1">Notes</p>
                <p className="text-sm text-gray-700">{patient.notes}</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Measurement History */}
        <Card>
          <CardHeader
            title="Progress History"
            subtitle={weightChange ? `${weightChange > 0 ? '+' : ''}${weightChange}kg since first record` : 'Weight tracking over time'}
          />
          <CardBody>
            {/* Add new measurement */}
            <form onSubmit={handleAddMeasurement} className="flex flex-col sm:flex-row sm:items-end gap-3 mb-5 pb-5 border-b border-gray-100">
              <div className="w-full sm:w-32">
                <Input label="New Weight (kg)" type="number" step="0.1" min="0" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} />
              </div>
              <div className="flex-1">
                <Input label="Notes (optional)" value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="e.g. Week 4 check-in" />
              </div>
              <Button type="submit" loading={addingMeasurement} className="w-full sm:w-auto">Log Measurement</Button>
            </form>
            {measurementError && <Alert type="error" message={measurementError} />}

            {/* History list */}
            {patient.measurements?.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No measurements recorded yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {[...patient.measurements].reverse().map((m) => {
                  const info = bmiCategory(m.bmi)
                  return (
                    <div key={m.id} className="flex items-center justify-between flex-wrap gap-2 bg-gray-50 rounded-lg px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{m.weight_kg} kg</p>
                        {m.notes && <p className="text-xs text-gray-400">{m.notes}</p>}
                      </div>
                      <div className="flex items-center gap-4 flex-wrap">
                        {m.bmi && (
                          <span className={`text-xs ${info?.color}`}>BMI {m.bmi} · {info?.label}</span>
                        )}
                        <span className="text-xs text-gray-400">
                          {new Date(m.recorded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardBody>
        </Card>
        
        {/* Meal Plans */}
        <MealPlanList patientId={id} />
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setEditing(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Edit Patient Profile</h2>
            <PatientForm initialData={patient} onSubmit={handleUpdate} onCancel={() => setEditing(false)} submitLabel="Save Changes" />
          </div>
        </div>
      )}
    </AppLayout>
  )
}