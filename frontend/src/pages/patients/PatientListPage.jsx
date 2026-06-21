import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { patientService } from '../../api/patientService'
import { useDebounce } from '../../hooks/useDebounce'
import { AppLayout } from '../../components/Layout/AppLayout'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/Alert'
import { PatientForm } from '../../components/patients/PatientForm'

const GOAL_LABELS = {
  weight_loss: 'Weight Loss',
  weight_gain: 'Weight Gain',
  muscle_gain: 'Muscle Gain',
  maintenance: 'Maintenance',
  clinical_management: 'Clinical Management',
}

const GOAL_COLORS = {
  weight_loss: 'bg-orange-50 text-orange-600',
  weight_gain: 'bg-blue-50 text-blue-600',
  muscle_gain: 'bg-purple-50 text-purple-600',
  maintenance: 'bg-green-50 text-green-600',
  clinical_management: 'bg-red-50 text-red-600',
}

export default function PatientListPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 350)

  const [patients, setPatients] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const fetchPatients = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await patientService.list({ search: debouncedSearch, limit: 50 })
      setPatients(data.patients)
      setTotal(data.total)
    } catch {
      setError('Failed to load patients.')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch])

  useEffect(() => { fetchPatients() }, [fetchPatients])

  // Lets the dashboard's "Add Patient" quick action deep-link straight into the create form.
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowForm(true)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const handleCreate = async (payload) => {
    await patientService.create(payload)
    setShowForm(false)
    fetchPatients()
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">My Patients</h1>
            <p className="text-sm text-gray-400 mt-0.5">{total} patient{total !== 1 ? 's' : ''} under your care</p>
          </div>
          <Button onClick={() => setShowForm(true)}>+ Add Patient</Button>
        </div>

        <input
          type="text"
          placeholder="Search patients by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
        />

        <Alert type="error" message={error} />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-36 animate-pulse" />
            ))}
          </div>
        ) : patients.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-center py-12 text-gray-400">
                <p className="text-3xl mb-2">🧑‍⚕️</p>
                <p className="text-sm">No patients yet. Click "Add Patient" to create your first profile.</p>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate(`/patients/${p.id}`)}
                className="text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-green-300 hover:shadow-md transition-all duration-150 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">{p.full_name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${GOAL_COLORS[p.goal]}`}>
                    {GOAL_LABELS[p.goal]}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {p.age ? `${p.age} yrs` : ''} {p.gender ? `· ${p.gender}` : ''}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  {p.current_weight_kg && <span>⚖️ {p.current_weight_kg}kg</span>}
                  {p.height_cm && <span>📏 {p.height_cm}cm</span>}
                </div>
                {p.medical_conditions && (
                  <p className="text-xs text-red-400 truncate">⚠️ {p.medical_conditions}</p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Create Patient Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Add New Patient</h2>
            <PatientForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} submitLabel="Create Patient" />
          </div>
        </div>
      )}
    </AppLayout>
  )
}